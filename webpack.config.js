var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + '/clients/display.jsx',
    output: {
        path: __dirname + '/builds/display',
        filename: 'display.js',
        publicPath: '/display/'
    },
    plugins: [
        new ExtractPlugin('display.css')
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