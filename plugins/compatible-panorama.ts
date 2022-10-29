import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path, { basename, join } from 'node:path';
import { Plugin } from 'rollup';

const xmlFile = `<root>
    <scripts>
        <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
        <include src="file://{resources}/scripts/custom_game/#name#" />
    </scripts>
    <Panel hittest="false" >
    </Panel>
</root>
`;

export default function compatiblePanorama(options?: {}): Plugin {
    const exportsPositionsearch = `'use strict';`;
    return {
        name: 'compatible-panorama',
        async renderChunk(code, chunk, options) {
            const hasExp = chunk.exports.length > 0;
            if (hasExp) {
                // 给模块创建xml文件
                const xmlPath = join(
                    __dirname,
                    `../content/vue_example/panorama/layout/custom_game/${chunk.fileName.replace(
                        '.js',
                        '.xml'
                    )}`
                );
                const content = xmlFile.replace('#name#', chunk.fileName);
                await writeFile(xmlPath, content);
            }

            // 把每行开头`require('./common.js');`换成空字符串
            code = code.replace(/^require\('\.\/common.js'\);/m, '');

            // 加入exports和模块加载
            const index = code.indexOf(exportsPositionsearch);
            if (index >= 0) {
                return (
                    code.slice(0, index + exportsPositionsearch.length) +
                    `${
                        hasExp
                            ? ` const exports = {}; GameUI.__loadModule('${chunk.fileName.replace(
                                  '.js',
                                  ''
                              )}', exports);`
                            : ''
                    } const require = GameUI.__require;` +
                    code.slice(index + exportsPositionsearch.length)
                );
            }
            return code;
        },
        resolveId(source, importer, options) {
            if (source.includes('@common')) {
                return source.replace(
                    /\@common\/(.*)/,
                    join(__dirname, '../pages/common/$1.ts').replace(/\\/g, '/')
                );
            }
            // // console.log(source);
            // // 指向 @vue/runtime-core 到 @panorama-vue/runtime-core
            // if (source === '@vue/runtime-core') {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/runtime-core/index.js'
            //     );
            // }
            // if (source.includes('node_modules\\@vue\\runtime-core')) {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/runtime-core/index.js'
            //     );
            // }
            // if (
            //     source.endsWith(
            //         'node_modules\\vue\\dist\\vue.runtime.esm-bundler.js'
            //     )
            // ) {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/runtime-core/index.js'
            //     );
            // }
            // if (source === 'vue') {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/runtime-core/index.js'
            //     );
            // }
            // // 指向 @vue/reactivity 到 @panorama-vue/reactivity
            // if (source === '@vue/reactivity') {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/reactivity/index.js'
            //     );
            // }
            // if (source.includes('node_modules\\@vue\\reactivity')) {
            //     return path.resolve(
            //         __dirname,
            //         '../node_modules/@panorama-vue/reactivity/index.js'
            //     );
            // }
            // 指向 @vue/runtime-dom 到 @panorama-vue/renderer
            if (source === '@vue/runtime-dom') {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/renderer/index.js'
                );
            }
            if (source.includes('node_modules\\@vue\\runtime-dom')) {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/renderer/index.js'
                );
            }
        }
    };
}
