'use strict';

const recurse = require('reftools/lib/recurse.js').recurse;
const jptr = require('reftools/lib/jptr.js').jptr;
const resolveInternal = jptr;
const clone = require('reftools/lib/clone.js').clone;

function uniqueOnly(value, index, self) {
    return self.indexOf(value) === index;
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function allSame(array) {
    return (new Set(array)).size <= 1;
}

/**
 * simple hash implementation based on https://stackoverflow.com/a/7616484/1749888
 * @param {string} s - string to hash
 * @returns {number} numerical hash code
 */
function hash(s) {
    let hash = 0;
    let chr;
    if (s.length === 0) return hash;
    for (let i = 0; i < s.length; i++) {
      chr   = s.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

String.prototype.toCamelCase = function camelize() {
    return this.toLowerCase().replace(/[-_ \/\.](.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
}

function getVersion() {
    return require('./package.json').version;
}

const parameterTypeProperties = [
    'format',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'minLength',
    'maxLength',
    'multipleOf',
    'minItems',
    'maxItems',
    'uniqueItems',
    'minProperties',
    'maxProperties',
    'additionalProperties',
    'pattern',
    'enum',
    'default'
];

const arrayProperties = [
    'items',
    'minItems',
    'maxItems',
    'uniqueItems'
];

const httpVerbs = [
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'head',
    'options',
    'trace'
];

function sanitise(s) {
    s = s.replace('[]','Array');
    let components = s.split('/');
    components[0] = components[0].replace(/[^A-Za-z0-9_\-\.]+|\s+/gm, '_');
    return components.join('/');
}

function sanitiseAll(s) {
    return sanitise(s.split('/').join('_'));
}

module.exports = {

    clone: clone,
    uniqueOnly: uniqueOnly,
    hasDuplicates: hasDuplicates,
    allSame: allSame,
    recurse: recurse,
    hash: hash,
    getVersion: getVersion,
    resolveInternal: resolveInternal,
    parameterTypeProperties: parameterTypeProperties,
    arrayProperties: arrayProperties,
    httpVerbs: httpVerbs,
    sanitise: sanitise,
    sanitiseAll: sanitiseAll

};
