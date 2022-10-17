import path, { basename, join } from 'node:path';
import { Plugin } from 'rollup';

export default function compatiblePanorama(options?: {}): Plugin {
    return {
        name: 'compatible-panorama',
        renderChunk(code, chunk, options) {
            if (chunk.fileName === 'common.js') {
                return (
                    'const common = {};\n(function () {\n\nconst exports = common;\n\n' +
                    code +
                    '\n\n})(this);\n'
                );
            } else if (
                code.indexOf(`var common = require('./common.js');`) > 0
            ) {
                return code.replace(`var common = require('./common.js');`, '');
            }
            return code;
        },
        resolveId(source, importer, options) {
            // console.log(source);
            // 指向 @vue/runtime-core 到 @panorama-vue/runtime-core
            if (source === '@vue/runtime-core') {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/runtime-core/index.js'
                );
            }
            if (source.includes('node_modules\\@vue\\runtime-core')) {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/runtime-core/index.js'
                );
            }
            if (
                source.endsWith(
                    'node_modules\\vue\\dist\\vue.runtime.esm-bundler.js'
                )
            ) {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/runtime-core/index.js'
                );
            }
            // 指向 @vue/reactivity 到 @panorama-vue/reactivity
            if (source === '@vue/reactivity') {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/reactivity/index.js'
                );
            }
            if (source.includes('node_modules\\@vue\\reactivity')) {
                return path.resolve(
                    __dirname,
                    '../node_modules/@panorama-vue/reactivity/index.js'
                );
            }
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
