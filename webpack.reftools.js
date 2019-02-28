'use strict';

const webpack = require('webpack');

module.exports = {
    mode: 'production',
    plugins: [
    ],
    node: {
        fs: 'empty'
    },
    entry: {
        recurse: './packages/reftools/lib/recurse.js',
        clone: './packages/reftools/lib/clone.js',
        deref: './packages/reftools/lib/dereference.js',
        reref: './packages/reftools/lib/reref.js'
    },
    output: {
        filename: '[name].min.js',
        libraryTarget: 'umd'
    }
};
