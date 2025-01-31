const babel = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const autoExternal = require('rollup-plugin-auto-external');

const configurePlugins = ({ module }) => {
  return [
    autoExternal(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-react',
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: [
                'chrome >= 53',
                'firefox >= 45.0',
                'ie >= 11',
                'edge >= 37',
                'safari >= 9',
                'opera >= 40',
                'op_mini >= 18',
                'Android >= 7',
                'and_chr >= 53',
                'and_ff >= 49',
                'ios_saf >= 10',
              ],
            },
            modules: module ? 'auto' : false,
          },
        ],
      ],
      plugins: ['dynamic-import-node', 'babel-plugin-add-import-extension'],
    }),
    terser({
      module,
      mangle: true,
      compress: true,
    }),
  ];
};

module.exports = [
  {
    input: 'src/index.js',
    output: {
      format: 'cjs',
      file: './dist/cjs.js',
    },
    plugins: configurePlugins({ module: false }),
  },
  {
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: './dist/esm.js',
    },
    plugins: configurePlugins({ module: true }),
  },
];
