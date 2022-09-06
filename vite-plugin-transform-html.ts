import { PluginOption } from 'vite';

export default function TransformHTML(): PluginOption {
    return {
        name: 'transform-html',
        transformIndexHtml: {
            enforce: 'post',
            transform: html => {
                console.log(html);
            }
        }
    };
}
