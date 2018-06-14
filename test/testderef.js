'use strict';
const should = require('should');
const deref = require('../packages/reftools/lib/dereference.js').dereference;

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
            let output = deref(input,{});
            output.usage.one.should.equal(input.definitions.shared);
            output.usage.two.should.equal(input.definitions.shared);
        });
    });
    describe('toplevel',function(){
        this.timeout(500);
        it('should dereference an object with a top level $ref',function(){
            const toplevel = JSON.parse(`
            {
                "$ref": "#/definitions/referee"
            }
            `);

            const lib = JSON.parse(`
            {
                "definitions": {
                    "referee": {
                        "data": 123
                    }
                }
            }
            `);

            let output = deref(toplevel,lib);
            output.data.should.equal(123);
        });
    });
    describe('oldref',function(){
        it('should annotate where references existed',function(){
            const anno = { top: { $ref: '#/definitions/shared' },
                definitions: { shared: { data: 123 } } };
            let output = deref(anno,{},{$ref:'$oldRef'});
            output.top.data.should.equal(123);
            output.top.$oldRef.should.equal('#/definitions/shared');
        });
    });
});
