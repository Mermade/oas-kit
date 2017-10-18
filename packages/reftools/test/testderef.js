const should = require('should');
const deref = require('../lib/dereference.js').dereference;

const input = JSON.parse(`
{
  "usage": {
    "one": {
      "$ref": "#/definitions/shared"
    },
    "two": {
      "$ref": "#/definitions/shared"
    }
  },
  "definitions": {
    "shared": {
      "container": "value"
    }
  }
}
`);

describe('dereference',function(){
    describe('simple',function(){
        it('should dereference an object with $refs',function(){
            let output = deref(input);
            output.usage.one.should.equal(input.definitions.shared);
            output.usage.two.should.equal(input.definitions.shared);
        });
    });
});
