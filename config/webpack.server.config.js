const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../server/Server.ts'),
  devtool: "source-map",
  resolve: {
    extensions: [".json", ".js", ".ts", ".tsx"]
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'index.js',
    publicPath: '../'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modues/,
        loader: 'ts-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  mode: 'production',
  node: {
    __dirname: false
  },
  plugins: [
    new copy([
      {from: path.resolve(__dirname, '../public'), to: path.resolve(__dirname, '../build/public')}
    ])
  ],
  target: "node"
};