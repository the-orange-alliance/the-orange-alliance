const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { AggressiveMergingPlugin } = require('webpack').optimize;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  entry: path.resolve(__dirname, '../client/index.tsx'),
  devtool: 'source-map',
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx', '.png', '.jpg']
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'index.js',
    publicPath: '/public/'
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
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../public'),
    publicPath: 'http://localhost:9090/',
    port: 9090
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
    new DefinePlugin({
      // <-- key to reducing React's size
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new AggressiveMergingPlugin(),
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.join(__dirname, '../stats/client-stats.html')
    })
  ]
};
