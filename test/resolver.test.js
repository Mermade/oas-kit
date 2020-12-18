'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');
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
