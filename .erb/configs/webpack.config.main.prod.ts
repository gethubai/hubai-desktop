/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';

const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

checkNodeEnv('production');
deleteSourceMaps();

const addSentryWebpackPlugin = process.env.SENTRY_NO_SOURCE_MAPS
  ? []
  : [
      sentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url: process.env.SENTRY_URL,
        telemetry: false,
      }),
    ];

const configuration: webpack.Configuration = {
  devtool: 'source-map',

  mode: 'production',

  target: 'electron-main',

  /* Temp workaround to fix https://github.com/mqttjs/MQTT.js/issues/1233 */
  module: {
    rules: [],
  },
  entry: {
    main: path.join(webpackPaths.srcMainPath, 'main.ts'),
    preload: path.join(webpackPaths.srcMainPath, 'preload.ts'),
  },

  output: {
    path: webpackPaths.distMainPath,
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8888,
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new Dotenv({
      path: path.join(webpackPaths.rootPath, '.env'),
      safe: false, // If true, load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      silent: false, // If true, all warnings will be suppressed
      defaults: false, // Adds support for dotenv-defaults. If set to true, uses ./.env.defaults. If a string, uses that location for a defaults file
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),
    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
    ...addSentryWebpackPlugin,
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
