'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');
const jsonSchemaToOpenApiSchema = require('json-schema-to-openapi-schema');
const sinon = require('sinon');
const crypto = require('crypto');

const resolver = require('../packages/oas-resolver');

const tests = fs.readdirSync(path.join(__dirname,'resolver')).filter(file => {
    return fs.statSync(path.join(__dirname, 'resolver', file)).isDirectory() && file !== 'include';
});

sinon.stub(crypto, 'createHash').callsFake(() => {
    return {
        update: sinon.stub().callsFake(() => {
            return {
                digest: sinon.stub().returns('123')
            };
        })
    };
});

describe('Resolver tests', () => {
tests.forEach((test) => {
    describe(test, () => {
        it('should match expected output', (done) => {
            const inputSpec = path.join(__dirname, 'resolver', test, 'input.yaml');
            const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});
            const output = yaml.parse(fs.readFileSync(path.join(__dirname, 'resolver', test, 'output.yaml'),'utf8'),{schema:'core'});

            let options = { resolve: true, preserveMiro: false, source: inputSpec };
            try {
                options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'resolver', test, 'options.yaml'),'utf8'),{schema:'core'}));
                if (test.includes('resolveSharedRefs')) {
                    options.filters = [jsonSchemaToOpenApiSchema];
                }
            }
            catch (ex) {}

            resolver.resolve(input, options.source, options)
            .then(function(result){
                assert.deepStrictEqual(result.openapi, output);
                return done();
            })
            .catch(function(err){
                return done(err);
            });
        });
    });
});
});

// const resolveSharedRefsTests = fs.readdirSync(path.join(__dirname,'resolveSharedRefs')).filter(file => {
//     return fs.statSync(path.join(__dirname, 'resolveSharedRefs', file)).isDirectory() && file !== 'include';
// });




// describe('Resolver tests, resolveSharedRefs option true', () => {
// resolveSharedRefsTests.forEach((test) => {
//     describe(test, () => {
//         it('should match expected output, resolveSharedRefs option true', (done) => {
//             const inputSpec = path.join(__dirname, 'resolveSharedRefs', test, 'input.yaml');
//             const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});
//             const output = yaml.parse(fs.readFileSync(path.join(__dirname, 'resolveSharedRefs', test, 'output.yaml'),'utf8'),{schema:'core'});

//             let options = { resolve: true, preserveMiro: false, source: inputSpec, filters: [jsonSchemaToOpenApiSchema], resolveSharedRefs: true };
//             try {
//                 options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'resolveSharedRefs', test, 'options.yaml'),'utf8'),{schema:'core'}));
//             }
//             catch (ex) {}

//             resolver.resolve(input, options.source, options)
//             .then(function(result){
//                 assert.deepStrictEqual(result.openapi, output);
//                 return done();
//             })
//             .catch(function(err){
//                 return done(err);
//             });
//         });
//     });
// });
// });
