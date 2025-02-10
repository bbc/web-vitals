module.exports = {
  env: {
    // only used by Jest
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-runtime',
        'dynamic-import-node',
      ],
    },
  },
};
