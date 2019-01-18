#!/usr/bin/env node

// this example requires async/await

'use strict';

const fs = require('fs');

const yaml = require('yaml');
const fetch = require('node-fetch-h2');
const bae = require('better-ajv-errors');

const swagger2openapi = require('./index.js');
const validator = require('oas-validator');

process.exitCode = 1;

let argv = require('yargs')
    .boolean('all')
    .alias('a','all')
    .describe('all','show all lint warnings')
    .boolean('bae')
    .alias('b','bae')
    .describe('bae','enable better-ajv-errors')
    .string('encoding')
    .alias('e','encoding')
    .default('encoding','utf8')
    .describe('encoding','text encoding to use')
    .boolean('force')
    .alias('f','force')
    .describe('force','output even if validation/lint failures')
    .boolean('internal')
    .alias('i','internal')
    .describe('internal','resolve internal $refs also')
    .boolean('lint')
    .describe('lint','also lint the document')
    .alias('l','lint')
    .array('lintSkip')
    .describe('lintSkip','linter rule name(s) to skip')
    .alias('s','lintSkip')
    .boolean('dumpMeta')
    .alias('m','dumpMeta')
    .describe('dumpMeta','Dump definition metadata')
    .string('output')
    .alias('o','output')
    .describe('output','outfile file to write to, default STDOUT')
    .count('quiet')
    .alias('q','quiet')
    .describe('quiet','reduce verbosity')
    .count('verbose')
    .default('verbose',1)
    .alias('v','verbose')
    .describe('verbose','increase verbosity')
    .demand(1)
    .argv;

function main(){
    return new Promise(async function(resolve,reject){
        const ruleUrls = new Set();
        argv.resolve = true;
        argv.patch = true;
        argv.source = argv._[0];
        if (argv.all) argv.lintLimit = Number.MAX_SAFE_INTEGER;
        if (argv.bae) {
            argv.validateSchema = 'first';
            argv.prettify = true;
        }
        if (argv.internal) {
            argv.resolveInternal = true;
        }
        let options = {};
        let result = false;
        try {
          if (argv.source.startsWith('http')) {
              options = await swagger2openapi.convertUrl(argv.source,argv);
          }
          else {
              options = await swagger2openapi.convertFile(argv.source,argv);
          }
          result = await validator.validateSync(options.openapi,options);
        }
        catch (ex) {
            console.warn(ex.message);
            if (options.verbose > 1) console.warn(ex.stack);
            if (options.context) {
                let path = options.context.pop();
                console.warn(path);
            }
            if (options.warnings) {
                for (let warning of options.warnings) {
                    if (argv.bae) {
                        const display = bae(options.schema,options.openapi,[warning]);
                        console.warn(display);
                    }
                    else {
                        console.warn(warning.message,warning.pointer,warning.ruleName);
                        if (warning.rule.url) ruleUrls.add(warning.rule.url+'#'+warning.ruleName);
                    }
                }
            }
            reject(ex);
        }
        if (ruleUrls.size > 0) {
            console.warn('For more information, visit:');
            for (let url of ruleUrls) {
                console.warn(url);
            }
        }
        if (argv.dumpMeta) {
            console.warn('\n#Definition metadata:');
            console.warn(yaml.stringify(options.metadata,{depth:Math.INFINITY}));
        }
        if (result || argv.force) {
            if (options.output) {
                if (options.sourceYaml) {
                    fs.writeFileSync(options.output, yaml.stringify(options.openapi),options.encoding);
                }
                else {
                    fs.writeFileSync(options.output, JSON.stringify(options.openapi,null,2),options.encoding);
                }
            }
            else {
                if (options.sourceYaml) {
                    console.log(yaml.stringify(options.openapi));
                }
                else {
                    console.log(JSON.stringify(options.openapi,null,2));
                }
            }
        }
        resolve(options.openapi);
    });
}

main()
.then(function(options){
    process.exitCode = 0;
})
.catch(function(err){
    console.warn(err.message);
});

