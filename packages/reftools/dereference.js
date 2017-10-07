'use strict';

const util = require('util');

const recurse = require('./recurse.js').recurse;
const clone = require('./clone.js').clone;
const jptr = require('jgexml/jpath.js');

function dereference(o,definitions,options) {
    let obj = clone(o);
    let changes = 1;
    while (changes > 0) {
        changes = 0;
    if (!options.cache) options.cache = {};
    if (!options.state) options.state = {};
    recurse(obj,options.state,function(obj,key,state){
        if ((key === '$ref') && (typeof obj[key] === 'string')) {
            changes++;
            if (!options.cache[obj[key]]) {
                if (options && options.verbose) {
                    console.log('Dereffing %s',obj[key]);
                }
                let entry = {};
                entry.path = state.path.split('/$ref')[0];
                entry.data = jptr.jptr(definitions,obj[key]);
                options.cache[obj[key]] = entry;
                entry.data = state.parent[state.pkey] = dereference(jptr.jptr(definitions,obj[key]),definitions,options);
                entry.resolved = true;
            }
            else {
                let entry = options.cache[obj[key]];
                if (entry.resolved) {
                    console.log('Patching %s for %s',obj[key],entry.path);
                    state.parent[state.pkey] = entry.data;
                }
                else {
                    console.log('Swapping %s for %s',obj[key],entry.path);
                    obj[key] = entry.path;
                }
            }
        }
    });
    }
    return obj;
}

module.exports = {
    dereference : dereference
};

