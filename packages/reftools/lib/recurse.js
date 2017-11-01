'use strict';

const jpescape = require('./jptr.js').jpescape;

function defaultState() {
    return {
        path: '#',
        depth: 0,
        pkey: '',
        parent: {},
        payload: {},
        seen: [],
        seenPaths: [],
        identity: false,
        identityDetection: false
    };
}

/**
* recurses through the properties of an object, given an optional starting state
* anything you pass in state.payload is passed to the callback each time
* @param object the object to recurse through
* @param state optional starting state, can be set to null or {}
* @param callback the function which receives object,key,state on each property
*/
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
        let seenIndex = state.identityDetection ? state.seen.indexOf(object[key]) : -1;
        state.identity = (seenIndex >= 0);
        state.identityPath = (state.identity ? state.seenPaths[seenIndex] : undefined);
        callback(object, key, state);
        if ((typeof object[key] === 'object') && (!state.identity)) {
            if (state.identityDetection && !Array.isArray(object[key])) {
                state.seen.push(object[key]);
                state.seenPaths.push(state.path);
            }
            let newState = {};
            newState.parent = object;
            newState.path = state.path;
            newState.depth = state.depth ? state.depth+1 : 1;
            newState.pkey = key;
            newState.payload = state.payload;
            newState.seen = state.seen;
            newState.seenPaths = state.seenPaths;
            newState.identity = false;
            newState.identityDetection = state.identityDetection;
            recurse(object[key], newState, callback);
        }
        state.path = oPath;
    }
}

module.exports = {
    recurse : recurse
};

