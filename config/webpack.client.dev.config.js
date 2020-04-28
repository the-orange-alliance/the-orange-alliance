const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../client/index.tsx'),
  devtool: "source-map",
  resolve: {
    extensions: [".json", ".js", ".ts", ".tsx", ".png", ".jpg"]
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
        include: /client/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: /client/,
        loader: 'babel-loader'
      },
      {
        enforce: "pre",
        test: /\.js$/,
        include: /client/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        include: /client/,
        loader: 'file-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "../public"),
    publicPath: "http://localhost:9090/",
    port: 9090
  },
  mode: 'production',
  node: {
    __dirname: false
  }
};