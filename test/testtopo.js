'use strict';
const should = require('should');
const toposort = require('../packages/reftools/lib/toposort.js').toposort;
const objToGraph = require('../packages/reftools/lib/toposort.js').objToGraph;

describe('Topological sorting', function() {
  describe('Acyclic Graph Test',function(){
  it('should find a topological sort',function(){
  let nodes = [
    {  _id: "3",  links: ["8", "10"]      },
    {  _id: "5",  links: ["11"]           },
    {  _id: "7",  links: ["11", "8"]      },
    {  _id: "8",  links: ["9"]            },
    {  _id: "11", links: ["2", "9", "10"] },
    {  _id: "10", links: []               },
    {  _id: "9",  links: []               },
    {  _id: "2",  links: []               }
  ];

  let result = toposort(nodes);
  result.should.deepEqual({"sort":[{"_id":"7","links":[]},{"_id":"5","links":[]},{"_id":"11","links":[]},{"_id":"2","links":[]},{"_id":"3","links":[]},{"_id":"8","links":[]},{"_id":"9","links":[]},{"_id":"10","links":[]}],"nodesWithEdges":[]});
  });
});

describe('Cyclic graph test',function(){
  it('should not find a topological sort',function(){
let nodes = [
  {  _id: "3",  links: ["8", "10"]      },
  {  _id: "5",  links: ["11"]           },
  {  _id: "7",  links: ["11", "8"]      },
  {  _id: "8",  links: ["9"]            },
  {  _id: "11", links: ["2", "9", "10"] },
  {  _id: "10", links: ["7"]            },
  {  _id: "9",  links: []               },
  {  _id: "2",  links: []               }
];
let result = toposort(nodes);
result.should.deepEqual({"sort":null,"nodesWithEdges":[{"_id":"7","links":["11","8"]},{"_id":"8","links":["9"]},{"_id":"11","links":["2","9","10"]},{"_id":"10","links":["7"]}]});

});
});

    describe('JSON object toposort',function(){
        it('should find a topological sort of an object without $refs',function(){
            const input = { data: { value: 123 }};
            let graph = objToGraph(input);
            let result = toposort(graph);
            should(result.sort).not.be.equal(null);
            result.sort.should.be.an.Array();
            result.sort.should.be.empty();
            result.nodesWithEdges.should.be.an.Array();
            result.nodesWithEdges.should.be.empty();
        });
    });

});

