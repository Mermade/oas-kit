'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const yaml = require('yaml');

const applicator = require('../packages/oas-overlay');

const tests = fs.readdirSync(path.join(__dirname,'overlays')).filter(file => {
    return fs.statSync(path.join(__dirname, 'overlays', file)).isDirectory() && file !== 'include';
});

describe('Overlay tests', () => {
tests.forEach((test) => {
    describe(test, () => {
        it('should match expected output', (done) => {
            const inputSpec = path.join(__dirname, 'overlays', test, 'input.yaml');
            const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});
            const overlayFile = path.join(__dirname, 'overlays', test, 'overlay.yaml');
            const overlay = yaml.parse(fs.readFileSync(overlayFile,'utf8'),{schema:'core'});
            const output = yaml.parse(fs.readFileSync(path.join(__dirname, 'overlays', test, 'output.yaml'),'utf8'),{schema:'core'});

            let options = { verbose: false };
            try {
                options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'overlays', test, 'options.yaml'),'utf8'),{schema:'core'}));
            }
            catch (ex) {}

            const result = applicator.apply(overlay, input, options);
            assert.deepStrictEqual(result, output);
            done();
        });
    });
});
});
