'use strict';

const recurse = require('./recurse.js');
const jptr = require('jgexml/jpath.js');

function uncircle(obj) {
    let seen = [];
    return JSON.parse(JSON.stringify(obj,function(k,v){
        if (seen.indexOf(v)>=0) {
            return '[Circular]';
        }
        else {
            seen.push(v);
            return v;
        }
    });
}

module.exports = {
    uncircle : uncircle
};

