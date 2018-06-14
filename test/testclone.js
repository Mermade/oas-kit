'use strict';
const should = require('should');
const clone = require('../packages/reftools/lib/clone.js');

const input = { container: { child: { value: true } } };

describe('clone',function(){
    describe('nop',function(){
        it('should preserve the input object unchanged',function(){
            let output = clone.nop(input);
            output.should.equal(input);
        });
    });
    describe('simple',function(){
        it('should produce a deep clone of a given object',function(){
            let output = clone.clone(input);
            output.should.have.type('object');
            output.should.not.equal(input);
            output.should.deepEqual(input);
            output.container.should.not.equal(input.container);
            output.container.child.should.not.equal(input.container.child);
        });
    });
    describe('fast',function(){
        it('should produce a shallow clone of a given object',function(){
            let output = clone.fastClone(input);
            output.should.have.type('object');
            output.should.not.equal(input);
            output.should.deepEqual(input);
            output.container.should.equal(input.container);
        });
    });
    describe('shallow',function(){
        it('should produce a shallow clone of a given object',function(){
            let output = clone.shallowClone(input);
            output.should.have.type('object');
            output.should.not.equal(input);
            output.should.deepEqual(input);
            output.container.should.equal(input.container);
        });
    });
    describe('deep',function(){
        it('should produce a deep clone of a given object',function(){
            let output = clone.deepClone(input);
            output.should.have.type('object');
            output.should.not.equal(input);
            output.should.deepEqual(input);
            output.container.should.not.equal(input.container);
        });
    });
    describe('circular',function(){
        it('should produce a deep clone of a given object',function(){
            let output = clone.circularClone(input);
            output.should.have.type('object');
            output.should.not.equal(input);
            output.should.deepEqual(input);
            output.container.should.not.equal(input.container);
        });
    });
});
