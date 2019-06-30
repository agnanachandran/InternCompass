// Run like this:
// cd client && npm run build:client
// Note that Foreman (Procfile.dev) has also been configured to take care of this.

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.client.base.config');

const devBuild = process.env.NODE_ENV !== 'production';

config.output = {
  filename: '[name]-bundle.js',
  path: '../app/assets/webpack',
};

// add new modules here, if needed
// config.entry.vendor.unshift(
//   'new_modules',
// );

// See webpack.common.config for adding modules common to both the webpack dev server and rails

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css?minimize&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]' +
      '!postcss'
    ),
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css?minimize&modules&importLoaders=3&localIdentName=[name]__[local]__[hash:base64:5]' +
      '!postcss' +
      '!sass' +
      '!sass-resources'
    ),
  },
  {
    test: require.resolve('react'),
    loader: 'imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham',
  },
  {
    test: require.resolve('jquery-ujs'),
    loader: 'imports?jQuery=jquery',
  }
);

config.plugins.push(
  // It moves every require("style.css") in entry chunks into a separate css output file.
  // So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css)
  // allChunks means extracting css from all chunks and not just initial chunks
  new ExtractTextPlugin('[name]-bundle.css', { allChunks: true }),
  // Search for equal or similar files and deduplicate them in the output
  new webpack.optimize.DedupePlugin()
);

if (devBuild) {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  config.devtool = 'eval-source-map';
} else {
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}

module.exports = config;
