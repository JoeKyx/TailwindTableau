'use strict';

const path = require('path');

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['*', '.ts', '.js', '.tsx'],
  },
  optimization: {
    minimize: false,
  },
  devtool: 'inline-source-map',
  performance: {
    hints: false,
    maxEntrypointSize: 370,
    maxAssetSize: 370,
  },
};
