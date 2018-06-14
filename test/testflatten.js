'use strict';
const should = require('should');
const flatten = require('../packages/reftools/lib/flatten.js').flatten;

const input = { container: { child: { value: true } }, sibling: { value: false } };

//depth,path,parent.pkey

describe('flatten',function(){
    describe('simple',function(){
        it('should flatten a simple nested object',function(){
            let output = flatten(input);

            output.should.be.an.Array();
            should(output.length).equal(5);

            output[0].name.should.equal('container');
            output[0].value.should.equal(input.container);
            output[0].depth.should.equal(0);
            output[0].path.should.equal('#/container');
            output[0].parent.should.equal(input);

            output[1].name.should.equal('child');
            output[1].value.should.equal(input.container.child);
            output[1].depth.should.equal(1);
            output[1].path.should.equal('#/container/child');
            output[1].parent.should.equal(input.container);

            output[2].name.should.equal('value');
            output[2].value.should.equal(true);
            output[2].depth.should.equal(2);
            output[2].path.should.equal('#/container/child/value');
            output[2].parent.should.equal(input.container.child);

            output[3].name.should.equal('sibling');
            output[3].value.should.equal(input.sibling);
            output[3].depth.should.equal(1);
            output[3].path.should.equal('#/sibling');
            output[3].parent.should.equal(input);

            output[4].name.should.equal('value');
            output[4].value.should.equal(false);
            output[4].depth.should.equal(2);
            output[4].path.should.equal('#/sibling/value');
            output[4].parent.should.equal(input.sibling);
        });
    });
    describe('filtered',function(){
        it('should flatten a simple nested object, filtering a property',function(){
            let output = flatten(input,function(entry){
                if ((entry.name !== 'child') && (entry.name !== 'sibling')) return entry;
            });

            output.should.be.an.Array();
            should(output.length).equal(3);

            output[0].name.should.equal('container');
            output[0].value.should.equal(input.container);
            output[0].depth.should.equal(0);
            output[0].path.should.equal('#/container');
            output[0].parent.should.equal(input);

            output[1].name.should.equal('value');
            output[1].value.should.equal(true);
            output[1].depth.should.equal(1);
            output[1].path.should.equal('#/container/child/value');
            output[1].parent.should.equal(input.container.child);

            output[2].name.should.equal('value');
            output[2].value.should.equal(false);
            output[2].depth.should.equal(0);
            output[2].path.should.equal('#/sibling/value');
            output[2].parent.should.equal(input.sibling);
        });
    });
});
