import rollupTypescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import CompatibleVueScopeID from './plugins/compatible-vue-scope-id';
import { fileURLToPath, URL } from 'node:url';
import alias from '@rollup/plugin-alias';
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss';
import { writeFileSync } from 'node:fs';

const pageNameMatcher = /pages\\([\w\d\-_]+)\\App.vue/;

/** @type import('rollup').RollupOptions */
const options = {
    input: {
        lowhud: fileURLToPath(
            new URL('./pages/lowhud/main.ts', import.meta.url)
        ),
        shop: fileURLToPath(new URL('./pages/shop/main.ts', import.meta.url))
    },
    output: {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
    },
    plugins: [
        alias({
            entries: [
                {
                    find: '@',
                    replacement: `${path.resolve(import.meta.url, 'src')}`
                }
            ],
            customResolver: nodeResolve({
                extensions: ['.ts', '.tsx', '.vue']
            })
        }),
        vue({ customElement: false }),
        vueJsx(),
        scss({
            output: function (styles, styleNodes) {
                console.log(styles);
                for (const [id, code] of Object.entries(styleNodes)) {
                    const u = new URL(id);
                    const result = u.pathname.match(pageNameMatcher);
                    if (result) {
                        console.log(result[1]);
                        writeFileSync(`dist/${result[1]}.css`, code);
                    }
                }
            }
        }),
        commonjs(),
        nodeResolve(),
        rollupTypescript(),
        babel({
            exclude: 'node_modules/**',
            extensions: ['.ts', '.tsx', '.vue'],
            babelHelpers: 'bundled',
            presets: [['@babel/preset-env', { modules: false }]]
        })
    ],
    manualChunks(id, api) {
        if (id.includes('plugin-vue')) {
            return 'common';
        }
        if (id.search(/[\\/]global[\\/]/) >= 0) {
            return 'common';
        }
        if (id.search(/[\\/]node_modules[\\/]/) >= 0) {
            if (id.includes('/node_modules/panorama-vue/')) {
                console.log(id);
                return;
            }
            return 'common';
        }
    }
};

module.exports = options;
