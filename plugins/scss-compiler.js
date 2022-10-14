import { URL } from 'node:url';
import { compileStringAsync } from 'sass';

// @ts-check

/**
 * @param sassOptions {import('sass').StringOptions<"async"> | undefined}
 * @returns {import('rollup').Plugin}
 */
export default function ScssCompiler(sassOptions) {
    const existsScopeId = /\[data-v-[a-z0-9]{8}\]/;
    const replaceScopeId = /\[(data-v-[a-z0-9]{8})\]/g;
    /** @type Record<string, string> */
    const srcCompose = {};

    /** 适配PUI样式 */
    function fitCode(code) {
        if (existsScopeId.test(code)) {
            return code.replace(replaceScopeId, '.$1');
        }
        return code;
    }

    /**
     * 查找页面名称
     * @param {string} p
     */
    function findPageName(p) {
        const m = p.match(/[\\\/]pages[\\\/]([\w\d\-\_]+)[\\\/]/);
        if (m) {
            return m[1];
        }
        return '';
    }

    return {
        name: 'scss-compiler',
        transform(code, id) {
            // console.log(id);
            const u = new URL(id, 'file:');
            if (
                u.pathname.endsWith('.scss') ||
                u.searchParams.has('lang.scss')
            ) {
                code = fitCode(code);
                const name = findPageName(id);
                srcCompose[name] = (srcCompose[name] || '') + '\n\n' + code;
                // console.log(code);
                return '';
            }
        },
        async generateBundle(options, bundle, isWrite) {
            // bundle[]
            for (const [fileName, code] of Object.entries(srcCompose)) {
                const result = await compileStringAsync(code, sassOptions);
                this.emitFile({
                    fileName: `${fileName}.css`,
                    name: `${fileName}.css`,
                    source: result.css,
                    type: 'asset'
                });
            }
        }
    };
}
