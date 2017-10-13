'use strict';

const jpescape = require('./jptr.js').jpescape;
//const deepClone = require('./clone.js').deepClone;

function defaultState() {
    return {
        path: '#',
        depth: 0,
        pkey: '',
        parent: {},
        payload: {},
        seen: [],
        seenPaths: [],
        circular: false,
        circularDetection: false
    };
}

function recurse(object, state, callback) {
    if (!state) state = {depth:0};
    if (!state.depth) {
        state = Object.assign({},defaultState(),state);
    }
    let oPath = state.path;
    for (let key in object) {
        let escKey = '/' + jpescape(key);
        state.key = key;
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

