const { merge } = require('webpack-merge');

const commonConfig = require('./common');

process.env.NODE_ENV = 'development';

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    open: true,
  },
  infrastructureLogging: {
    level: 'none',
    debug: [/webpack-dev-server/],
  },
});
