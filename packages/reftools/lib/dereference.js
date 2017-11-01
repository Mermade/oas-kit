'use strict';

const util = require('util');

const recurse = require('./recurse.js').recurse;
const clone = require('./clone.js').shallowClone;
const jptr = require('./jptr.js').jptr;

var getLogger = function (options) {
    if (options && options.verbose) {
        return {
            warn: function() {
                var args = Array.prototype.slice.call(arguments);
                console.warn.apply(console, args);
            }
        }
    }
    else {
        return {
            warn: function() {
                //nop
            }
        }
    }
}

/**
* dereferences the given object
* @param o the object to dereference
* @definitions a source of definitions to reference
* @options optional settings (used recursively)
* @return the dereferenced object
*/
function dereference(o,definitions,options) {
    if (!options) options = {};
    if (!options.cache) options.cache = {};
    if (!options.state) options.state = {};
    options.state.identityDetection = true;
    // options.depth allows us to limit cloning to the first invocation
    options.depth = (options.depth ? options.depth+1 : 1);
    let obj = (options.depth > 1 ? o : clone(o));
    let defs = (options.depth > 1 ? definitions : clone(definitions));
    // options.master is the top level object, regardless of depth
    if (!options.master) options.master = obj;

    let logger = getLogger(options);

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
                logger.warn('Dereffing %s at %s',obj[key],entry.path);
                entry.source = defs;
                entry.data = jptr(entry.source,entry.key);
                if (entry.data === false) {
                    entry.data = jptr(options.master,entry.key);
                    entry.source = options.master;
                }
                options.cache[obj[key]] = entry;
                entry.data = state.parent[state.pkey] = dereference(jptr(entry.source,entry.key),entry.source,options);
                entry.resolved = true;
            }
            else {
                let entry = options.cache[obj[key]];
                if (entry.resolved) {
                    // we have already seen and resolved this reference
                    logger.warn('Patching %s for %s',obj[key],entry.path);
                    state.parent[state.pkey] = entry.data;
                }
                else if (obj[key] === entry.path) {
                    // reference to itself, throw
                    throw new Error(`Tight circle at ${entry.path}`);
                }
                else {
                    // we're dealing with a circular reference here
                    logger.warn('Unresolved ref');
                    logger.warn(util.inspect(entry));
                    state.parent[state.pkey] = jptr(defs,entry.path);
                    if (state.parent[state.pkey] === false) {
                        state.parent[state.pkey] = jptr(defs,entry.key);
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

