/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';

const gitRevisionPlugin = new GitRevisionPlugin();
const buildDateTime = new Date().toISOString();

const htmlConfig = {
  // Create HTML file that includes references to bundled JS
  template: 'index.html',
  minify: {
    removeComments: false,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
  inject: true,
  data: {
    __VERSION__: JSON.stringify(gitRevisionPlugin.version()),
    __COMMITHASH__: JSON.stringify(gitRevisionPlugin.commithash()),
    __BRANCH__: JSON.stringify(gitRevisionPlugin.branch()),
    __BUILDDATETIME__: buildDateTime,
  },
};

export default {
  context: path.resolve(__dirname, './app/src'),
  devtool: 'source-map',
  entry: {
    app: ['babel-polyfill', './index.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './app/dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=assets/fonts/[name].[ext]',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-class-properties'],
          },
        }],
      },
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './node_modules/react-icons/fa'),
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties'],
        },
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
                sourceMap: true,
              },
            },
            {
              loader: 'resolve-url-loader', // resolve relative imports, see https://github.com/webpack-contrib/sass-loader#problems-with-url
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: {
                sourceMap: true,
              },
            },
            {
              loader: path.resolve('./helpers/loaders/inject-global-scss'),
            },
          ],
        }),
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'file-loader',
      },
      // Loaders for other file types can go here
    ],
  },
  plugins: [
    // TODO: (2017-06-26) replace this manual copy with working file-loader
    new CopyWebpackPlugin([
      { from: 'assets/fonts', to: 'fonts/' },
    ]),
    new HtmlWebpackPlugin(htmlConfig),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    }),
    // define production environment for React
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // Minify JS
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'app/src/components/'),
      Helpers: path.resolve(__dirname, 'helpers/'),
      Selectors: path.resolve(__dirname, 'app/src/selectors/'),
      Utils: path.resolve(__dirname, 'app/src/utils'),
      Assets: path.resolve(__dirname, 'app/src/assets'),
    },
    extensions: ['.js', '.jsx', '.json', '*'],
  },
};

/* eslint-enable import/no-extraneous-dependencies */
