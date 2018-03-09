'use strict';

function isRef(obj,key) {
    return ((key === '$ref') && (typeof obj[key] === 'string'));
}

module.exports = {
    isRef: isRef
};

