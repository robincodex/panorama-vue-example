import { PluginOption } from 'vite';

export default function CompatibleVueScopeID(): PluginOption {
    const existsScopeId = /\[data-v-[a-z0-9]{8}\]/;
    const replaceScopeId = /\[(data-v-[a-z0-9]{8})\]/g;
    const fileMatcher = /\.s?css$/;
    return {
        name: 'compatible-vue-scope-id',
        transform(code, id, options?) {
            if (fileMatcher.test(id)) {
                if (existsScopeId.test(code)) {
                    return code.replace(replaceScopeId, '.$1');
                }
            }
        }
    };
}
