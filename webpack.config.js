/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  devtool: "source-map",
  resolve: { extensions: [".js", ".json", ".ts"] },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
};
