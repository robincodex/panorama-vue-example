import { basename, join } from 'node:path';
import { URL } from 'node:url';
import { Plugin } from 'rollup';
import { compileStringAsync, StringOptions } from 'sass';
import fse from 'fs-extra';
import { glob } from 'glob';
import { promisify } from 'node:util';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export default function scssCompiler(options?: {
    sass?: StringOptions<'async'>;
    prefix?: string;
}): Plugin {
    const existsScopeId = /\[data-v-[a-z0-9]{8}\]/;
    const replaceScopeId = /\[(data-v-[a-z0-9]{8})\]/g;
    let srcCompose: Record<string, string> = {};
    const prefix = options?.prefix || '';

    /** 适配PUI样式 */
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
        transform(code, id) {
            const u = new URL(id, 'file:');
            if (
                u.pathname.endsWith('.scss') ||
                u.searchParams.has('lang.scss')
            ) {
                code = fitCode(code);
                const name = findPageName(id);
                srcCompose[name] = (srcCompose[name] || '') + '\n\n' + code;
                return '';
            }
        },
        async generateBundle(o, bundle, isWrite) {
            if (!o.dir) {
                return;
            }
            for (const [fileName, code] of Object.entries(srcCompose)) {
                const result = await compileStringAsync(code, options?.sass);

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
            srcCompose = {};
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
