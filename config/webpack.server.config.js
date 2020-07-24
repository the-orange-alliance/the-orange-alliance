const path = require('path');
const copy = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const { AggressiveMergingPlugin } = require('webpack').optimize;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  entry: path.resolve(__dirname, '../server/Server.ts'),
  devtool: 'source-map',
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx']
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
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(scss|css)$/,
        loader: 'ignore-loader'
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new copy([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../build/public')
      }
    ]),
    new DefinePlugin({
      // <-- key to reducing React's size
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new AggressiveMergingPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(__dirname, '../stats/server-stats.html')
    })
  ],
  target: 'node'
};
