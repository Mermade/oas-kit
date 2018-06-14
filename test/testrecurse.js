'use strict';
const should = require('should');
const recurse = require('../packages/reftools/lib/recurse.js').recurse;

describe('recurse',function(){
    describe('simple',function(){
        it('should traverse a simple nested object',function(){

            const input = { container: { child: { value: true, string: '1234' }, child2: { value: false, '{id}': { test: 'abc' } } } };
            let output = [];
            recurse(input,{},function(obj,key,state){
                let entry = {};
                entry.obj = obj;
                entry.key = key;
                entry.state = state;
                output.push(entry);
            });

            output.should.be.an.Array();
            should(output.length).equal(8);
            output[0].key.should.equal('container');
            output[0].obj.should.equal(input);
            output[0].state.depth.should.equal(0);
            output[0].state.path.should.equal('#');
            output[0].state.parent.should.deepEqual({});

            output[1].key.should.equal('child');
            output[1].obj.should.equal(input.container);
            output[1].state.depth.should.equal(1);
            output[1].state.path.should.equal('#/container');
            output[1].state.parent.should.equal(input);

            output[2].key.should.equal('value');
            output[2].obj.should.equal(input.container.child);
            output[2].state.depth.should.equal(2);
            output[2].state.path.should.equal('#/container/child');
            output[2].state.parent.should.equal(input.container);

            output[3].key.should.equal('string');
            output[3].obj.should.equal(input.container.child);
            output[3].state.depth.should.equal(2);
            output[3].state.path.should.equal('#/container/child');
            output[3].state.parent.should.equal(input.container);

            output[4].key.should.equal('child2');
            output[4].obj.should.equal(input.container);
            output[4].state.depth.should.equal(1);
            output[4].state.path.should.equal('#/container');
            output[4].state.parent.should.equal(input);

            output[5].key.should.equal('value');
            output[5].obj.should.equal(input.container.child2);
            output[5].state.depth.should.equal(2);
            output[5].state.path.should.equal('#/container/child2');
            output[5].state.parent.should.equal(input.container);

            output[6].key.should.equal('{id}');
            output[6].obj.should.equal(input.container.child2);
            output[6].state.depth.should.equal(2);
            output[6].state.path.should.equal('#/container/child2');
            output[6].state.parent.should.equal(input.container);

            output[7].key.should.equal('test');
            output[7].obj.should.equal(input.container.child2["{id}"]);
            output[7].state.depth.should.equal(3);
            output[7].state.path.should.equal('#/container/child2/%7Bid%7D');
            output[7].state.parent.should.equal(input.container.child2);
        });
    });
    it('should not traverse a string',function(){
        let calls = 0;
        recurse('hello',{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a boolean',function(){
        let calls = 0;
        recurse(true,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a number',function(){
        let calls = 0;
        recurse(1,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should not traverse a null',function(){
        let calls = 0;
        recurse(null,{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(0);
    });
    it('should traverse an array',function(){
        let calls = 0;
        recurse([0,1,2],{},function(obj,key,state){
            calls++;
        });
        calls.should.be.exactly(3);
    });

    describe('identity',function(){
        it('should detect object identity',function(){
            const input = { solo: '123' };
            const a = { hello: 'sailor' };
            input.b = a;
            input.c = a;
            recurse(input,{identityDetection:true},function(obj,key,state){
                if (key === 'solo') {
                    obj[key].should.equal(input.solo);
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'b') {
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'hello') {
                    state.identity.should.be.exactly(false);
                }
                else if (key === 'c') {
                    should(state.identityPath).not.be.undefined();
                    state.identity.should.be.exactly(true);
                    state.identityPath.should.be.exactly('#/b');
                }
            });
        });
    });
    describe('null',function(){
        it('should be able to recurse through an object with nulls',function(){
            recurse({test:null},{},function(obj,key,state){
                key.should.be.equal('test');
                should(obj[key]).be.exactly(null);
            });
        });
    });
    describe('null',function(){
        it('should be able to recurse through an object with nulls, id',function(){
            recurse({test:null},{identityDetection:true},function(obj,key,state){
                key.should.be.equal('test');
                should(obj[key]).be.exactly(null);
            });
        });
    });
});

