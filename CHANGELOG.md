# Change Log

## swagger2openapi v6.0.0 and oas-validator v4.0.0

* Converter will now error out if passed in input containing YAML anchors/aliases. To bypass this check, pass the `--anchors` option or set `options.anchors` to `true`.
* Validator method `validateSync` has now been renamed `validateInner` as it (still) returns a Promise or calls a given callback.
