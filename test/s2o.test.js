'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');

const swagger2openapi = require('../packages/swagger2openapi/index.js');

const doPrivate = (!process.env.SKIP_PRIVATE);

const tests = fs.readdirSync(path.join(__dirname,'s2o-test')).filter(file => {
    return fs.statSync(path.join(__dirname, 's2o-test', file)).isDirectory() && file !== 'include' && (!file.startsWith('_') || doPrivate);
});

describe('Converter tests', () => {
tests.forEach((test) => {
    describe(test, () => {
        it('should match expected output', (done) => {
            const swagger = yaml.parse(fs.readFileSync(path.join(__dirname, 's2o-test', test, 'swagger.yaml'),'utf8'),{schema:'core'});
            const openapi = yaml.parse(fs.readFileSync(path.join(__dirname, 's2o-test', test, 'openapi.yaml'),'utf8'),{schema:'core'});

            let options = {};
            try {
                options = yaml.parse(fs.readFileSync(path.join(__dirname, 's2o-test', test, 'options.yaml'),'utf8'),{schema:'core'});
                options.source = path.join(__dirname, 's2o-test', test, 'swagger.yaml');
            }
            catch (ex) {}

            swagger2openapi.convertObj(swagger, options, (err, result) => {
                if (err && !options.throws) return done(err);
                if (!err && options.throws) return done(new Error('Test should have thrown an exception'));

                if (!options.throws) assert.deepStrictEqual(result.openapi, openapi);

                return done();
            });
        });
    });
});
});
