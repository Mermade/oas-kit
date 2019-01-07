'use strict';

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    performance: { hints: false },
    plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.NormalModuleReplacementPlugin(/node_modules.yaml/, resource => {
        const components = resource.request.split('/');
        for (let i=0;i<components.length;i++) {
            if (components[i].startsWith('oas-')) {
                components[i] = 'swagger2openapi';
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
                    name: 'converter-lib',
                    chunks: 'all'
                }
            }
        }
    },
    node: {
        fs: 'empty'
    },
    entry: {
        converterOnly: './packages/swagger2openapi/index.js'
    },
    output: {
        filename: '[name].min.js'
    }
};
