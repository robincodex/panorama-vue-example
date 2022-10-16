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

const cli_prefix = `[${chalk.magenta('Panorama')}]`;

function path_step(p: string) {
    return p.replace(/\\/g, '/');
}

function file_color(s: string) {
    return chalk.green(s);
}

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
            vue({ customElement: false }),
            // @ts-ignore
            vueJsx(),
            scssCompiler({ prefix: cli_prefix }),
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

function tsOptions(rootPath: string): RollupTypescriptOptions {
    return {
        tsconfig: path.join(rootPath, `tsconfig.json`),
        transformers: {
            after: [
                {
                    type: 'program',
                    factory(program) {
                        // 显示错误
                        const diagnostics = [
                            ...program.getGlobalDiagnostics(),
                            ...program.getOptionsDiagnostics(),
                            ...program.getSemanticDiagnostics(),
                            ...program.getSyntacticDiagnostics(),
                            ...program.getDeclarationDiagnostics(),
                            ...program.getConfigFileParsingDiagnostics()
                        ];
                        for (const d of diagnostics) {
                            let msg = '';
                            if (typeof d.messageText === 'string') {
                                msg = d.messageText;
                            } else {
                                msg = d.messageText.messageText;
                            }
                            console.log(`${cli_prefix} TS Error: ${chalk.redBright(
                                d.file?.fileName.replace(rootPath + '/', '')
                            )}: ${chalk.yellow(
                                d.file?.getLineAndCharacterOfPosition(
                                    d.start || 0
                                ).line
                            )}
${cli_prefix} TS Error: - ${chalk.red(msg)}`);
                        }
                        return () => {
                            return f => {
                                return f;
                            };
                        };
                    }
                }
            ]
        }
    };
}
