const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
  mode: 'development',
   entry: {
     index: './src/index.js',
   },
   devtool: 'inline-source-map',
   devServer: {
    static: './dist',
  },
   plugins: [
     new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
     }),
   ],
   module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
     publicPath: '/',
   },
 };