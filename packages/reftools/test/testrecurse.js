const should = require('should');
const recurse = require('../lib/recurse.js').recurse;

const input = { container: { child: { value: true } } };

describe('recurse',function(){
    describe('simple',function(){
        it('should traverse a simple nested object',function(){

            let output = [];
            recurse(input,{},function(obj,key,state){
                let entry = {};
                entry.obj = obj;
                entry.key = key;
                entry.state = state;
                output.push(entry);
            });

            output.should.be.an.Array();
            should(output.length).equal(3);
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
        });
    });
});
