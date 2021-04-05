const path = require('path');
let envMode = "development"

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var OptimizeJSPlugin = require('optimize-js-plugin');

var env = process.env.NODE_ENV || 'development'

var plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html',
    filename: 'index.html',
    inject: 'body'
  })
];

console.log('> NODE_ENV:', env);

if (env === 'production') {
  plugins.push(
    new TerserPlugin(),
    new OptimizeJSPlugin({
      sourceMap: false
    })
  );
  envMode = "production";
}


module.exports = {
  mode: envMode,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ]
        },

      },
      {
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: plugins
}