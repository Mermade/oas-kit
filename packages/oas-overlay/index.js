'use strict';

const util = require('util');

const clone = require('reftools/lib/clone.js').clone;
const recurse = require('reftools/lib/recurse.js').recurse;
const deref = require('reftools/lib/dereference.js').dereference;
const reref = require('reftools/lib/reref.js').reref;
const findObj = require('reftools/lib/findObj.js').findObj;
const jmespath = require('jmespath');

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function truetype(v) {
    if (v === null) return 'null';
    return Array.isArray(v) ? 'array' : typeof v;
}

function process(result,src,update,options) {
    for (let i in result) {
        let item = result[i];
        const itype = truetype(item);
        if (options.verbose) {
            const present = findObj(src,item);
            console.warn('item',util.inspect({update:update,result:item,rtype:itype,locn:present},{depth:null,colors:true}));
        }
        if (itype === 'array') {
            process(item,src,update,options);
        }
        else {
            if (typeof update.value !== 'undefined') {
                result[i] = mergeDeep(item,update.value);
            }
            if (update.remove === true) {
                delete result[i];
            }
       }
    }
}

function apply(overlay,openapi,options) {
    let src = clone(openapi);
    if (options.deref) src = deref(src);
    for (let update of overlay.updates) {
        try {
            let result = jmespath.search(src,update.target);
            const rtype = truetype(result);
            const present = findObj(src,result);
            if (options.verbose) {
                console.warn('result',util.inspect({update:update,result:result,rtype:rtype,locn:present},{depth:Infinity,colors:true}));
            }
            if (rtype === 'object') {
                if (update.remove) {
                  delete present.parent[present.path.split('/').pop()];
                }
                else {
                  result = mergeDeep(result,update.value);
                }
            }
            else if (rtype === 'array') {
                if (present.found) {
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
                console.warn(update.target,'cannot update immutable type',rtype+' (target parent node instead)');
            }
        }
        catch (ex) {
            console.warn(update.target,'cannot be parsed',ex.message);
        }
    }
    if (options.reref) src = reref(src);
    return src;
}

module.exports = {
    apply
};

