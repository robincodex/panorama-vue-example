import { basename, join } from 'node:path';
import { fileURLToPath, pathToFileURL, URL } from 'node:url';
import { Plugin } from 'rollup';
import { compileStringAsync, StringOptions } from 'sass';
import fse from 'fs-extra';
import { glob } from 'glob';
import { promisify } from 'node:util';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

/**
 * 根据pages下每个页面的vue文件和scss文件按照页面名称合并成一个scss然后进行编译，
 * scss文件需要被import才能加入编译。
 * 需要注意的是启动监听后加进来的scss文件可能会存在顺序问题，最好重启监听。
 */
export default function scssCompiler(options?: {
    sass?: StringOptions<'async'>;
    prefix?: string;
}): Plugin {
    const existsScopeId = /\[data-v-[a-z0-9]{8}\]/;
    const replaceScopeId = /\[(data-v-[a-z0-9]{8})\]/g;
    // 缓存代码
    let srcCache: Record<
        string,
        Array<{ pathname: string; code: string }>
    > = {};
    const prefix = options?.prefix || '';

    /** 将如[data-v-xxxxx]这类的样式改为class，因为PUI不支持[]这类匹配 */
    function fitCode(code: string) {
        if (existsScopeId.test(code)) {
            return code.replace(replaceScopeId, '.$1');
        }
        return code;
    }

    /**
     * 查找页面名称
     */
    function findPageName(p: string) {
        const m = p.match(/[\\\/]pages[\\\/]([\w\d\-\_]+)[\\\/]/);
        if (m) {
            return m[1];
        }
        return '';
    }

    return {
        name: 'scss-compiler',
        // 捕获scss代码并缓存
        transform(code, id) {
            const u = new URL(id, 'file:');
            if (
                u.pathname.endsWith('.scss') ||
                u.searchParams.has('lang.scss')
            ) {
                code = fitCode(code);
                const name = findPageName(id);
                if (!srcCache[name]) {
                    srcCache[name] = [];
                }
                const cache = srcCache[name].find(
                    v => v.pathname === u.pathname
                );
                if (cache) {
                    cache.code = code;
                } else {
                    srcCache[name].push({ pathname: u.pathname, code });
                }
                return '';
            }
        },
        // 生成scss代码并编译，如果没有改动则不提交文件输出
        async generateBundle(o, bundle, isWrite) {
            if (!o.dir) {
                return;
            }
            for (const [fileName, codeList] of Object.entries(srcCache)) {
                const code = codeList.map(v => v.code).join('\n\n');
                const result = await compileStringAsync(code, {
                    importer: {
                        findFileUrl(url, options) {
                            console.log(url);
                            // const u = new URL(url, 'file:');
                            return null;
                        }
                    },
                    url: pathToFileURL(
                        join(__dirname, `../pages/${fileName}/${fileName}.scss`)
                    )
                });

                // 比较编译后的结果，如果没有变化则不输出
                const dest = join(o.dir, `${fileName}.css`)
                    .replace(/\\/g, '/')
                    .replace('panorama/scripts/', 'panorama/styles/');
                if (existsSync(dest)) {
                    const content = await readFile(dest, 'utf8');
                    if (content === result.css) {
                        continue;
                    }
                }

                // 加入资源文件
                this.emitFile({
                    name: `${fileName}.css`,
                    source: result.css,
                    type: 'asset'
                });
            }
        },
        /**
         * 目的是将编译到scripts的css文件移动到styles，如果不需要则可以注释掉
         */
        async writeBundle(o) {
            if (!o.dir) {
                return;
            }
            const files = await promisify(glob)(
                join(o.dir, '*.css').replace(/\\/g, '/')
            );
            for (const f of files) {
                const target = f.replace(
                    'panorama/scripts/',
                    'panorama/styles/'
                );
                if (existsSync(target)) {
                    const src = await readFile(f);
                    const dest = await readFile(target);
                    if (!src.equals(dest)) {
                        await fse.move(f, target, { overwrite: true });
                        console.log(prefix + ' ✅ ' + basename(f));
                    } else {
                        await fse.remove(f);
                    }
                } else {
                    await fse.move(f, target, { overwrite: true });
                    console.log(prefix + ' ✅ ' + basename(f));
                }
            }
        }
    };
}
