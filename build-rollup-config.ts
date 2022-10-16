import rollupTypescript, {
    RollupTypescriptOptions
} from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import scssCompiler from './plugins/scss-compiler';
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import { RollupWatchOptions } from 'rollup';
import chalk from 'chalk';
import { existsSync, readdirSync, statSync } from 'node:fs';
import alias from '@rollup/plugin-alias';
import compatiblePanorama from './plugins/compatible-panorama';
import replace from '@rollup/plugin-replace';

const cli_prefix = `[${chalk.magenta('Panorama')}]`;

function isDir(p: string) {
    return statSync(p).isDirectory();
}

export default function GetRollupWatchOptions(rootPath: string) {
    // 入口文件夹
    const Dirs = readdirSync(rootPath).filter(
        v =>
            isDir(path.join(rootPath, v)) &&
            v !== 'global' &&
            existsSync(path.join(rootPath, `${v}/${v}.ts`))
    );
    console.log(Dirs.map(v => cli_prefix + ' 👁️  ' + v).join('\n'));

    const options: RollupWatchOptions = {
        input: Dirs.map(v => {
            return path.join(rootPath, `./${v}/${v}.ts`);
        }),
        output: {
            sourcemap: false,
            dir: path.join(
                __dirname,
                `./content/vue_example/panorama/scripts/custom_game/`
            ),
            format: 'cjs',
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`
        },
        plugins: [
            // @ts-ignore
            vue({ isProduction: true, customElement: false }),
            // @ts-ignore
            vueJsx(),
            scssCompiler({ prefix: cli_prefix }),
            compatiblePanorama(),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production'),
                __DEV__: false,
                __TEST__: false,
                __ESM_BUNDLER__: false,
                __FEATURE_SUSPENSE__: false,
                __COMPAT__: false,
                __FEATURE_OPTIONS_API__: false,
                __FEATURE_PROD_DEVTOOLS__: false
            }),
            commonjs(),
            nodeResolve(),
            babel({
                exclude: 'node_modules/**',
                extensions: ['.ts', '.tsx', '.vue'],
                babelHelpers: 'bundled',
                presets: [['@babel/preset-env', { modules: false }]]
            })
            // rollupTypescript(tsOptions(rootPath))
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

    return options;
}
