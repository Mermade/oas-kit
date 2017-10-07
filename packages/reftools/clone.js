'use strict';

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    clone : clone
};

