'use strict';
const jptr = require('jgexml/jpath.js');

function recurse(object, state, callback) {
    if (!state || (Object.keys(state).length === 0)) {
        state = {};
        state.path = '#';
        state.depth = 0;
        state.pkey = '';
        state.parent = {};
        state.payload = {};
    }
    for (let key in object) {
        let escKey = '/' + jptr.jpescape(key);
        state.key = key;
        let oPath = state.path;
        state.path = (state.path ? state.path : '#') + escKey;
        callback(object, key, state);
        if (typeof object[key] === 'object') {
            let newState = {};
            newState.parent = object;
            newState.path = state.path;
            newState.depth = (state.depth ? state.depth++ : state.depth = 1);
            newState.pkey = key;
            newState.payload = state.payload;
            recurse(object[key], newState, callback);
        }
        state.path = oPath;
    }
}

module.exports = {
    recurse : recurse
};

