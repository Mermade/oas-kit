'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const http2 = require('http2');
const mime = require('mime-types');
const yaml = require('yaml');

const resolver = require('../packages/oas-resolver');

const tests = fs.readdirSync(path.join(__dirname,'http2')).filter(file => {
    return fs.statSync(path.join(__dirname, 'http2', file)).isDirectory() && file !== 'include';
});

const {
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_METHOD,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname,'localhost.key')),
  cert: fs.readFileSync(path.join(__dirname,'localhost.cert'))
};
const server = http2.createSecureServer(serverOptions);
const serverRoot = path.join(__dirname,'http2');

function respondToStreamError(err, stream) {
    console.warn(err);
    if (err.code === 'ENOENT') {
        stream.respond({ ":status": HTTP_STATUS_NOT_FOUND });
    } else {
        stream.respond({ ":status": HTTP_STATUS_INTERNAL_SERVER_ERROR });
    }
    stream.end();
}

server.on('stream', (stream, headers) => {
    const reqPath = headers[HTTP2_HEADER_PATH];
    const reqMethod = headers[HTTP2_HEADER_METHOD];

    const fullPath = path.join(serverRoot, reqPath);
    const responseMimeType = mime.lookup(fullPath);

    stream.respondWithFile(fullPath, {
        'content-type': responseMimeType
    }, {
        onError: (err) => respondToStreamError(err, stream)
    });
});

describe('HTTP2 tests', () => {

  before(function () {
    server.listen(8321);
  });

  after(function () {
    server.close();
  });

tests.forEach((test) => {
    describe(test, () => {
        it('should match expected output', (done) => {
            const inputSpec = path.join(__dirname, 'http2', test, 'input.yaml');
            const input = yaml.parse(fs.readFileSync(inputSpec,'utf8'),{schema:'core'});
            const output = yaml.parse(fs.readFileSync(path.join(__dirname, 'http2', test, 'output.yaml'),'utf8'),{schema:'core'});

            let options = { resolve: true, preserveMiro: false, source: inputSpec };
            try {
                options = Object.assign({},options,yaml.parse(fs.readFileSync(path.join(__dirname, 'http2', test, 'options.yaml'),'utf8'),{schema:'core'}));
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
