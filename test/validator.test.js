'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');

const validator = require('../packages/oas-validator');

const tests = fs.readdirSync(path.join(__dirname,'validator')).filter(file => {
    return fs.statSync(path.join(__dirname, 'validator', file)).isDirectory() && file !== 'include';
});

describe('Validator tests', () => {
tests.forEach((test) => {
    describe(test, () => {
        it('should validate correctly', (done) => {
            const inputSpec = path.join(__dirname, 'validator', test, 'openapi.yaml');
            const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});

            let options = { resolve: true, preserveMiro: false, source: inputSpec };
            try {
                options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'validator', test, 'options.yaml'),'utf8'),{schema:'core'}));
            }
            catch (ex) {}

            validator.validate(input, options)
            .then(function(options){
                assert(options.valid === !options.expectFailure,'options.valid should be true');
                return done();
            })
            .catch(function(err){
                return done(options.expectFailure ? undefined : err);
            });
        });
    });
});
});
