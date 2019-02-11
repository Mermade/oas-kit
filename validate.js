// @ts-check
'use strict';

var fs = require('fs');
var url = require('url');
var URL = url.URL;
var util = require('util');

var yaml = require('js-yaml');
var should = require('should/as-function');
var co = require('co');
var ajv = require('ajv')({
    allErrors: true,
    verbose: true,
    jsonPointers: true,
    patternGroups: true,
    extendRefs: true // optional, current default is to 'fail', spec behaviour is to 'ignore'
});
//meta: false, // optional, to prevent adding draft-06 meta-schema

var ajvFormats = require('ajv/lib/compile/formats.js');
ajv.addFormat('uriref', ajvFormats.full['uri-reference']);
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv._refs['http://json-schema.org/schema'] = 'http://json-schema.org/draft-04/schema'; // optional, using unversioned URI is out of spec
var metaSchema = require('ajv/lib/refs/json-schema-v5.json');
ajv.addMetaSchema(metaSchema);
ajv._opts.defaultMeta = metaSchema.id;

var jptr = require('jgexml/jpath.js');
var common = require('./common.js');

var jsonSchema = require('./schemas/json_v5.json');
var validateMetaSchema = ajv.compile(jsonSchema);
var openapi3Schema = require('./schemas/openapi-3.0.json');
var validateOpenAPI3 = ajv.compile(openapi3Schema);

function contextAppend(options, s) {
    options.context.push((options.context[options.context.length - 1] + '/' + s).split('//').join('/'));
}

function validateUrl(s, contextServers, context, options) {
    if (!options.laxurls) should(s).not.be.exactly('', 'Invalid empty URL ' + context);
    var base = options.origin || 'http://localhost/';
    if (contextServers && contextServers.length) {
        let servers = contextServers[0];
        if (servers.length) {
            base = servers[0].url;
        }
    }
    if (s.indexOf('://') > 0) { // FIXME HACK
        base = undefined;
    }
    var u = (URL && options.whatwg) ? new URL(s, base) : url.parse(s);
    return true; // if we haven't thrown
}

function validateComponentName(name) {
    return /^[a-zA-Z0-9\.\-_]+$/.test(name);
}

function validateHeaderName(name) {
    return /^[A-Za-z0-9!#\-\$%&'\*\+\\\.\^_`\|~]+$/.test(name);
}

function validateSchema(schema, openapi, options) {
    validateMetaSchema(schema);
    var errors = validateSchema.errors;
    if (errors && errors.length) {
        throw (new Error('Schema invalid: ' + util.inspect(errors)));
    }
    if (schema.externalDocs) {
        should(schema.externalDocs).have.key('url');
        should(schema.externalDocs.url).have.type('string');
        should(validateUrl(schema.externalDocs.url, [openapi.servers], 'externalDocs', options)).not.throw();
    }
    return !(errors && errors.length);
}

function checkExample(ex, contextServers, openapi, options) {
    should(ex).be.an.Object();
    should(ex).not.be.an.Array();
    if (typeof ex.summary !== 'undefined') {
        should(ex.summary).have.type('string');
    }
    if (typeof ex.description !== 'undefined') {
        should(ex.description).have.type('string');
    }
    if (typeof ex.value !== 'undefined') {
        should(ex).not.have.property('externalValue');
    }
    //else { // not mandated by the spec.
    //    should(ex).have.property('externalValue');
    //}
    if (typeof ex.externalValue !== 'undefined') {
        should(ex.externalValue).have.type('string');
        should(ex).not.have.property('value');
        should((function () { validateUrl(ex.externalValue, contextServers, 'examples..externalValue', options) })).not.throw();
    }
    //else { // not mandated by the spec.
    //    should(ex).have.property('value');
    //}
    for (let k in ex) {
        if (!k.startsWith('x-')) {
            should(['summary','description','value','externalValue'].indexOf(k)).be.greaterThan(-1,'Example object cannot have additionalProperty: '+k);
        }
    }
}

function checkContent(content, contextServers, openapi, options) {
    contextAppend(options, 'content');
    for (let ct in content) {
        contextAppend(options, jptr.jpescape(ct));
        var contentType = content[ct];
        should(contentType).be.an.Object();
        should(contentType).not.be.an.Array();
        if (typeof contentType.schema !== 'undefined') {
            should(contentType.schema).be.an.Object();
            should(contentType.schema).not.be.an.Array();
        }
        if (contentType.example) {
            should(contentType).not.have.property('examples');
        }
        if (contentType.examples) {
            contextAppend(options, 'examples');
            should(contentType).not.have.property('example');
            should(contentType.examples).be.an.Object();
            should(contentType.examples).not.be.an.Array();
            for (let e in contentType.examples) {
                let ex = contentType.examples[e];
                if (!ex.$ref) {
                    checkExample(ex, contextServers, openapi, options);
                }
            }
            options.context.pop();
        }
        if (contentType.schema) validateSchema(contentType.schema, openapi, options);
        options.context.pop();
    }
    options.context.pop();
}

function checkServer(server, options) {
    should(server).have.property('url');
    should((function () { validateUrl(server.url, [], 'server.url', options) })).not.throw();
    let srvVars = 0;
    server.url.replace(/\{(.+?)\}/g, function (match, group1) {
        srvVars++;
        should(server).have.key('variables');
        should(server.variables).have.key(group1);
    });
    if (server.variables) {
        contextAppend(options, 'variables');
        for (let v in server.variables) {
            contextAppend(options, v);
            should(server.variables[v]).have.key('default');
            should(server.variables[v].default).be.type('string');
            if (typeof server.variables[v].enum !== 'undefined') {
                contextAppend(options, 'enum');
                should(server.variables[v].enum).be.an.Array();
                should(server.variables[v].enum.length).not.be.exactly(0, 'Server variables enum should not be empty');
                for (let e in server.variables[v].enum) {
                    contextAppend(options, e);
                    should(server.variables[v].enum[e]).be.type('string');
                    options.context.pop();
                }
                options.context.pop();
            }
            options.context.pop();
        }
        should(Object.keys(server.variables).length).be.exactly(srvVars);
        options.context.pop();
    }
}

function checkServers(servers, options) {
    should(servers).be.an.Array();
    for (let s in servers) {
        contextAppend(options, s);
        let server = servers[s];
        checkServer(server, options);
        options.context.pop();
    }
}

function checkLink(link, openapi, options) {
    if (typeof link.$ref !== 'undefined') {
        let ref = link.$ref;
        should(link.$ref).be.type('string');
        if (options.lint) options.linter('reference',link,'$ref',options);
        link = jptr.jptr(openapi, ref);
        should(link).not.be.exactly(false, 'Cannot resolve reference: ' + ref);
    }
    should(link).be.type('object');
    if (typeof link.operationRef !== 'undefined') {
        should(link.operationRef).be.type('string');
        should(link).not.have.property('operationId');
    }
    else {
        should(link).have.property('operationId');
    }
    if (typeof link.operationId !== 'undefined') {
        should(link.operationId).be.type('string');
        should(link).not.have.property('operationRef');
        // validate operationId exists (external refs?)
    }
    else {
        should(link).have.property('operationdRef');
    }
    if (typeof link.parameters != 'undefined') {
        should(link.parameters).be.type('object');
        should(link.parameters).not.be.an.Array();
    }
    if (typeof link.description !== 'undefined') {
        should(link.description).have.type('string');
    }
    if (typeof link.server !== 'undefined') {
        checkServer(link.server, options);
    }
}

function checkHeader(header, contextServers, openapi, options) {
    if (header.$ref) {
        var ref = header.$ref;
        should(header.$ref).be.type('string');
        header = common.resolveInternal(openapi, ref);
        should(header).not.be.exactly(false, 'Could not resolve reference ' + ref);
    }
    should(header).not.have.property('name');
    should(header).not.have.property('in');
    should(header).not.have.property('type');
    for (let prop of common.parameterTypeProperties) {
        should(header).not.have.property(prop);
    }
    if (header.schema) {
        should(header).not.have.property('content');
        if (typeof header.style !== 'undefined') {
            should(header.style).be.type('string');
            should(header.style).be.exactly('simple');
        }
        if (typeof header.explode !== 'undefined') {
            should(header.explode).be.type('boolean');
        }
        if (typeof header.allowReserved !== 'undefined') {
            should(header.allowReserved).be.type('boolean');
        }
        validateSchema(header.schema, openapi, options);
    }
    if (header.content) {
        should(header).not.have.property('schema');
        should(header).not.have.property('style');
        should(header).not.have.property('explode');
        should(header).not.have.property('allowReserved');
        should(header).not.have.property('example');
        should(header).not.have.property('examples');
        checkContent(header.content, contextServers, openapi, options);
    }
    if (!header.schema && !header.content) {
        should(header).have.property('schema', 'Header should have schema or content');
    }
}

function checkResponse(response, contextServers, openapi, options) {
    if (response.$ref) {
        var ref = response.$ref;
        should(response.$ref).be.type('string');
        response = common.resolveInternal(openapi, ref);
        should(response).not.be.exactly(false, 'Could not resolve reference ' + ref);
    }
    should(response).have.property('description');
    should(response.description).have.type('string', 'response description should be of type string');
    should(response).not.have.property('examples');
    if (typeof response.schema !== 'undefined') {
        should(response.schema).be.an.Object();
        should(response.schema).not.be.an.Array();
    }
    if (response.headers) {
        contextAppend(options, 'headers');
        for (let h in response.headers) {
            contextAppend(options, h);
            should(validateHeaderName(h)).be.equal(true, 'Header doesn\'t match RFC7230 pattern');
            checkHeader(response.headers[h], contextServers, openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }

    if (response.content) {
        checkContent(response.content, contextServers, openapi, options);
    }

    if (typeof response.links !== 'undefined') {
        contextAppend(options, 'links');
        for (let l in response.links) {
            contextAppend(options, l);
            checkLink(response.links[l], openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }
}

function checkParam(param, index, contextServers, openapi, options) {
    contextAppend(options, index);
    if (param.$ref) {
        should(param.$ref).be.type('string');
        var ref = param.$ref;
        param = common.resolveInternal(openapi, ref);
        should(param).not.be.exactly(false, 'Could not resolve reference ' + ref);
    }
    should(param).have.property('name');
    should(param.name).have.type('string');
    should(param).have.property('in');
    should(param.in).have.type('string');
    should(param.in).equalOneOf('query', 'header', 'path', 'cookie');
    if (param.in == 'path') {
        should(param).have.property('required');
        should(param.required).be.exactly(true, 'Path parameters must have an explicit required:true');
        // TODO path parameters MUST appear in the path template
    }
    if (typeof param.required !== 'undefined') should(param.required).have.type('boolean');
    should(param).not.have.property('items');
    should(param).not.have.property('collectionFormat');
    should(param).not.have.property('type');
    for (let prop of common.parameterTypeProperties) {
        should(param).not.have.property(prop);
    }
    should(param.in).not.be.exactly('body', 'Parameter type body is no-longer valid');
    should(param.in).not.be.exactly('formData', 'Parameter type formData is no-longer valid');
    if (param.description) {
        should(param.description).have.type('string');
    }
    if (param.schema) {
        should(param).not.have.property('content');
        if (typeof param.style !== 'undefined') {
            should(param.style).be.type('string');
            if (param.in == 'path') {
                should(param.style).not.be.exactly('form');
                should(param.style).not.be.exactly('spaceDelimited');
                should(param.style).not.be.exactly('pipeDelimited');
                should(param.style).not.be.exactly('deepObject');
            }
            if (param.in == 'query') {
                should(param.style).not.be.exactly('matrix');
                should(param.style).not.be.exactly('label');
                should(param.style).not.be.exactly('simple');
            }
            if (param.in == 'header') {
                should(param.style).be.exactly('simple');
            }
            if (param.in == 'cookie') {
                should(param.style).be.exactly('form');
            }
        }
        if (typeof param.explode !== 'undefined') {
            should(param.explode).be.type('boolean');
        }
        if (typeof param.allowReserved !== 'undefined') {
            should(param.allowReserved).be.type('boolean');
        }
        validateSchema(param.schema, openapi, options);
    }
    if (param.content) {
        should(param).not.have.property('schema');
        should(param).not.have.property('style');
        should(param).not.have.property('explode');
        should(param).not.have.property('allowReserved');
        should(param).not.have.property('example');
        should(param).not.have.property('examples');
        should(Object.keys(param.content).length).be.exactly(1, 'Parameter content must have only one entry');
        checkContent(param.content, contextServers, openapi, options);
    }
    if (!param.schema && !param.content) {
        should(param).have.property('schema', 'Parameter should have schema or content');
    }
    options.context.pop();
    return true;
}

function checkPathItem(pathItem, openapi, options) {

    var contextServers = [];
    contextServers.push(openapi.servers);
    if (pathItem.servers) contextServers.push(pathItem.servers);

    for (let o in pathItem) {
        contextAppend(options, o);
        var op = pathItem[o];
        if (o === '$ref') {
            should(op).be.ok();
            should(op).have.type('string');
            should(op.startsWith('#/')).equal(false,'PathItem $refs must be external ('+op+')');
        }
        else if (o === 'parameters') {
            for (let p in pathItem.parameters) {
                checkParam(pathItem.parameters[p], p, contextServers, openapi, options);
            }
        }
        else if (o === 'servers') {
            contextAppend(options, 'servers');
            checkServers(op, options); // won't be here in converted definitions
            options.context.pop();
        }
        else if (o === 'summary') {
            should(pathItem.summary).have.type('string');
        }
        else if (o === 'description') {
            should(pathItem.description).have.type('string');
        }
        else if (common.httpVerbs.indexOf(o) >= 0) {
            should(op).not.be.empty();
            should(op).not.have.property('consumes');
            should(op).not.have.property('produces');
            should(op).not.have.property('schemes');
            should(op).have.property('responses');
            should(op.responses).not.be.empty();
            if (op.summary) should(op.summary).have.type('string');
            if (op.description) should(op.description).have.type('string');
            if (op.operationId) should(op.operationId).have.type('string');
            // TODO operationIds MUST be unique

            if (op.servers) {
                contextAppend(options, 'servers');
                checkServers(op.servers, options); // won't be here in converted definitions
                options.context.pop();
                contextServers.push(op.servers);
            }

            if (op.requestBody && op.requestBody.content) {
                contextAppend(options, 'requestBody');
                should(op.requestBody).have.property('content');
                if (typeof op.requestBody.description !== 'undefined') should(op.requestBody.description).have.type('string');
                if (typeof op.requestBody.required !== 'undefined') should(op.requestBody.required).have.type('boolean');
                checkContent(op.requestBody.content, contextServers, openapi, options);
                options.context.pop();
            }

            contextAppend(options, 'responses');
            for (let r in op.responses) {
                if (!r.startsWith('x-')) {
                    contextAppend(options, r);
                    var response = op.responses[r];
                    checkResponse(response, contextServers, openapi, options);
                    options.context.pop();
                }
            }
            options.context.pop();

            // TODO parameters must be unique on in: and name: (including
            // non-overridden path-level parameters)

            if (op.parameters) {
                contextAppend(options, 'parameters');
                for (let p in op.parameters) {
                    checkParam(op.parameters[p], p, contextServers, openapi, options);
                }
                options.context.pop();
            }
            if (op.externalDocs) {
                contextAppend(options, 'externalDocs');
                should(op.externalDocs).have.key('url');
                should(op.externalDocs.url).have.type('string');
                should((function () { validateUrl(op.externalDocs.url, contextServers, 'externalDocs', options) })).not.throw();
                options.context.pop();
            }
            if (op.callbacks) {
                contextAppend(options, 'callbacks');
                for (let c in op.callbacks) {
                    let callback = op.callbacks[c];
                    if (!callback.$ref) {
                        contextAppend(options, c);
                        for (let p in callback) {
                            let cbPi = callback[p];
                            checkPathItem(cbPi, openapi, options);
                        }
                        options.context.pop();
                    }
                }
                options.context.pop();
            }
        }
        options.context.pop();
    }
    return true;
}

function validateSync(openapi, options, callback) {
    options.valid = false;
    options.context = [];
    options.warnings = [];

    if (options.jsonschema) {
        let schemaStr = fs.readFileSync(options.jsonschema, 'utf8');
        openapi3Schema = yaml.safeLoad(schemaStr, { json: true });
        validateOpenAPI3 = ajv.compile(openapi3Schema);
    }

    options.context.push('#/');
    should(openapi).not.have.key('swagger');
    should(openapi).have.key('openapi');
    should(openapi.openapi).have.type('string');
    should.ok(openapi.openapi.startsWith('3.0.'), 'Must be an OpenAPI 3.0.x document');
    should(openapi).not.have.key('host');
    should(openapi).not.have.key('basePath');
    should(openapi).not.have.key('schemes');
    should(openapi).have.key('paths');
    should(openapi).not.have.key('definitions');
    should(openapi).not.have.key('parameters');
    should(openapi).not.have.key('responses');
    should(openapi).not.have.key('securityDefinitions');
    should(openapi).not.have.key('produces');
    should(openapi).not.have.key('consumes');

    for (let k in openapi) {
        if (!k.startsWith('x-')) {
            should(['openapi','info','servers','security','externalDocs','tags','paths','components'].indexOf(k)).be.greaterThan(-1,'OpenAPI object cannot have additionalProperty: '+k);
        }
    }

    should(openapi).have.key('info');
    contextAppend(options, 'info');
    should(openapi.info).have.key('title');
    should(openapi.info.title).be.type('string', 'title should be of type string');
    should(openapi.info).have.key('version');
    should(openapi.info.version).be.type('string', 'version should be of type string');
    if (openapi.info.license) {
        contextAppend(options, 'license');
        should(openapi.info.license).have.key('name');
        should(openapi.info.license.name).have.type('string');
        options.context.pop();
    }
    if (typeof openapi.info.termsOfService !== 'undefined') {
        should(openapi.info.termsOfService).not.be.Null();
        should((function () { validateUrl(openapi.info.termsOfService, contextServers, 'termsOfService', options) })).not.throw();
    }
    if (typeof openapi.info.contact !== 'undefined') {
        contextAppend(options, 'contact');
        should(openapi.info.contact).be.type('object');
        should(openapi.info.contact).not.be.an.Array();
        if (typeof openapi.info.contact.url !== 'undefined') {
            should(openapi.info.contact.url).be.type('string');
            should((function () { validateUrl(openapi.info.contact.url, contextServers, 'url', options) })).not.throw();
        }
        if (typeof openapi.info.contact.email !== 'undefined') {
            should(openapi.info.contact.email).have.type('string');
            should(openapi.info.contact.email.indexOf('@')).be.greaterThan(-1,'Contact email must be a valid email address');
        }
        options.context.pop();
    }
    options.context.pop();

    var contextServers = [];
    if (openapi.servers) {
        contextAppend(options, 'servers');
        checkServers(openapi.servers, options);
        options.context.pop();
        contextServers.push(openapi.servers);
    }
    if (openapi.externalDocs) {
        contextAppend(options, 'externalDocs');
        should(openapi.externalDocs).have.key('url');
        should(openapi.externalDocs.url).have.type('string');
        should((function () { validateUrl(openapi.externalDocs.url, contextServers, 'externalDocs', options) })).not.throw();
        options.context.pop();
    }

    if (openapi.tags) {
        contextAppend(options, 'tags');
        let tagsSeen = [];
        for (let tag of openapi.tags) {
            should(tag).have.property('name');
            should(tag.name).have.type('string');
            should(tagsSeen.indexOf(tag.name)).be.exactly(-1,'Tag names must be unique');
            tagsSeen.push(tag.name);
            if (tag.externalDocs) {
                should(tag.externalDocs).have.key('url');
                should(tag.externalDocs.url).have.type('string');
                should((function () { validateUrl(tag.externalDocs.url, contextServers, 'tag.externalDocs', options) })).not.throw();
            }
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.securitySchemes) {
        for (let s in openapi.components.securitySchemes) {
            options.context.push('#/components/securitySchemes/' + s);
            should(validateComponentName(s)).be.equal(true, 'component name invalid');
            var scheme = openapi.components.securitySchemes[s];
            should(scheme).have.property('type');
            should(scheme.type).have.type('string');
            should(scheme.type).not.be.exactly('basic', 'Security scheme basic should be http with scheme basic');
            should(scheme.type).equalOneOf('apiKey', 'http', 'oauth2', 'openIdConnect');
            if (scheme.type == 'http') {
                should(scheme).have.property('scheme');
                should(scheme.scheme).have.type('string');
                if (scheme.scheme != 'bearer') {
                    should(scheme).not.have.property('bearerFormat');
                }
            }
            else {
                should(scheme).not.have.property('scheme');
                should(scheme).not.have.property('bearerFormat');
            }
            if (scheme.type == 'apiKey') {
                should(scheme).have.property('name');
                should(scheme.name).have.type('string');
                should(scheme).have.property('in');
                should(scheme.in).have.type('string');
                should(scheme.in).equalOneOf('query', 'header');
            }
            else {
                should(scheme).not.have.property('name');
                should(scheme).not.have.property('in');
            }
            if (scheme.type == 'oauth2') {
                should(scheme).not.have.property('flow');
                should(scheme).have.property('flows');
                for (let f in scheme.flows) {
                    var flow = scheme.flows[f];
                    if ((f == 'implicit') || (f == 'authorizationCode')) {
                        should(flow).have.property('authorizationUrl');
                        should(flow.authorizationUrl).have.type('string');
                        should((function () { validateUrl(flow.authorizationUrl, contextServers, 'authorizationUrl', options) })).not.throw();
                    }
                    else {
                        should(flow).not.have.property('authorizationUrl');
                    }
                    if ((f == 'password') || (f == 'clientCredentials') ||
                        (f == 'authorizationCode')) {
                        should(flow).have.property('tokenUrl');
                        should(flow.tokenUrl).have.type('string');
                        should((function () { validateUrl(flow.tokenUrl, contextServers, 'tokenUrl', options) })).not.throw();
                    }
                    else {
                        should(flow).not.have.property('tokenUrl');
                    }
                    if (typeof flow.refreshUrl !== 'undefined') {
                        should((function () { validateUrl(flow.refreshUrl, contextServers, 'refreshUrl', options) })).not.throw();
                    }
                    should(flow).have.property('scopes');
                }
            }
            else {
                should(scheme).not.have.property('flows');
            }
            if (scheme.type == 'openIdConnect') {
                should(scheme).have.property('openIdConnectUrl');
                should(scheme.openIdConnectUrl).have.type('string');
                should((function () { validateUrl(scheme.openIdConnectUrl, contextServers, 'openIdConnectUrl', options) })).not.throw();
            }
            else {
                should(scheme).not.have.property('openIdConnectUrl');
            }
            options.context.pop();
        }
    }

    common.recurse(openapi, null, function (obj, key, state) {
        if ((key === '$ref') && (typeof obj[key] === 'string')) {
            options.context.push(state.path);
            should(obj[key]).not.startWith('#/definitions/');
            var refUrl = url.parse(obj[key]);
            if (!refUrl.protocol && !refUrl.path) {
                should(obj[key]+'/$ref').not.be.equal(state.path,'Circular reference');
                should(jptr.jptr(openapi, obj[key])).not.be.exactly(false, 'Cannot resolve reference: ' + obj[key]);
            }
            options.context.pop();
        }
    });

    // TODO Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical.

    for (let p in openapi.paths) {
        options.context.push('#/paths/' + jptr.jpescape(p));
        if (!p.startsWith('x-')) {
            should(p).startWith('/');
            checkPathItem(openapi.paths[p], openapi, options);
        }
        options.context.pop();
    }
    if (openapi["x-ms-paths"]) {
        for (let p in openapi["x-ms-paths"]) {
            options.context.push('#/x-ms-paths/' + jptr.jpescape(p));
            should(p).startWith('/');
            checkPathItem(openapi["x-ms-paths"][p], openapi, options);
            options.context.pop();
        }
    }

    if (openapi.components && openapi.components.parameters) {
        options.context.push('#/components/parameters/');
        for (let p in openapi.components.parameters) {
            checkParam(openapi.components.parameters[p], p, contextServers, openapi, options);
            contextAppend(options, p);
            should(validateComponentName(p)).be.equal(true, 'component name invalid');
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.schemas) {
        options.context.push('#/components/schemas');
        should(openapi.components.schemas).be.type('object');
        should(openapi.components.schemas).not.be.an.Array();
        for (let s in openapi.components.schemas) {
            options.context.push('#/components/schemas/' + s);
            should(validateComponentName(s)).be.equal(true, 'component name invalid');
            validateSchema(openapi.components.schemas[s], openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.responses) {
        options.context.push('#/components/responses');
        should(openapi.components.responses).be.type('object');
        should(openapi.components.responses).not.be.an.Array();
        for (let r in openapi.components.responses) {
            options.context.push('#/components/responses/' + r);
            should(validateComponentName(r)).be.equal(true, 'component name invalid');
            checkResponse(openapi.components.responses[r], contextServers, openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.headers) {
        options.context.push('#/components/headers');
        should(openapi.components.headers).be.type('object');
        should(openapi.components.headers).not.be.an.Array();
        for (let h in openapi.components.headers) {
            options.context.push('#/components/headers/' + h);
            should(validateComponentName(h)).be.equal(true, 'component name invalid');
            checkHeader(openapi.components.headers[h], contextServers, openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.requestBodies) {
        options.context.push('#/components/requestBodies');
        should(openapi.components.requestBodies).be.type('object');
        should(openapi.components.requestBodies).not.be.an.Array();
        for (let r in openapi.components.requestBodies) {
            options.context.push('#/components/requestBodies/' + r);
            should(validateComponentName(r)).be.equal(true, 'component name invalid');
            if (r.startsWith('requestBody')) {
                options.warnings.push('Anonymous requestBody: ' + r);
            }
            let rb = openapi.components.requestBodies[r];
            should(rb).have.property('content');
            if (typeof rb.description !== 'undefined') should(rb.description).have.type('string');
            if (typeof rb.required !== 'undefined') should(rb.required).have.type('boolean');
            checkContent(rb.content, openapi.servers, openapi, options);
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.examples) {
        options.context.push('#/components/examples');
        should(openapi.components.examples).be.type('object');
        should(openapi.components.examples).not.be.an.Array();
        for (let e in openapi.components.examples) {
            options.context.push('#/components/examples/' + e);
            should(validateComponentName(e)).be.equal(true, 'component name invalid');
            let ex = openapi.components.examples[e];
            if (!ex.$ref) {
               checkExample(ex, openapi.servers, openapi, options);
            }
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.callbacks) {
        options.context.push('#/components/callbacks');
        should(openapi.components.callbacks).be.type('object');
        should(openapi.components.callbacks).not.be.an.Array();
        for (let c in openapi.components.callbacks) {
            options.context.push('#/components/callbacks/' + c);
            should(validateComponentName(c)).be.equal(true, 'component name invalid');
            let cb = openapi.components.callbacks[c];
            if (!cb.$ref) {
                for (let u in cb) {
                    let cbPi = cb[u];
                    checkPathItem(cbPi, openapi, options);
                }
            }
            options.context.pop();
        }
        options.context.pop();
    }

    if (openapi.components && openapi.components.links) {
        options.context.push('#/components/links');
        should(openapi.components.links).be.type('object');
        should(openapi.components.links).not.be.an.Array();
        for (let l in openapi.components.links) {
            options.context.push('#/components/links/' + l);
            should(validateComponentName(l)).be.equal(true, 'component name invalid');
            let link = openapi.components.links[l];
            if (!link.$ref) {
                checkLink(link, openapi, options);
            }
            options.context.pop();
        }
        options.context.pop();
    }

    validateOpenAPI3(openapi);
    var errors = validateOpenAPI3.errors;
    if (errors && errors.length) {
        throw (new Error('Failed OpenAPI3 schema validation: ' + JSON.stringify(errors, null, 2)));
    }

    options.valid = !options.expectFailure;
    if (callback) callback(null, options);
    return options.valid;
}

function validate(openapi, options, callback) {
    options.valid = false;
    options.context = [ '#/' ];
    options.warnings = [];
    var actions = [];

    common.recurse(openapi, null, function (obj, key, state) {
        if ((key === '$ref') && (typeof obj[key] === 'string')) {
            if (!obj[key].startsWith('#/')) {
                options.context.push(state.path);
                actions.push(common.resolveExternal(openapi, obj[key], options, function (data) {
                    state.parent[state.pkey] = data;
                }));
            }
        }
    });

    co(function* () {
        // resolve multiple promises in parallel
        var res = yield actions;
        options.context = [];
        validateSync(openapi, options, callback);
    })
    .catch(function (err) {
        callback(err,options);
        return false;
    });
}

module.exports = {
    validateSync: validateSync,
    validate: validate
}
