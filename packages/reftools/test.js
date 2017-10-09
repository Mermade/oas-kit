const util = require('util');
const fs = require('fs');
const yaml = require('js-yaml');

const dereference = require('./dereference.js').dereference;
const uncircle = require('./uncircle.js').uncircle;
const decorate = require('./decorate.js').decorate;
const clone = require('./clone.js').clone;

//const apiName = '../openapi-directory/APIs/patientview.org/1.0/swagger.yaml';
//const apiName = '../openapi-directory/APIs/bbci.co.uk/1.0/swagger.yaml';
const apiName = '../openapi-directory/APIs/bungie.net/2.0.0/swagger.yaml';

let apiStr = fs.readFileSync(apiName,'utf8');
let api = yaml.safeLoad(apiStr,{json:true});

let clones = clone(api.definitions);

for (let s in api.definitions) {

    console.warn('# %s',s);

let schema = api.definitions[s];
let backup = clones[s];

//console.log(JSON.stringify(schema,null,2));

let options = {verbose:true};

let deref = dereference(schema,api,options);
console.log(JSON.stringify(backup,null,2));
deref = decorate(deref,backup,'x-widdershins-oldRef');

try {
    console.log(JSON.stringify(deref,null,2));
}
catch (ex) {
    deref = uncircle(deref);
    console.log(JSON.stringify(deref,null,2));
}

//console.log(JSON.stringify(flatten(deref),null,2));

}
