var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    reset = require('node-reset-scss');

module.exports = [
  { // system clients
    devtool: 'source-map',
    entry: {
      display: [__dirname + '/clients/display.jsx', hotMiddlewareScript],
      throw: [__dirname + '/clients/throw.jsx', hotMiddlewareScript]
    },
    output: {
      path: path.join(__dirname, 'builds'),
      filename: '[name].js',
      publicPath: '/builds/'
    },
    plugins: [
      new ExtractPlugin('[name].css'),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.jsx$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        },
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        },
        {
          test:   /\.scss$/,
          loader: ExtractPlugin.extract('style', 'css!sass')
        },
        {
          test:   /\.html/,
          loader: 'html'
        }]
    },
    sassLoader: {
      includePaths: [reset.includePath],
      outputStyle: 'compressed'
    }
  },

  // game clients
  {
    devtool: 'source-map',
    resolve: {
      root: [
        __dirname + '/lib'
      ]
    },
    entry: {
      '01': [__dirname + '/games/01/client/01.jsx', hotMiddlewareScript]
    },
    output: {
      path: path.join(__dirname, 'builds/games'),
      filename: '[name].js',
      publicPath: '/builds/games/'
    },
    plugins: [
      new ExtractPlugin('[name].css'),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.jsx$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        },
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        },
        {
          test:   /\.scss$/,
          loader: ExtractPlugin.extract('style', 'css!sass')
        },
        {
          test:   /\.html/,
          loader: 'html'
        }]
    },
    sassLoader: {
      includePaths: [reset.includePath, __dirname + '/lib/scss/'],
      outputStyle: 'compressed'
    }
  }
];