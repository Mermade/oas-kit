'use strict';

const deepCopy = require('deep-copy')

/**
* a collection of cloning functions
*/

/**
* a no-op placeholder which returns the given object unchanged
* useful for when a clone function needs to be passed but cloning is not
* required
* @param obj the input object
* @return the input object, unchanged
*/
function nop(obj) {
    return obj;
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
* clones the given object's properties shallowly, using Object.assign
* @param obj the object to clone
* @return the cloned object
*/
function fastClone(obj) {
    return Object.assign({},obj);
}

/**
* Source: stackoverflow http://bit.ly/2A1Kha6
*/

module.exports = {
    nop : nop,
    clone : deepCopy,
    shallowClone : shallowClone,
    deepClone : deepCopy,
    fastClone : fastClone,
    circularClone : deepCopy
};

