var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

module.exports = {
  entry: {
    display: __dirname + '/clients/display.jsx',
    throw: __dirname + '/clients/throw.jsx'
  },
  output: {
    path: path.join(__dirname, 'builds'),
    filename: '[name].js',
    publicPath: '/builds/'
  },
  plugins: [
    new ExtractPlugin('[name].css')
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