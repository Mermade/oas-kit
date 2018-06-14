'use strict';

const should = require('should');
const isRef = require('../packages/reftools/lib/isref.js').isRef;

const simple = { '$ref': '#/' };
const extended = { '$ref': '#/', description: 'desc' };
const wrongType = { '$ref': true };

describe('isref',function(){
    describe('basic tests',function(){
        it('should match an object with a $ref',function(){
            isRef(simple,'$ref').should.be.exactly(true);
        });
        it('should match an object with a $ref and other properties',function(){
            isRef(extended,'$ref').should.be.exactly(true);
        });
        it('should not match a missing key',function(){
            isRef(simple,'description').should.be.exactly(false);
        });
        it('should not match a key not called $ref',function(){
            isRef(extended,'description').should.be.exactly(false);
        });
        it('should not match a key which is not a string',function(){
            isRef(wrongType,'$ref').should.be.exactly(false);
        });
        it('should not match when object is undefined',function(){
            isRef(undefined,'$ref').should.be.exactly(false);
        });
    });
});

