#!/usr/bin/env node

const fs = require('fs');
const util = require('util');

const yaml = require('js-yaml');
const fetch = require('node-fetch');

const resolver = require('./resolver.js');

let argv = require('yargs')
    .string('output')
    .alias('o','output')
    .describe('output','file to output to')
    .default('output','resolved.yaml')
    .boolean('quiet')
    .alias('q','quiet')
    .describe('quiet','reduce verbosity')
    .count('verbose')
    .default('verbose',2)
    .alias('v','verbose')
    .describe('verbose','increase verbosity')
    .demand(1)
    .argv;

let filespec = argv._[0];

let options = {resolve: true};

options.verbose = argv.verbose;
if (argv.quiet) options.verbose = 1;

options.origin = filespec;
options.source = filespec;
options.externals = [];
options.externalRefs = {};
options.rewriteRefs = true;
options.cache = [];
options.status ='undefined';

function main(str){
    options.openapi = yaml.safeLoad(str,{json:true});
    resolver.resolve(options)
    .then(function(){
        options.status = 'resolved';
        fs.writeFileSync(argv.output,yaml.safeDump(options.openapi,{lineWidth:-1}),'utf8');
    })
    .catch(function(err){
        options.status = 'rejected';
        console.warn(err);
    });
}

if (filespec && filespec.startsWith('http')) {
    console.log('GET ' + filespec);
    fetch(filespec, {agent:options.agent}).then(function (res) {
        if (res.status !== 200) throw new Error(`Received status code ${res.status}`);
        return res.text();
    }).then(function (body) {
        main(body);
    }).catch(function (err) {
        console.warn(err);
    });
}
else {
    fs.readFile(filespec,'utf8',function(err,data){
        if (err) {
            console.warn(err);
        }
        else {
            main(data);
        }
    });
}

process.on('exit',function(){
    //console.log(util.inspect(options.openapi,{depth:null}));
    console.log(options.status);
});
