var webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + '/client/client.jsx',
    output: {
        path: __dirname + '/builds',
        filename: 'client.js',
        publicPath: '../builds/'
    },
    plugins: [
        new ExtractPlugin('client.css')
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