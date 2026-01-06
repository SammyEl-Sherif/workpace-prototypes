module.exports = {
  ext: 'tsx',
  icon: false,
  jsxRuntime: 'automatic',
  prettierConfig: {
    parser: 'typescript',
    trailingComma: 'all',
  },
  ref: true,
  titleProp: true,
  typescript: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      'prefixIds',
    ],
  },
};
