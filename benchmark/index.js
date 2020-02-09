'use strict'

var Benchmark = require('benchmark');

const jtpr = require('../packages/reftools/lib/jptr')
const clone = require('../packages/reftools/lib/clone')
const swagger2openapi = require('../packages/swagger2openapi')

const exampleSwagger = require('./petstore.json')

var suite = Benchmark.Suite()

suite.on('cycle', function(event) {
  console.log(String(event.target));
})

suite.add('jpescape', function () {
  const string = '/my/string/with~some~escape/to~perform'
  jtpr.jpescape(string)
})

suite.add('jpunescape', function () {
  const string = '~1my~1string~1with~0some~0escape~1to~0perform'
  jtpr.jpunescape(string)
})

suite.add('circular clone', function () {
  const input = { container: { child: { value: true } } };
  clone.circularClone(input)
})

suite.add('swagger2openapi convertObj with text', function () {
  swagger2openapi.convertObj(exampleSwagger, {
    patch: true,
    warnOnly: true,
    direct: true
  })
})

suite.add('swagger2openapi convertObj without text', function () {
  swagger2openapi.convertObj(exampleSwagger, {
    text: true,
    patch: true,
    warnOnly: true,
    direct: true
  })
})

suite.run({ 'async': true });
