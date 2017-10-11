const util = require('util');
const fs = require('fs');
const yaml = require('js-yaml');

const dereference = require('./dereference.js').dereference;
const uncircle = require('./uncircle.js').uncircle;
const decorate = require('./decorate.js').decorate;
const clone = require('./clone.js').clone;
const flatten = require('./flatten.js').flatten;

//const apiName = '../openapi-directory/APIs/patientview.org/1.0/swagger.yaml';
const apiName = '../openapi-directory/APIs/bbci.co.uk/1.0/swagger.yaml';
//const apiName = '../openapi-directory/APIs/bungie.net/2.0.0/swagger.yaml';

let apiStr = fs.readFileSync(apiName,'utf8');
let api = yaml.safeLoad(apiStr,{json:true});

let clones = clone(api.definitions);

for (let s in api.definitions) {

    console.log('# %s',s);

    let schema = api.definitions[s];
    let backup = clones[s];

    let options = {verbose:true};

    let deref = dereference(schema,api,options);
    console.log('# original');
    console.log(JSON.stringify(backup,null,2));

    try {
        console.log('# '+s+' dereffed version is non-cyclical\n'+
            JSON.stringify(deref,null,2));
    }
    catch (ex) {
        deref = decorate(deref,{},{
            circular: function(obj,key,state,path) {
                return '[Circular: '+path+']';
            }
        });
        console.log('# '+s+' dereffed version is cyclical');
        console.log(JSON.stringify(deref,null,2));
    }

    deref = decorate(deref,backup,{
        oldRef : function(obj,key,state,$ref){
            obj['x-widdershins-oldRef'] = $ref;
            return obj[key];
        }
    });
    try {
        console.log('# '+s+' decorated version is non-cyclical\n'+
            JSON.stringify(deref,null,2));
    }
    catch (ex) {
        deref = decorate(deref,{},{
            circular: function(obj,key,state,path) {
                return '[Circular: '+path+']';
            }
        });
        console.log('# '+s+' decorated version is cyclical');
        console.log(JSON.stringify(deref,null,2));
    }

    let f = flatten(deref,function(entry){
        if (entry.pkey == 'properties') return entry;
        return null;
    });
    console.log('# '+s+' flattened property names');
    for (let e of f) {
        console.log('.'.repeat(e.depth)+e.name);
    }


    //process.exit(1);

}
