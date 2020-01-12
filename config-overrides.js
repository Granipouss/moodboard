// @ts-check
const {
  override,
  setWebpackTarget,
  addWebpackExternals,
} = require('customize-cra');

/**
 * @typedef { import('webpack').Configuration } Configuration
 */

/** @type {() => (config: Configuration) => Configuration} */
const takeControlOverTypescript = () => config => {
  config.module.rules
    .map(r => r.oneOf)
    .find(a => a != null)
    .unshift({
      test: /\.tsx?$/,
      use: {
        loader: 'ts-loader',
        options: {
          compilerOptions: { noEmit: false },
        },
      },
      exclude: /node_modules/,
    });

  return config;
};

module.exports = override(
  setWebpackTarget('electron-renderer'),
  addWebpackExternals({ typeorm: 'require("typeorm")' }),
  takeControlOverTypescript(),
);
