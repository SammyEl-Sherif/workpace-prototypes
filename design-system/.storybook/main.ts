import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

// Resolve Storybook's own bundled style-loader & css-loader (v6/v3)
// so we use the exact same versions Storybook already uses for .css files.
const storybookBuilderDir = path.dirname(
  require.resolve('@storybook/builder-webpack5/package.json'),
);
const sbStyleLoader = path.join(storybookBuilderDir, 'node_modules/style-loader');
const sbCssLoader = path.join(storybookBuilderDir, 'node_modules/css-loader');

const config: StorybookConfig = {
  stories: ['../src/docs/**/*.mdx', '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-webpack5-compiler-swc',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['./public'],

  // Configure SWC to use automatic JSX runtime
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  webpackFinal: async (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // SCSS Modules (*.module.scss) — CSS Modules enabled
    // Uses Storybook's bundled css-loader v6 / style-loader v3 for compatibility
    config.module.rules.push({
      test: /\.module\.s[ac]ss$/,
      use: [
        sbStyleLoader,
        {
          loader: sbCssLoader,
          options: {
            modules: {
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
            importLoaders: 1,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
          },
        },
      ],
    });

    // Global SCSS (*.scss / *.sass but NOT *.module.scss)
    config.module.rules.push({
      test: /\.s[ac]ss$/,
      exclude: /\.module\.s[ac]ss$/,
      use: [
        sbStyleLoader,
        sbCssLoader,
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
          },
        },
      ],
    });

    return config;
  },
};
export default config;
