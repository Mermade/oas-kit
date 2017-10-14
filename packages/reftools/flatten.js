'use strict';

const recurse = require('./recurse.js').recurse;

/**
* flattens an object into an array of properties, takes a callback
* which can mutate or filter the entries (by returning null)
*/
function flatten(obj,callback) {
    let arr = [];
    let iDepth, oDepth = 0;
    let state = {identityDetection:true};
    recurse(obj,state,function(obj,key,state){
        let entry = {};
        entry.name = key;
        entry.value = obj[key];
        entry.depth = oDepth;
        entry.path = state.path;
        entry.parent = state.parent;
        entry.pkey = state.pkey;
        if (callback) entry = callback(entry);
        if (entry) {
            if (state.depth > iDepth) {
                oDepth++;
            }
            else if (state.depth < iDepth) {
                oDepth--;
            }
            iDepth = state.depth;
            arr.push(entry);
        }
    });
    return arr;
}

module.exports = {
    flatten : flatten
};

