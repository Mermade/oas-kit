'use strict';

/**
* a collection of cloning functions
*/

/**
* clones the given object using JSON.parse and JSON.stringify
* @param obj the object to clone
* @return the cloned object
*/
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
* clones the given object's properties shallowly, ignores properties from prototype
* @param obj the object to clone
* @return the cloned object
*/
function shallowClone(obj) {
    let result = {};
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            result[p] = obj[p];
        }
    }
    return result;
}

/**
* clones the given object's properties deeply, ignores properties from prototype
* @param obj the object to clone
* @return the cloned object
*/
function deepClone(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let p in obj) {
        if (obj.hasOwnProperty(p) || Array.isArray(obj)) {
            result[p] = (typeof obj[p] === 'object') ? deepClone(obj[p]) : obj[p];
        }
    }
    return result;
}

/**
* clones the given object's properties shallowly, using Object.assign
* @param obj the object to clone
* @return the cloned object
*/
function fastClone(obj) {
    return Object.assign({},obj);
}

module.exports = {
    clone : clone,
    shallowClone : shallowClone,
    deepClone : deepClone,
    fastClone : fastClone
};

