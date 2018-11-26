'use strict';

const util = require('util');

const clone = require('reftools/lib/clone.js').clone;
const recurse = require('reftools/lib/recurse.js').recurse;
const deref = require('reftools/lib/dereference.js').dereference;
const reref = require('reftools/lib/reref.js').reref;
const findObj = require('reftools/lib/findObj.js').findObj;
const jmespath = require('jmespath');

function truetype(v){
    return Array.isArray(v) ? 'array' :  typeof v;
}

function process(result,src,update,options){
    for (let item of result) {
        const itype = truetype(item);
        if (options.verbose) {
            console.warn('item',util.inspect({update:update,result:item,rtype:itype,locn:findObj(src,item)},{depth:null,colors:true}));
        }
        if (itype === 'array') {
            process(item,src,update,options);
        }
        else {
            Object.assign(item,update.value);
       }
    }
}

function apply(overlay,openapi,options){
    const src = deref(clone(openapi));
    for (let update of overlay.updates||overlay.overlay.updates) {
        try {
            const result = jmespath.search(src,update.target);
            const rtype = truetype(result);
            if (options.verbose) {
                console.warn('result',util.inspect({update:update,result:result,rtype:rtype,locn:findObj(src,result)},{depth:null,colors:true}));
            }
            if (rtype === 'object') {
                Object.assign(result,update.value);
            }
            else if (rtype === 'array') {
                const present = findObj(src,result).found;
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
            else {
                console.warn(update.target,'cannot update immutable type',rtype);
            }
        }
        catch (ex) {
            console.warn(update.target,'cannot be parsed',ex.message);
        }
    }
    recurse(src,{},function(obj,key,state){
        if (obj[key] === null) delete obj[key];
    });
    return reref(src);
}

module.exports = {
    apply
};

