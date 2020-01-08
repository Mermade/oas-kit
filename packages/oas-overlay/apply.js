#!/usr/bin/env node

'use strict';

const fs = require('fs');
const yaml = require('yaml');

const applicator = require('./index.js');

const argv = require('tiny-opts-parser')(process.argv);
if (argv.v) argv.verbose = argv.v;

if (argv._.length>=3) {
    const ovfile = yaml.parse(fs.readFileSync(argv._[2],'utf8'));
    const openapiStr = fs.readFileSync(argv._[3],'utf8');
    const json = (openapiStr.startsWith('{'));
    const openapi = yaml.parse(openapiStr);
    if (ovfile.overlay) {
        if (ovfile.info && ovfile.info.title) {
            console.warn('Applying',ovfile.info.title);
        }
        const result = applicator.apply(ovfile,openapi,argv);
        if (json)
            console.log(JSON.stringify(result,null,2));
        else
            console.log(yaml.stringify(result));
    }
    else {
        console.warn(argv._[2],'does not seem to be a valid overlay document');
    }
}
else {
    console.log('Usage: apply {overlayfile} {openapifile} [-v|--verbose]');
}

