import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Notifier from 'webpack-notifier';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const htmlWebpackConfig = {
  template: './index.html',
  filename: 'index.html',
  inject: 'body',
};

export default {
  context: path.resolve(__dirname, './styleguide/src'),
  devtool: 'source-map',
  entry: {
    app: ['babel-polyfill', './index.js'],
  },
  output: {
    path: path.resolve(__dirname, './styleguide/dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './styleguide/src'),
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
        test: /\.md$/,
        loaders: ['catalog/lib/loader', 'raw-loader'],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
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
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    // TODO: (2017-06-26) replace this manual copy with working file-loader
    new CopyWebpackPlugin([
      { from: '../../app/src/assets/fonts', to: 'fonts/' },
    ]),
    new HtmlWebpackPlugin(htmlWebpackConfig),
    new Notifier(),
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      __API__: process.env.API_URL || "'https://admin-dot-analytics-and-presentation.appspot.com/'",
      __REPORTS_API__: process.env.REPORTS_API_URL || "'https://oldreports-dot-analytics-and-presentation.appspot.com/'",
      __MESSAGES_API__: process.env.MESSAGES_API_URL || "'https://messages-dot-analytics-and-presentation.appspot.com/'",
      __STATEMENTS_API__: process.env.STATEMENTS_API_URL || "'https://statements-dot-analytics-and-presentation.appspot.com/'",
      __REPORTS_API_V2__: process.env.REPORTS_API_V2_URL || "'https://reports-dot-analytics-and-presentation.appspot.com/'",
      __DOCUMENTS_API__: process.env.DOCUMENTS_API_URL || "'https://documents-dot-analytics-and-presentation.appspot.com/'",
      __authority__: process.env.__authority__ || "'https://login.microsoftonline.com/tfp/gpcustomerqa.onmicrosoft.com/B2C_1A_signup_signin_aad/v2.0/'",
      __client_id__: process.env.__client_id__ || "'da80bb2a-547c-4bdd-83dc-a19d52d5cfec'",
    }),
  ],
  resolve: {

    alias: {
      Components: path.resolve(__dirname, 'app/src/components/'),
      Containers: path.resolve(__dirname, 'app/src/containers/'),
      Helpers: path.resolve(__dirname, 'helpers/'),
      Selectors: path.resolve(__dirname, 'app/src/selectors/'),
      Utils: path.resolve(__dirname, 'app/src/utils'),
      Assets: path.resolve(__dirname, 'app/src/assets'),
    },
    extensions: ['.js', '.jsx', '.json', '*'],
  },
};
