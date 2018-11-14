#!/usr/bin/env node

'use strict';

const fs = require('fs');
const util = require('util');

const yaml = require('js-yaml');
const fetch = require('node-fetch');

const resolver = require('./index.js');

let argv = require('yargs')
    .string('output')
    .alias('o','output')
    .describe('output','file to output to')
    .default('output','resolved.yaml')
    .count('quiet')
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
if (argv.quiet) options.verbose = options.verbose - argv.quiet;
options.fatal = true;

function main(str,source,options){
    let input = yaml.safeLoad(str,{json:true});
    resolver.resolve(input,source,options)
    .then(function(options){
        fs.writeFileSync(argv.output,yaml.safeDump(options.openapi,{lineWidth:-1}),'utf8');
    })
    .catch(function(err){
        console.warn(err);
    });
}

if (filespec && filespec.startsWith('http')) {
    console.log('GET ' + filespec);
    fetch(filespec, {agent:options.agent}).then(function (res) {
        if (res.status !== 200) throw new Error(`Received status code ${res.status}`);
        return res.text();
    }).then(function (body) {
        main(body,filespec,options);
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
            main(data,filespec,options);
        }
    });
}
