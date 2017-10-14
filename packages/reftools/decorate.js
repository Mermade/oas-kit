'use strict';

const recurse = require('./recurse.js').recurse;
const jptr = require('./jptr.js').jptr;

/**
* Given an expanded object and its original $ref'd form, will call
* decorator functions:
* callbacks.oldRef - allowing the old $ref to be accessed
* callbacks.circular - called on any circular objects
* callbacks.filter - called for all properties, can mutate/remove (by setting to undefined)
*/
function decorate(obj,original,callbacks) {
    let state = {circularDetection:true};
    recurse(obj,state,function(obj,key,state){
        if (callbacks.oldRef) {
            let equiv = jptr(original,state.path);
            if (equiv && equiv.$ref) {
                obj[key] = callbacks.oldRef(obj,key,state,equiv.$ref);
            }
        }
        if (state.circular && callbacks.circular) {
            obj[key] = callbacks.circular(obj,key,state,state.circularPath);
        }
        if (callbacks.filter) {
            obj[key] = callbacks.filter(obj,key,state);
        }
    });
    return obj;
}

module.exports = {
    decorate : decorate
};

