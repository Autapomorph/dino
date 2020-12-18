const { mergeWithRules } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const commonConfig = require('./common');

process.env.NODE_ENV = 'production';

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
})(commonConfig, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/_raw/**', '**/*.md'],
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new WorkboxPlugin.GenerateSW({
      exclude: [/favicons[\\/].*\.(?:png|jpg|jpeg|gif|svg)$/i, /license/i],
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  performance: {
    maxEntrypointSize: 1.1 * 1024 * 1024,
    maxAssetSize: 1 * 1024 * 1024,
  },
  stats: {
    assets: true,
    assetsSort: '!size',
    groupAssetsByEmitStatus: false,
    groupAssetsByInfo: false,
    groupAssetsByChunk: false,
    groupAssetsByPath: false,
    groupAssetsByExtension: false,
    excludeAssets: [/assets/, /favicons/],
    modules: false,
    errors: false,
    errorsCount: false,
    warnings: false,
    warningsCount: false,
    timings: false,
    version: false,
  },
});
