var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    reset = require('node-reset-scss');

module.exports = [
  { // system clients
    devtool: 'source-map',
    resolve: {
      root: [
        __dirname + '/lib'
      ]
    },
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
      includePaths: [reset.includePath, __dirname + '/lib/scss/'],
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
      '01': [__dirname + '/games/01/client/01.jsx', hotMiddlewareScript],
      'archery': [__dirname + '/games/archery/client/archery.jsx', hotMiddlewareScript],
      'countup': [__dirname + '/games/count_up/client/countup.jsx', hotMiddlewareScript],
      'cricket': [__dirname + '/games/cricket/client/cricket.jsx', hotMiddlewareScript],
      'gotcha': [__dirname + '/games/gotcha/client/gotcha.jsx', hotMiddlewareScript],
      'jumpup': [__dirname + '/games/jump_up/client/jumpup.jsx', hotMiddlewareScript],
      'shanghai': [__dirname + '/games/shanghai/client/shanghai.jsx', hotMiddlewareScript],
      'slider': [__dirname + '/games/slider/client/slider.jsx', hotMiddlewareScript],
      'tugowar': [__dirname + '/games/tug_o_war/client/tugowar.jsx', hotMiddlewareScript],
      'warfare': [__dirname + '/games/warfare/client/warfare.jsx', hotMiddlewareScript]
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