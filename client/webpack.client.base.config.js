const webpack = require('webpack');
const path = require('path');
/*
 * CSS postprocessor to parse CSS and add vendor prefixes to CSS rules
 * Using values from the Can I Use library
 *
 * Browser vendors sometimes add prefixes to experimental or nonstandard CSS properties
 *  e.g. -webkit- (Chrome, Safari), -moz- (Firefox), -o- (Opera)
 */
const autoprefixer = require('autoprefixer');

const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';

module.exports = {
  // base directory (absolute path) for resolving entry option
  context: __dirname,
  // entry point for bundle
  // If you pass an object: Multiple entry bundles are created. The key is the chunk name. The value can be a string or an array.
  entry: {
    vendor: [
      'babel-polyfill',
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      // ujs stands for unobstrusive JavaScript
      // jquery-ujs wires event handlers to eligible DOM elements to provide enhanced functionality.
      'jquery-ujs',
      'jquery',
    ],

    // This will contain the app entry points defined by webpack.hot.config and webpack.rails.config
    app: [
      './app/bundles/Compass/startup/clientRegistration',
    ],
  },
  resolve: {
    // this overrides the default extensions for webpack
    // when we resolve modules, we want files with this extension
    extensions: ['', '.js', '.jsx'],
    // specify paths for react and react-dom
    alias: {
      // cwd points to the client folder
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  // Use plugins to add functionality typically related to bundles in webpack.
  plugins: [
    new webpack.DefinePlugin({
      // adds process.env.NODE_ENV for React
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
      // turns on tracing of Turbolinks events
      TRACE_TURBOLINKS: devBuild,
      SERVER_RENDER: false
    }),

    // Motivation here is to split JS into application code and vendor (third party) code
    //   https://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code
    // CommonsChunkPlugin moves modules that occur in multiple entry chunks to a new entry chunk (the commons chunk)
    new webpack.optimize.CommonsChunkPlugin({
      // This name 'vendor' ties into the entry definition
      name: 'vendor',
      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      // Typically CommonsChunkPlugin moves modules shared between minChunks chunks
      // to the common chunk. Here we just want entry.vendor modules to be in the commons chunk
      minChunks: Infinity,
      // default emitted filename is the filename specified by config.output for the entry bundle
    }),
  ],
  module: {
    // Loaders allow you to preprocess files as you require() or "load" them
    loaders: [
      // url-loader: works like file-loader, but can return a Data Url if file is smaller than the limit
      // Data URLs are a Uniform Resource Identifier scheme that allow you to include data items inline in a web page as if they were being referenced as external resources
      { test: /\.(jpe?g|png|gif|svg|ico)$/, loader: 'url?limit=10000' },
      // exposes jQuery to the web browser and window.$ or window.jQuery is available
      { test: require.resolve('jquery'), loader: 'expose?jQuery' },
      { test: require.resolve('jquery'), loader: 'expose?$' },
      // adds this to jquery-ujs: var $ = require("jquery");
      { test: require.resolve('jquery-ujs'), loader: 'imports?jQuery=jquery' },
      // wraps turbolinks: (function () { ... }).call(window); this then points to the window object
      { test: require.resolve('turbolinks'), loader: 'imports?this=>window' },
    ],
  },
  // Place here all postCSS plugins here, so postcss-loader will apply them
  postcss: [autoprefixer],

  // Place here all SASS files with variables, mixins etc.
  // And sass-resources-loader will load them in every CSS Module (SASS file) for you
  // (so don't need to @import them explicitly)
  // https://github.com/shakacode/sass-resources-loader
  sassResources: ['./app/assets/styles/app-variables.scss'],
};
