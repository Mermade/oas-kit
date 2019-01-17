'use strict';

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    performance: { hints: false },
    plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.NormalModuleReplacementPlugin(/node_modules.should/, resource => {
        const components = resource.request.split('/');
        for (let i=0;i<components.length;i++) {
            if (components[i].match(/^oas-[rl]/)) {
                components[i] = 'oas-validator';
            }
        }
		resource.request = components.join('/');
      }),
      new webpack.NormalModuleReplacementPlugin(/node_modules.yaml/, resource => {
        const components = resource.request.split('/');
        for (let i=0;i<components.length;i++) {
            if (components[i].match(/^oas-[rl]/)) {
                components[i] = 'oas-validator';
            }
        }
		resource.request = components.join('/');
      })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'validator-lib',
                    chunks: 'all'
                }
            }
        }
    },
    node: {
        fs: 'empty'
    },
    entry: {
        validatorOnly: './packages/oas-validator/index.js'
    },
    output: {
        filename: '[name].min.js'
    }
};
