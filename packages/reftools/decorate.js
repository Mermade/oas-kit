'use strict';
const recurse = require('./recurse.js').recurse;
const jptr = require('jgexml/jpath.js').jptr;

/**
* Given an expanded object and its original $ref'd form, will decorate
* with a new property indicating where the $refs were
*/
function decorate(obj,original,property) {
    recurse(obj,{},function(obj,key,state){
        let equiv = jptr(original,state.path);
        if (equiv && equiv.$ref) {
            obj[property] = equiv.$ref;
        }
    });
    return obj;
}

module.exports = {
    decorate : decorate
};

