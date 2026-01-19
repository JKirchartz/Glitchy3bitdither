// look how clean and easy rollup is, no more grunting.
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default [
  // ES MODULES FROM THE FAR FUTURE WORLD OF 2015! (finally!)
  {
    input: 'source/index.js',
    output: {
      file: 'dist/gleech.mjs',
      format: 'es',
      sourcemap: true,
      exports: 'named'
    },
    external: ['jimp', 'fs'],
    plugins: [json()]
  },

  // COMMONJS for Node.js
  {
    input: 'source/index.js',
    output: {
      file: 'dist/gleech.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: ['jimp', 'fs'],
    plugins: [json()]
  },

  // Universal Module Definition (UMD) for browsers and Node.js
  {
    input: 'source/index.js',
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({ transformMixedEsModules: true }),
      json(),
      nodePolyfills(),
    ],
    output: {
      file: 'site/gleech.umd.js',
      format: 'umd',
      name: 'Gleech',
      sourcemap: true,
      exports: 'named',
      globals: {
        fs: 'null',
        stream: 'null'
      }
    },
    external: ['fs']
  },
];
