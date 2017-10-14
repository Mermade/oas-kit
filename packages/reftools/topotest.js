const toposort = require('./toposort.js').toposort;

var nodes = [
  {  _id: "3",  links: ["8", "10"]      },
  {  _id: "5",  links: ["11"]           },
  {  _id: "7",  links: ["11", "8"]      },
  {  _id: "8",  links: ["9"]            },
  {  _id: "11", links: ["2", "9", "10"] },
  {  _id: "10", links: []               },
  {  _id: "9",  links: []               },
  {  _id: "2",  links: []               }
];

var result = toposort(nodes);

if (result === null) {
  console.error('Graph got cycle somehwere');
} else {
  console.log('topological sorting:');
  console.log(result);
}

nodes = [
  {  _id: "3",  links: ["8", "10"]      },
  {  _id: "5",  links: ["11"]           },
  {  _id: "7",  links: ["11", "8"]      },
  {  _id: "8",  links: ["9"]            },
  {  _id: "11", links: ["2", "9", "10"] },
  {  _id: "10", links: ["7"]            },
  {  _id: "9",  links: []               },
  {  _id: "2",  links: []               }
];
result = toposort(nodes);

if (result === null) {
  console.error('Graph got cycle somehwere');
} else {
  console.log('topological sorting:');
  console.log(result);
}
