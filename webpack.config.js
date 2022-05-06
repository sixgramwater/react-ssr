const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const browserConfig = {
  mode: 'production',
  entry: './src/browser/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['css-loader'] }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "true",
    }),
  ]

}

const serverConfig = {
  mode: "production",
  entry: "./src/server/index.js",
  target: "node", // 为了忽略诸如path、fs等内置模块。
  externals: [nodeExternals()], // 以忽略node_modules文件夹中的所有模块
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader" },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      __isBrowser__: "false",
    }),
  ],
};


module.exports = [browserConfig, serverConfig];