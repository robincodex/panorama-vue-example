import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import CompatibleVueScopeID from './vite-plugin-compatible-vue-scope-id';
import TransformHTML from './vite-plugin-transform-html';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), CompatibleVueScopeID(), TransformHTML()],
    appType: 'custom',
    build: {
        target: 'es2017',
        minify: false,
        polyfillModulePreload: false,
        rollupOptions: {
            input: {
                lowhud: fileURLToPath(
                    new URL('./pages/lowhud/lowhud.html', import.meta.url)
                ),
                shop: fileURLToPath(
                    new URL('./pages/shop/shop.html', import.meta.url)
                )
            },
            output: {
                format: 'cjs',
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`
            },
            manualChunks(id) {
                if (id.includes('plugin-vue')) {
                    return 'common';
                }
                if (id.search(/[\\/]global[\\/]/) >= 0) {
                    return 'common';
                }
                if (id.search(/[\\/]node_modules[\\/]/) >= 0) {
                    return 'common';
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
