'use strict';

const jpescape = require('./jptr.js').jpescape;

function getDefaultState() {
    let state = {};
    state.path = '#';
    state.depth = 0;
    state.pkey = '';
    state.parent = {};
    state.payload = {};
    state.seen = [];
    state.seenPaths = [];
    state.circular = false;
    state.circularDetection = false;
    return state;
}

function recurse(object, state, callback) {
    if (!state) state = {};
    state = Object.assign({},getDefaultState(),state);
    for (let key in object) {
        let escKey = '/' + jpescape(key);
        state.key = key;
        let oPath = state.path;
        state.path = (state.path ? state.path : '#') + escKey;
        let seenIndex = state.circularDetection ? state.seen.indexOf(object[key]) : -1;
        state.circular = (seenIndex >= 0);
        state.circularPath = (state.circular ? state.seenPaths[seenIndex] : undefined);
        callback(object, key, state);
        if ((typeof object[key] === 'object') && (!state.circular)) {
            if (state.circularDetection && !Array.isArray(object[key])) {
                state.seen.push(object[key]);
                state.seenPaths.push(state.path);
            }
            let newState = {};
            newState.parent = object;
            newState.path = state.path;
            newState.depth = state.depth ? state.depth : 1;
            newState.depth++;
            newState.pkey = key;
            newState.payload = state.payload;
            newState.seen = state.seen;
            newState.seenPaths = state.seenPaths;
            newState.circular = false;
            newState.circularDetection = state.circularDetection;
            recurse(object[key], newState, callback);
        }
        state.path = oPath;
    }
}

module.exports = {
    recurse : recurse
};

