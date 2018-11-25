'use strict';
const util = require('util');

const should = require('should');
const reref = require('../packages/reftools/lib/reref.js').reref;

const input = JSON.parse(`
{
  "usage": {
    "one": {},
    "two": {}
  },
  "definitions": {
    "shared": {
      "container": "value"
    }
  }
}
`);
input.usage.one = input.definitions.shared;
input.usage.two = input.definitions.shared;

describe('reref',function(){
    describe('simple',function(){
        it('should re-reference an object with identities',function(){
            let output = reref(input,{verbose:true});
            output.usage.one.should.have.property('$ref');
            output.usage.two.should.have.property('$ref');
            output.usage.two.$ref.should.equal('#/usage/one');
            output.definitions.shared.container.should.equal('value');
        });
    });
});
