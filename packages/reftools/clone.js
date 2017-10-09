'use strict';

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
    let result = {};
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
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

