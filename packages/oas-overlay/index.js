'use strict';

const clone = require('reftools/lib/clone.js').clone;
const recurse = require('reftools/lib/recurse.js').recurse;
const jmespath = require('jmespath');

function apply(overlay,openapi,options){
    const src = clone(openapi);
    for (let update of overlay.overlay.updates) {
        let result = jmespath.search(src,update.target);
        if (typeof result === 'object') Object.assign(result,update.value);
    }
    recurse(src,{},function(obj,key,state){
        if (obj[key] === null) delete obj[key];
    });
    return src;
}

module.exports = {
    apply
};

