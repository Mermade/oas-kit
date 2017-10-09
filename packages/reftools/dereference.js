'use strict';

const util = require('util');

const recurse = require('./recurse.js').recurse;
const clone = require('./clone.js').shallowClone;
const jptr = require('jgexml/jpath.js');

function dereference(o,definitions,options) {
    if (!options) options = {};
    if (!options.cache) options.cache = {};
    if (!options.state) options.state = {};
    options.depth = (options.depth ? options.depth+1 : 1);
    let obj = (options.depth > 1 ? o : clone(o));
    let defs = (options.depth > 1 ? definitions : clone(definitions));
    if (!options.master) options.master = obj;
    let changes = 1;
    while (changes > 0) {
        changes = 0;
    recurse(obj,options.state,function(obj,key,state){
        if ((key === '$ref') && (typeof obj[key] === 'string')) {
            changes++;
            if (!options.cache[obj[key]]) {
                let entry = {};
                entry.path = state.path.split('/$ref')[0];
                entry.key = obj[key];
                entry.org = obj[key];
                if (options && options.verbose) {
                    console.warn('Dereffing %s at %s',obj[key],entry.path);
                }
                entry.source = defs;
                entry.data = jptr.jptr(entry.source,entry.key);
                if (entry.data === false) {
                    entry.data = jptr.jptr(options.master,entry.key);
                    entry.source = options.master;
                }
                options.cache[obj[key]] = entry;
                entry.data = state.parent[state.pkey] = dereference(jptr.jptr(entry.source,entry.key),entry.source,options);
                entry.resolved = true;
            }
            else {
                let entry = options.cache[obj[key]];
                if (entry.resolved) {
                    console.warn('Patching %s for %s',obj[key],entry.path);
                    state.parent[state.pkey] = entry.data;
                }
                else if (obj[key] === entry.path) {
                    console.warn('Tight circle at %s',entry.path);
                    console.warn(util.inspect(options.cache));
                    process.exit(1);
                }
                else {
                    console.warn('Unresolved ref');
                    console.warn(util.inspect(entry));
                    state.parent[state.pkey] = jptr.jptr(defs,entry.path);
                    if (state.parent[state.pkey] === false) {
                        state.parent[state.pkey] = jptr.jptr(defs,entry.key);
                    }
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

