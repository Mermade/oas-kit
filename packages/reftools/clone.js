'use strict';

/**
* a collection of cloning functions
*/

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function shallowClone(obj) {
    let result = {};
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            result[p] = obj[p];
        }
    }
    return result;
}

function deepClone(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let p in obj) {
        if (obj.hasOwnProperty(p) || Array.isArray(obj)) {
            result[p] = (typeof obj[p] === 'object') ? deepClone(obj[p]) : obj[p];
        }
    }
    return result;
}

function fastClone(obj) {
    return Object.assign({},obj);
}

module.exports = {
    clone : clone,
    shallowClone : shallowClone,
    deepClone : deepClone,
    fastClone : fastClone
};

