'use strict';

const deepCopy = require('deep-copy')
const cloneDeep = require('lodash.clonedeep')

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

// function circularClone(obj, hash) {
//     if (!hash) hash = new WeakMap();
//     // Do not try to clone primitives or functions
//     if (Object(obj) !== obj || obj instanceof Function) return obj;
//     if (hash.has(obj)) return hash.get(obj); // Cyclic reference
//     try { // Try to run constructor (without arguments, as we don't know them)
//         var result = new obj.constructor();
//     } catch(e) { // Constructor failed, create object without running the constructor
//         result = Object.create(Object.getPrototypeOf(obj));
//     }
//     // Optional: support for some standard constructors (extend as desired)
//     /*if (obj instanceof Map)
//         Array.from(obj, ([key, val]) => result.set(circularClone(key, hash),
//                                                    circularClone(val, hash)) );
//     else if (obj instanceof Set)
//         Array.from(obj, (key) => result.add(circularClone(key, hash)) );
//     */
//     // Register in hash
//     hash.set(obj, result);
//     // Clone and assign enumerable own properties recursively
//     return Object.assign(result, ...Object.keys(obj).map (
//         key => ({ [key]: circularClone(obj[key], hash) }) ));
// }


module.exports = {
    nop : nop,
    clone : deepCopy,
    shallowClone : shallowClone,
    deepClone : deepCopy,
    fastClone : fastClone,
    circularClone : cloneDeep
};

