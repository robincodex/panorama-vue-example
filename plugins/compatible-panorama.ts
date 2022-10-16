import { basename, join } from 'node:path';
import { Plugin } from 'rollup';

export default function compatiblePanorama(options?: {}): Plugin {
    return {
        name: 'compatible-panorama',
        renderChunk(code, chunk, options) {
            if (chunk.fileName === 'common.js') {
                return (
                    'const common = {};\n(function () {\n\nconst exports = common;\n\n' +
                    code +
                    '\n\n})(this);\n'
                );
            } else if (
                code.indexOf(`var common = require('./common.js');`) > 0
            ) {
                return code.replace(`var common = require('./common.js');`, '');
            }
            return code;
        }
    };
}
