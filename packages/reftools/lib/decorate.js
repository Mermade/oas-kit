'use strict';

const recurse = require('./recurse.js').recurse;
const jptr = require('./jptr.js').jptr;

/**
* Given an expanded object and its original $ref'd form, will call
* decorator functions:
* callbacks.oldRef - allowing the old $ref to be accessed
* callbacks.identical - called on any identical objects
* callbacks.filter - called for all properties, can mutate/remove (by setting to undefined)
*/
function decorate(obj,original,callbacks) {
    let state = {identityDetection:true};
    recurse(obj,state,function(obj,key,state){
        if (callbacks.oldRef) {
            let equiv = jptr(original,state.path);
            if (equiv && equiv.$ref) {
                obj[key] = callbacks.oldRef(obj,key,state,equiv.$ref);
            }
        }
        if (state.identical && callbacks.identical) {
            obj[key] = callbacks.identical(obj,key,state,state.identicalPath);
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

