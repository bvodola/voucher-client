const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve('../', 'server', 'client_bundle'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [{loader: "style-loader" }, {loader: "css-loader"}, ]},
      { test: /\.sass$/, use: [{loader: "style-loader" }, {loader: "css-loader"}, {loader: "sass-loader"}], exclude: /node_modules/ },
      { test: /\.scss$/, use: [{loader: "style-loader" }, {loader: "css-loader"}, {loader: "sass-loader"}], exclude: /node_modules/ },
      { test: /\.svg$/, loader: 'svg-inline-loader' },
      { test: /\.(png|jpg|jpeg)$/, loader: 'file-loader?name=[path][name].[ext]!extract-loader!html-loader' },
    ]
  },
  optimization: {
    minimize: true
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: './public', to: './public' }
    ])
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src')
    }
  }
}
