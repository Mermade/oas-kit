'use strict';

function uncircle(obj) {
    let seen = [];
    return JSON.parse(JSON.stringify(obj,function(k,v){
        if (seen.indexOf(v)>=0) {
            return '[Circular]';
        }
        else {
            if ((typeof v === 'object') && (!Array.isArray(v))) seen.push(v);
            return v;
        }
    }));
}

module.exports = {
    uncircle : uncircle
};

