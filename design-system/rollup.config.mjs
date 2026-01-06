import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json';
import preserveDirectives from 'rollup-plugin-preserve-directives';
import pluginSyntaxFlow from '@babel/plugin-syntax-flow';
import pkg from './package.json' with { type: 'json' };
import pluginProposalDecorators from '@babel/plugin-proposal-decorators';

const external = [
  ...Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  }),
  'react/jsx-runtime',
];

const input = './src/lib.ts';

const basePlugins = [
  nodeResolve({
    extensions: ['.scss', '.css', '.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs(),
  json(),
  babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-react'],
    plugins: [pluginSyntaxFlow, [pluginProposalDecorators, { decoratorsBeforeExport: true }]],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
];

const devConfig = {
  external,
  input,
  output: [
    {
      file: pkg.exports['.'].development.require,
      sourcemap: true,
      format: 'cjs',
    },
    {
      dir: path.dirname(pkg.exports['.'].development.import),
      sourcemap: true,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: basePlugins.concat([
    typescript({ declaration: false }),
    postcss({ extract: 'styles.css' }),
    preserveDirectives(),
  ]),
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
      return;
    }
    warn(warning);
  },
};

const prodConfig = {
  external,
  input,
  output: [
    {
      file: pkg.exports['.'].production.require,
      sourcemap: true,
      format: 'cjs',
    },
    {
      dir: path.dirname(pkg.exports['.'].production.import),
      sourcemap: true,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: basePlugins.concat([
    strip({
      include: 'src/**/*.ts?(x)',
      functions: ['console.*', 'printDevConsole', 'usePrintDevConsole', 'assert.*'],
    }),
    typescript({
      declaration: true,
      declarationDir: path.dirname(pkg.exports['.'].production.import),
      exclude: ['src/**/*.stories.tsx', '.storybook/**', 'src/docs/**', 'tokens/**'],
    }),
    postcss({
      extract: 'styles.css',
      modules: true,
      use: ['sass'],
    }),
    preserveDirectives(),
    copy({
      targets: [
        {
          dest: 'dist',
          src: './src/lib-env-wrapper.cjs',
        },
        {
          dest: 'dist',
          src: './src/styles/fonts.css',
        },
        {
          dest: 'dist',
          src: './tokens/design-tokens.cjs',
        },
        {
          dest: 'dist',
          src: './tokens/design-tokens.js',
        },
        {
          dest: 'dist',
          src: './tokens/design-tokens.d.ts',
        },
        {
          dest: 'dist',
          src: './src/styles/_design-tokens.scss',
        },
        {
          dest: 'dist',
          src: './src/styles/_mixins.scss',
        },
      ],
    }),
  ]),
  onwarn(warning, warn) {
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
      return;
    }
    warn(warning);
  },
};

export default [devConfig, prodConfig];
