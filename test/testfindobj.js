const findObj = require('../packages/reftools/lib/findObj.js').findObj;
const should = require('should');

const data = { a: { b: true } };

describe('findObj',function(){
    it('should not find missing object',function(){
        findObj(data,null).found.should.be.false();
    });
    it('should find itself',function(){
        findObj(data,data).found.should.be.true();
    });
    it('should find itself, path',function(){
        findObj(data,data).path.should.be.exactly('#/');
    });
    it('should find itself, parent',function(){
        should(findObj(data,data).parent).be.exactly(null);
    });
    it('should find child object',function(){
        findObj(data,data.a).found.should.be.true();
    });
    it('should find child object, path',function(){
        findObj(data,data.a).path.should.be.exactly('#/a');
    });
    it('should find child object, parent',function(){
        findObj(data,data.a).parent.should.be.exactly(data);
    });
    it('should find grandchild object',function(){
        findObj(data,data.a.b).found.should.be.true();
    });
    it('should not find similar object',function(){
        findObj(data,{ b: true }).found.should.be.false();
    });
});
