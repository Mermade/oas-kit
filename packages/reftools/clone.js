'use strict';

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function shallowClone(obj) {
    let result = {};
    for (let p in obj) {
        result[p] = obj[p];
    }
    return result;
}

module.exports = {
    clone : clone,
    shallowClone : shallowClone
};

