const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const globImporter = require('node-sass-glob-importer')
const ESLintPlugin = require('eslint-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = (env, options) => {
  const devMode = !options || options.mode !== 'production'
  return {
    mode: devMode ? 'development' : 'production',
    entry: {
      app: ['./src/main.ts', './src/main.scss'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.[fullhash].js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    devServer: {
      compress: true,
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              options: {
                esModule: true,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  indentWidth: 4,
                  importer: globImporter(),
                  // includePaths: [path.resolve(__dirname, 'node_modules')],
                },
              },
            },
          ],
        },
        // {
        //   test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        //   use: [
        //     {
        //       loader: 'file-loader?name=assets/fonts/[name].[ext]',
        //     },
        //   ],
        // },
      ],
    },
    plugins: [
      new ESLintPlugin(),
      new StylelintPlugin({
        files: ['src/styles', 'src/main.scss'],
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/*',
            context: path.resolve(__dirname, 'src', 'assets'),
            to: './assets',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: false,
        // minify: {
        //   collapseWhitespace: true,
        //   removeComments: true,
        //   removeRedundantAttributes: true,
        //   useShortDoctype: true,
        // },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].bundle.[fullhash].css',
      }),
    ],
  }
}
