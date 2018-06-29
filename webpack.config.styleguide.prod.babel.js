 /* eslint-disable import/no-extraneous-dependencies */

import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const htmlConfig = {
  // Create HTML file that includes references to bundled JS
  template: 'index.html',
  minify: {
    removeComments: true,
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
};

export default {
  context: path.resolve(__dirname, './styleguide/src'),
  devtool: 'source-map',
  entry: {
    app: ['babel-polyfill', './index.js'],
  },
  output: {
    path: path.resolve(__dirname, './styleguide/dist'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=/fonts/[name].[ext]',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-2'],
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
      { from: '../../app/src/assets/fonts', to: 'fonts/' },
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
    new webpack.DefinePlugin({
      __API__: process.env.API_URL || "'https://admin-dot-analytics-and-presentation.appspot.com/'",
      __REPORTS_API__: process.env.REPORTS_API_URL || "'https://reports-dot-analytics-and-presentation.appspot.com/'",
      __MESSAGES_API__: process.env.MESSAGES_API_URL || "'https://messages-dot-analytics-and-presentation.appspot.com/'",
      __STATEMENTS_API__: process.env.STATEMENTS_API_URL || "'https://statements-dot-analytics-and-presentation.appspot.com/'",
      __REPORTS_API_V2__: process.env.REPORTS_API_V2_URL || "'http://localhost:8091/v2/'",
      __DOCUMENTS_API__ : process.env.DOCUMENTS_API_URL || "'https://documents-dot-analytics-and-presentation.appspot.com/'",
      __authority__: process.env.__authority__ || "'https://login.microsoftonline.com/tfp/gpcustomerqa.onmicrosoft.com/B2C_1A_signup_signin_aad/v2.0/'",
      __client_id__: process.env.__client_id__ || "'da80bb2a-547c-4bdd-83dc-a19d52d5cfec'",
    }),
    /**
     * @depracted (2017-06-23)
     *
     * minifying the JS causes the code samples to show mangled identifier names
     * in production build of the styleguide
     */
    // Minify JS
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    // }),
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
