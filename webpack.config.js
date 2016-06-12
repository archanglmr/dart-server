var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

module.exports = {
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
        test:   /\.scss$/,
        loader: ExtractPlugin.extract('style', 'css!sass')
      },
      {
        test:   /\.html/,
        loader: 'html'
      }]
  }
};