#!/usr/bin/env node

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

const applicator = require('./index.js');

const argv = require('tiny-opts-parser')(process.argv);
if (argv.v) argv.verbose = argv.v;

if (argv._.length>=3) {
    const overlay = yaml.safeLoad(fs.readFileSync(argv._[2],'utf8'),{json:true});
    const openapiStr = fs.readFileSync(argv._[3],'utf8');
    const json = (openapiStr.startsWith('{'));
    const openapi = yaml.safeLoad(openapiStr,{json:true});
    if (overlay.overlay) {
        if (overlay.overlay.description) {
            console.warn('Applying',overlay.overlay.description);
        }
        const result = applicator.apply(overlay,openapi,argv);
        if (json)
            console.log(JSON.stringify(result,null,2))
        else
            console.log(yaml.safeDump(result));
    }
    else {
        console.warn(argv._[2],'does not seem to be a valid overlay document');
    }
}
else {
    console.log('Usage: apply {overlayfile} {openapifile} [-v|--verbose]');
}

