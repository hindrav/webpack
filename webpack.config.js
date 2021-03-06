const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressWebpackPlugin = require("progress-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][contenthash].js",
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  mode: 'production',
  resolve: {
    extensions: [".js"],
    alias: {
        '@utils': path.resolve(__dirname, "src/utils"),
        '@templates': path.resolve(__dirname, "src/templates"),
        '@styles': path.resolve(__dirname, "src/styles"),
        '@scss': path.resolve(__dirname, "src/scss"),
        '@images': path.resolve(__dirname, "src/assets/images"),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
      {
          test: /\.(woff|woff2)$/,
          use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                MimeType: 'application/font-woff',
                name: '[name].[contenthash].[ext]',
                outputPath: './assets/fonts/',
                publicPath: '../assets/fonts/',
                esModule: false
              }
          }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
        filename: 'assets/[name].[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images",
        },
      ],
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
  ],
  optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerWebpackPlugin(),
        new TerserPlugin(),
        new ProgressWebpackPlugin()
      ]
  }
};
