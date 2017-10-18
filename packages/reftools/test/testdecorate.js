const should = require('should');
const decorate = require('../lib/decorate.js').decorate;

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

// TODO oldReffing, mutating and identity checking

describe('decorate',function(){
    describe('simple',function(){
        it('should traverse a simple object',function(){
            let calls = [];

            decorate(input,{},{
                filter: function(obj,key,state){
                    calls.push(obj[key]);
                    return obj[key];
                }
            });

            calls.should.be.an.Array();
            should(calls.length).be.exactly(8);

        });
        it('should filter decorate a simple object',function(){
            let calls = [];

            decorate(input,{},{
                filter: function(obj,key,state){
                    calls.push(obj[key]);
                    if (key !== 'usage') {
                        return obj[key];
                    }
                }
            });

            calls.should.be.an.Array();
            should(calls.length).be.exactly(4);

        });
    });
});
