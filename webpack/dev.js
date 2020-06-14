const { merge } = require('webpack-merge');

const commonConfig = require('./common');

process.env.NODE_ENV = 'development';

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    open: true,
    quiet: true,
  },
});
