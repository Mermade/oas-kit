'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');
const jsonSchemaToOpenApiSchema = require('json-schema-to-openapi-schema');

const resolver = require('../packages/oas-resolver');

const tests = fs.readdirSync(path.join(__dirname,'resolver2')).filter(file => {
    return fs.statSync(path.join(__dirname, 'resolver2', file)).isDirectory() && file !== 'include';
});

jest.mock('crypto', () => {
    return {
        createHash: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        digest: jest.fn(() => '123')
    }
})

describe('Resolver tests', () => {
tests.forEach((test) => {
    describe(test, () => {
        it('should match expected output', (done) => {
            const inputSpec = path.join(__dirname, 'resolver2', test, 'input.yaml');
            const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});
            const output = yaml.parse(fs.readFileSync(path.join(__dirname, 'resolver2', test, 'output.yaml'),'utf8'),{schema:'core'});

            let options = { resolve: true, preserveMiro: false, source: inputSpec, filters: [jsonSchemaToOpenApiSchema], resolveSharedRefs: true };
            try {
                options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'resolver2', test, 'options.yaml'),'utf8'),{schema:'core'}));
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
