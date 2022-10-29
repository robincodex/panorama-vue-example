import rollupTypescript, {
    RollupTypescriptOptions
} from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import scssCompiler from './plugins/scss-compiler';
import path, { join } from 'node:path';
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
            alias({
                entries: [
                    {
                        find: '@common/(.*)',
                        replacement: join(__dirname, 'pages/common/$1.ts')
                    }
                ]
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production'),
                // 'process.env.NODE_ENV': JSON.stringify('development'),
                __DEV__: false,
                __TEST__: false,
                __ESM_BUNDLER__: false,
                __FEATURE_SUSPENSE__: false,
                __COMPAT__: false,
                __FEATURE_OPTIONS_API__: false,
                __FEATURE_PROD_DEVTOOLS__: false,
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_OPTIONS_API__: false
            }),
            // rollupTypescript({
            //     tsconfig: path.join(rootPath, `tsconfig.json`)
            // }),
            // @ts-ignore
            vue({ isProduction: false, customElement: false }),
            // @ts-ignore
            vueJsx(),
            scssCompiler({ prefix: cli_prefix }),
            compatiblePanorama(),
            commonjs(),
            nodeResolve(),
            babel({
                comments: false,
                exclude: 'node_modules/**',
                extensions: ['.js', '.ts', '.tsx', '.vue'],
                babelHelpers: 'bundled'
            })
        ],
        manualChunks(id, api) {
            // const u = new URL(id, 'file:');
            if (id.includes('node_modules') && id.includes('vue')) {
                return 'vue';
            }
            if (id.search(/[\\/]common[\\/]/) >= 0) {
                return 'common';
            }
            if (id.search(/[\\/]node_modules[\\/]/) >= 0) {
                return 'common';
            }
        }
    };

    return options;
}
