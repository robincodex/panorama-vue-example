import chokidar from 'chokidar';
import {
    readdirSync,
    readFileSync,
    statSync,
    existsSync,
    Stats,
    writeFileSync
} from 'fs';
import * as rollup from 'rollup';
import path from 'path';
import chalk from 'chalk';
import {
    PreloadTemplates,
    RenderPanoramaXML,
    RenderPanoramaXMLOptions
} from 'dota2-panorama-xml-static-element';
import glob from 'glob';
import { readFile } from 'fs/promises';
import GetRollupWatchOptions from './build-rollup-config';

const cli_prefix = `[${chalk.magenta('Panorama')}]`;
const rootPath = path_step(path.join(__dirname, 'pages'));

function path_step(p: string) {
    return p.replace(/\\/g, '/');
}

function file_color(s: string) {
    return chalk.green(s);
}

function isDir(p: string) {
    return statSync(p).isDirectory();
}

/**
 * 启动Rollup编译Vue
 */
function StartRollup(): void {
    let options: rollup.RollupWatchOptions = GetRollupWatchOptions(rootPath);
    let watcher = rollup.watch(options);

    // 监听错误
    watcher.on('event', async evt => {
        if (evt.code === 'ERROR') {
            const f = path_step(evt.error.loc?.file || '').replace(
                rootPath + '/',
                ''
            );
            console.log(
                cli_prefix +
                    ' Build Error: ' +
                    chalk.red(f) +
                    ': ' +
                    chalk.yellow(evt.error.loc?.line)
            );
            console.log(
                cli_prefix + ' Build Error: ' + chalk.red(evt.error.message)
            );
        }
    });

    watcher.on('change', p => {
        console.log(cli_prefix + ' ✒️  ' + file_color(path.basename(p)));
    });
}

/**
 * 复制XML
 */
async function onXMLChange(filePath: string, stats?: Stats | undefined) {
    let dir = path.dirname(filePath);
    while (path.basename(path.join(dir, '..')) !== 'pages') {
        dir = path.join(dir, '..');
    }
    let dirName = path.basename(dir);
    const fileName = path.basename(filePath).replace('.xml', '');
    console.log(
        cli_prefix +
            ' XML ' +
            file_color(`${fileName}.xml`) +
            ' >> ' +
            chalk.blue(dirName + '.xml')
    );
    const triggerFile = path.join(dir, `${dirName}.xml`);

    let content = await RenderPanoramaXML(triggerFile, {
        indentation: ' ',
        templateRoots: [path.join(rootPath, 'Components'), dir],
        snippetsFiles: glob.sync(
            path
                .join(rootPath, 'Components/Snippets/**/*.xml')
                .replace(/\\/g, '/')
        )
    });
    writeFileSync(
        `./content/vue_example/panorama/layout/custom_game/${dirName}.xml`,
        content
    );
}

/**
 * 任务入口
 */
export default async function TaskPUI() {
    StartRollup();
    // 监听XML
    // const xmlFiles = glob.sync(path.join(rootPath, '**/*.xml'));
    // const watchXML = chokidar.watch(
    //     [...xmlFiles, path.join(rootPath, '**/*.xml')],
    //     { ignoreInitial: false }
    // );
    // watchXML.on('change', onXMLChange);
    // watchXML.on('add', onXMLChange);
}

TaskPUI();
