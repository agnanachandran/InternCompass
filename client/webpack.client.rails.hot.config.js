// Run with Rails server like this:
// rails s
// cd client && babel-node server-rails-hot.js
// Note that Foreman (Procfile.dev) has also been configured to take care of this.

const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.client.base.config');

const hotRailsPort = process.env.HOT_RAILS_PORT || 3500;

config.entry.app.push(
  `webpack-dev-server/client?http://localhost:${hotRailsPort}`,
  'webpack/hot/only-dev-server'
);

config.output = {
  filename: '[name]-bundle.js',
  path: path.join(__dirname, 'public'),
  publicPath: `http://localhost:${hotRailsPort}/`,
};

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      plugins: [
        [
          // enables react hot loading
          'react-transform',
          {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              },
            ],
          },
        ],
      ],
    },
  },
  {
    test: /\.css$/,
    // transformed by postcss, then the css-loader, then by the style-loader
    // style-loader: each module is executed with eval and a SourceMap is added as DataUrl to the eval
    // css-loader: returns css code from file.css

    // importLoaders specifies how many loaders after css-loader should be applied to imports in the css file
    // in our case, we only have postcss afterwards, so importLoaders is 1

    // localIdentName configures the format for generated css class names
    loaders: [
      'style',
      'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
      'postcss',
    ],
  },
  {
    test: /\.scss$/,
    loaders: [
      'style',
      'css?modules&importLoaders=3&localIdentName=[name]__[local]__[hash:base64:5]',
      'postcss',
      'sass',
      'sass-resources',
    ],
  }
);

config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

// Each module is executed with eval and a SourceMap is added as DataUrl to the eval
config.devtool = 'eval-source-map';

console.log('Webpack HOT dev build for Rails'); // eslint-disable-line no-console

module.exports = config;
