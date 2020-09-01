# Change Log

## swagger2openapi v7.0 and oas-validator v5.0

* remove use of `ajv` for fallback schema validation

## swagger2openapi v6.1.0 and oas-resolver v2.4.0

New properties on the `options` object:

* `fetch` - to override the built-in `fetch` function
* `fetchOptions` - additional options to be passed to the `fetch` function

## swagger2openapi v6.0.0 and oas-validator v4.0.0

* Converter will now error out if passed in input containing YAML anchors/aliases. To bypass this check, pass the `--anchors` option or set `options.anchors` to `true`.
* Validator method `validateSync` has now been renamed `validateInner` as it (still) returns a Promise or calls a given callback.
