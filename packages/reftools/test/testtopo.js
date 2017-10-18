const should = require('should');
const toposort = require('../lib/toposort.js').toposort;

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

});

