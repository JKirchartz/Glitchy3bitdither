// look how clean and easy rollup is, no more grunting.
module.exports = [
  // ES MODULES FROM THE FAR FUTURE WORLD OF 2015! (finally!)
  {
    input: 'source/index.js',
    output: {
      file: 'dist/gleech.mjs',
      format: 'es',
      sourcemap: true
    },
    external: ['jimp'],
  },

  // COMMONJS for Node.js
  {
    input: 'source/index.js',
    output: {
      file: 'dist/gleech.cjs',
      format: 'cjs',
      sourcemap: true
    },
    external: ['jimp'],
  },

  // Universal Module Definition (UMD) for browsers and Node.js
  {
    input: 'source/index.js',
    output: {
      file: 'dist/gleech.umd.js',
      format: 'umd',
      name: 'Gleech',
      sourcemap: true,
      globals: {
        jimp: 'Jimp'
      }
    },
    external: ['jimp'],
  },
];
