const should = require('should');
const reref = require('../lib/reref.js').reref;

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
            let output = reref(input);
            output.usage.one.container.should.equal('value');
            output.usage.two.$ref.should.equal('#/usage/one');
            output.definitions.shared.$ref.should.equal('#/usage/one');
        });
    });
});
