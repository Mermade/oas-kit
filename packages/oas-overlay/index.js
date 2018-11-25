'use strict';

const util = require('util');

const clone = require('reftools/lib/clone.js').clone;
const recurse = require('reftools/lib/recurse.js').recurse;
const findObj = require('reftools/lib/findObj.js').findObj;
const jmespath = require('jmespath');

function process(result,src,update,options){
    for (let item of result) {
        const itype = Array.isArray(item) ? 'array' : typeof item;
        if (itype === 'array') {
            process(item,src,update,options);
        }
        else {
            if (options.verbose) {
                console.warn(util.inspect(item));
                console.warn(findObj(src,item));
            }
            Object.assign(item,clone(update.value));
       }
    }
}

function apply(overlay,openapi,options){
    const src = clone(openapi);
    for (let update of overlay.overlay.updates) {
        try {
            const result = jmespath.search(src,update.target);
            const rtype = Array.isArray(result) ? 'array' : typeof result;
            if (rtype === 'object') {
                if (options.verbose) {
                    console.warn(util.inspect(result));
                    console.warn(findObj(src,result));
                }
                Object.assign(result,update.value);
            }
            else if (rtype === 'array') {
                const present = findObj(src,result);
                if (present) {
                    if (Array.isArray(update.value)) {
                        for (let value of update.value) {
                            result.push(value);
                        }
                    }
                    else {
                        result.push(update.value);
                    }
                }
                else {
                    process(result,src,update,options);
                }
            }
        }
        catch (ex) {
            console.warn(update.target,'cannot be parsed',ex.message);
        }
    }
    recurse(src,{},function(obj,key,state){
        if (obj[key] === null) delete obj[key];
    });
    return src;
}

module.exports = {
    apply
};

