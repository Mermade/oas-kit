#!/usr/bin/env node

// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const readfiles = require('node-readfiles');
const should = require('should/as-function');
const yaml = require('js-yaml');

const validator = require('oas-validator');
const common = require('oas-kit-common');
const clone = require('reftools/lib/clone.js').clone;

const swagger2openapi = require('./index.js');

let globalExpectFailure = false;

const baseName = path.basename(process.argv[1]);

const yargs = require('yargs');
let argv = yargs
    .usage(baseName+' [options] {path-to-specs}...')
    .string('encoding')
    .alias('e', 'encoding')
    .default('encoding', 'utf8')
    .describe('encoding', 'encoding for input/output files')
    .string('fail')
    .describe('fail', 'path to specs expected to fail')
    .alias('f', 'fail')
    .string('jsonschema')
    .alias('j', 'jsonschema')
    .describe('jsonschema', 'path to alternative JSON schema')
    .boolean('laxurls')
    .alias('l', 'laxurls')
    .describe('laxurls', 'lax checking of empty urls')
    .boolean('mediatype')
    .alias('m','mediatype')
    .describe('mediatype','check media-types against RFC pattern')
    .boolean('lint')
    .describe('lint','lint the definition')
    .boolean('nopatch')
    .alias('n', 'nopatch')
    .describe('nopatch', 'do not patch minor errors in the source definition')
    .string('output')
    .alias('o', 'output')
    .describe('output', 'output conversion result')
    .boolean('prettify')
    .alias('p','prettify')
    .describe('prettify','pretty schema validation errors')
    .boolean('quiet')
    .alias('q', 'quiet')
    .describe('quiet', 'do not show test passes on console, for CI')
    .boolean('resolve')
    .alias('r', 'resolve')
    .describe('resolve', 'resolve external references')
    .boolean('stop')
    .alias('s', 'stop')
    .describe('stop', 'stop on first error')
    .string('validateSchema')
    .describe('validateSchema','Run schema validation step: first, last* or never')
    .count('verbose')
    .alias('v', 'verbose')
    .describe('verbose', 'increase verbosity')
    .boolean('warnOnly')
    .describe('warnOnly','Do not throw on non-patchable errors')
    .boolean('whatwg')
    .alias('w', 'whatwg')
    .describe('whatwg', 'enable WHATWG URL parsing')
    .boolean('yaml')
    .alias('y', 'yaml')
    .describe('yaml', 'skip YAML-safe test')
    .help('h')
    .alias('h', 'help')
    .strict()
    .demand(1)
    .version()
    .argv;

let pass = 0;
let fail = 0;
let failures = [];
let warnings = [];

let genStack = [];

let options = argv;
options.patch = !argv.nopatch;
options.fatal = true;

function finalise(err, options) {
    if (!argv.quiet || err) {
        console.log(common.colour.normal + options.file);
    }
    if (err) {
        console.log(common.colour.red + options.context.pop() + '\n' + err.message);
        if (err.name.indexOf('ERR_INVALID_URL')>=0) {
            // nop
        }
        else if (err.message.indexOf('schema validation')>=0) {
            if (options.validateSchema !== 'first') {
                warnings.push('Schema fallback '+options.file);
            }
        }
        else if (err.stack && err.name !== 'AssertionError' && err.name !== 'CLIError') {
            console.log(err.stack);
            warnings.push(err.name+' '+options.file);
        }
        if (options.lintRule && options.lintRule.description !== err.message) {
            console.warn(options.lintRule.description);
        }
        options.valid = !!options.expectFailure;
    }
    if (options.warnings) {
        for (let warning of options.warnings) {
            warnings.push(options.file + ' ' + warning);
        }
    }

    let src = options.original;
    let result = options.valid;

    if (!argv.quiet) {
        let colour = ((options.expectFailure ? !result : result) ? common.colour.green : common.colour.red);
        if (src && src.info) {
            console.log(colour + '  %s %s', src.info.title, src.info.version);
            if (src["x-testcase"]) console.log(' ',src["x-testcase"]);
            console.log('  %s', src.swagger ? (src.host ? src.host : 'relative') : (src.servers && src.servers.length ? src.servers[0].url : 'relative'),common.colour.normal);
        }
    }
    if (result) {
        pass++;
        if ((options.file.indexOf('swagger.yaml') >= 0) && argv.output) {
            let outFile = options.file.replace('swagger.yaml', argv.output);
            let resultStr = yaml.safeDump(options.openapi, {lineWidth: -1});
            fs.writeFileSync(outFile, resultStr, argv.encoding);
        }
    }
    else {
        fail++;
        if (options.file != 'unknown') failures.push(options.file);
        if (argv.stop) process.exit(1);
    }
    genStackNext();
}

function handleResult(err, options) {
    let result = false;
    if (err) {
        options = err.options || { file: 'unknown', src: { info: { version: '', title: '' } } }; // src is just enough to provide dummy outputs
        options.context = [];
        options.warnings = [];
        options.expectFailure = globalExpectFailure;
        finalise(err,options);
    }
    else {
        result = options.openapi;
    }
    let resultStr = JSON.stringify(result);

    if (typeof result !== 'boolean') try {
        if (!options.yaml) {
            resultStr = yaml.safeDump(result, { lineWidth: -1 }); // should be representable safely in yaml
            let resultStr2 = yaml.safeDump(result, { lineWidth: -1, noRefs: true });
            should(resultStr).not.be.exactly('{}','Result should not be empty');
            should(resultStr).equal(resultStr2,'Result should have no object identity ref_s');
        }

        validator.validate(result, options, finalise);
    }
    catch (ex) {
        console.log(common.colour.normal + options.file);
        console.log(common.colour.red + options.context.pop() + '\n' + ex.message);
        if (ex.stack && ex.name !== 'AssertionError' && ex.name !== 'CLIError') {
            console.log(ex.stack);
        }
        options.valid = !options.expectFailure;
        finalise(ex, options);
    }
}

function genStackNext() {
    if (!genStack.length) return false;
    let gen = genStack.shift();
    gen.next();
    return true;
}

function* check(file, force, expectFailure) {
    let result = false;
    options.context = [];
    options.expectFailure = expectFailure;
    options.file = file;
    let components = file.split(path.sep);
    let name = components[components.length - 1];
    let src;

    if ((name.indexOf('.yaml') >= 0) || (name.indexOf('.yml') >= 0) || (name.indexOf('.json') >= 0) || force) {

        if (!file.startsWith('http')) {
            let srcStr = fs.readFileSync(path.resolve(file), options.encoding);
            try {
                src = JSON.parse(srcStr);
            }
            catch (ex) {
                try {
                    src = yaml.safeLoad(srcStr, { schema: yaml.JSON_SCHEMA, json: true });
                }
                catch (ex) {
                    let warning = 'Could not parse file ' + file + '\n' + ex.message;
                    console.log(common.colour.red + warning);
                    if (ex.stack && ex.message.indexOf('stack')>=0) {
                        console.warn(ex.stack);
                    }
                    warnings.push(warning);
                }
            }

            if (!src || ((!src.swagger && !src.openapi))) {
                genStackNext();
                return true;
            }
        }

        options.original = src;
        options.source = file;

        if ((options.source.indexOf('!')>=0) && (options.source.indexOf('swagger.')>=0)) {
            expectFailure = true;
        }

        if (file.startsWith('http')) {
            swagger2openapi.convertUrl(file, clone(options))
            .then(function(options){
                handleResult(null,options);
            })
            .catch(function(ex){
                console.warn(common.colour.red+ex,common.colour.normal);
                if (expectFailure) {
                    warnings.push('Converter failed ' + options.source);
                }
                else {
                    failures.push('Converter failed ' + options.source);
                    fail++;
                }
                genStackNext();
                result = false;
            });
        }
        else {
            swagger2openapi.convertObj(src, clone(options))
            .then(function(options){
                handleResult(null,options);
            })
            .catch(function(ex){
                console.warn(common.colour.red+ex,common.colour.normal);
                if (expectFailure) {
                    warnings.push('Converter failed ' + options.source);
                }
                else {
                    failures.push('Converter failed ' + options.source);
                    fail++;
                }
                genStackNext();
                result = false;
            });
        }
    }
    else {
        genStackNext();
        result = true;
    }
    return result;
}

function processPathSpec(pathspec, expectFailure) {
    globalExpectFailure = expectFailure;
    if (pathspec.startsWith('@')) {
        pathspec = pathspec.substr(1, pathspec.length - 1);
        let list = fs.readFileSync(pathspec, 'utf8').split('\r').join('').split('\n');
        for (let file of list) {
            genStack.push(check(file, false, expectFailure));
        }
        genStackNext();
    }
    else if (pathspec.startsWith('http')) {
        genStack.push(check(pathspec, true, expectFailure));
        genStackNext();
    }
    else if (fs.statSync(path.resolve(pathspec)).isFile()) {
        genStack.push(check(pathspec, true, expectFailure));
        genStackNext();
    }
    else {
        readfiles(pathspec, { readContents: false, filenameFormat: readfiles.FULL_PATH }, function (err) {
            if (err) console.log(util.inspect(err));
        })
        .then(files => {
            files = files.sort();
            for (let file of files) {
                genStack.push(check(file, false, expectFailure));
            }
            genStackNext();
        })
        .catch(err => {
            console.log(util.inspect(err));
        });
    }
}

process.exitCode = 1;
console.log('Gathering...');
for (let pathspec of argv._) {
    processPathSpec(pathspec, false);
}
if (argv.fail) {
    if (!Array.isArray(argv.fail)) argv.fail = [argv.fail];
    for (let pathspec of argv.fail) {
        processPathSpec(pathspec, true);
    }
}

process.on('unhandledRejection', r => console.warn(r));

process.on('exit', function () {
    if (warnings.length) {
        warnings.sort();
        console.log(common.colour.normal + '\nWarnings:' + common.colour.yellow);
        for (let w in warnings) {
            console.log(warnings[w]);
        }
    }
    if (failures.length) {
        failures.sort();
        console.log(common.colour.normal + '\nFailures:' + common.colour.red);
        for (let f in failures) {
            console.log(failures[f]);
        }
    }
    console.log(common.colour.normal);
    console.log('Tests: %s passing, %s failing, %s warnings', pass, fail, warnings.length);
    process.exitCode = ((fail === 0) && (pass > 0)) ? 0 : 1;
});
