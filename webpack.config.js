'use strict';

const webpack = require('webpack');

module.exports = {
    mode: 'production',
    performance: { hints: false },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    node: {
        fs: 'empty'
    },
    entry: {
        converter: './packages/swagger2openapi/index.js',
        validator: './packages/oas-validator/index.js',
        resolver: './packages/oas-resolver/index.js',
        linter: './packages/oas-linter/index.js',
        walker: './packages/oas-schema-walker/index.js'
    },
    output: {
        filename: '[name].min.js'
    }
};
