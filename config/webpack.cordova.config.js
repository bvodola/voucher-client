var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index_cordova.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve('./cordova/www'),
    publicPath: '',
    filename: './js/bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.sass$/, use: [{loader: "style-loader" }, {loader: "css-loader"}, {loader: "sass-loader"}], exclude: /node_modules/},
      { test: /\.scss$/, use: [{loader: "style-loader" }, {loader: "css-loader"}, {loader: "sass-loader"}], exclude: /node_modules/}
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig
  ]
}
