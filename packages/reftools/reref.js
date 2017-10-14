'use strict';

/**
* Simply creates an object without self-references by replacing them
* with $ref pointers
*/

function reref(obj) {
    recurse(obj,{identityDetection:true},function(obj,key,state){
        if (state.identical) {
            obj[key] = { $ref: state.identicalPath };
        }
    });
}

module.exports = {
    reref : reref
};

