'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const validator = require('../validate.js');

const testsPath = path.join(__dirname, './validate/');
const tests = fs.readdirSync(testsPath).filter(file => {
    return fs.statSync(path.join(testsPath, file)).isDirectory();
});

tests.forEach(test => {
    describe(test, () => {
        it('should validate ok', done => {
            const openapi = yaml.safeLoad(fs.readFileSync(path.join(testsPath, test, 'openapi.yaml'),'utf8'),{json:true});

            validator.validate(openapi, {}, err => {
                if (err) return done(err);
                return done();
            });
        });
    });
});
