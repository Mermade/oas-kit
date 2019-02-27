'use strict';

const webpack = require('webpack');

module.exports = {
    mode: 'production',
    performance: { hints: false },
    plugins: [
    ],
    optimization: {
    },
    node: {
        fs: 'empty'
    },
    entry: {
        recurse: './packages/reftools/lib/recurse.js',
        clone: './packages/reftools/lib/clone.js',
        deref: './packages/reftools/lib/dereference.js'
    },
    output: {
        filename: '[name].min.js'
    }
};
