# Change Log

## Unreleased: OpenAPI 3.1 validation (oas-validator, oas-linter, oas-schema-walker)

* `oas-validator` now validates OpenAPI 3.1.x definitions as well as 3.0.x. See the [oas-validator README](packages/oas-validator/README.md#openapi-31x) for what is supported
  * schema objects are checked against JSON Schema draft 2020-12, and the 3.0 keywords `nullable`, `additionalItems` and array-form `items` are rejected in 3.1.x definitions
  * `webhooks`, `jsonSchemaDialect`, `components.pathItems`, `info.summary`, `license.identifier` and the `mutualTLS` security scheme type
  * Reference Objects may have `summary` and `description` siblings; any other sibling is an error
  * new `options.oas31` output property, set to `true` for 3.1.x definitions
* `oas-linter` supports a new `only` rule key, the inverse of `skip`
* new default linter rules for 3.1.x definitions, replacing their 3.0.x counterparts (which now have `skip: oas31`): `license-url-or-identifier`, `reference-components-regex-31`, `reference-no-other-properties-31` and `schema-properties-type-31`. If you `lintSkip` one of the 3.0.x rules, you may also want to skip its replacement
* `oas-schema-walker` now traverses the JSON Schema 2020-12 subschema keywords (`prefixItems`, `$defs`, `if` / `then` / `else`, `dependentSchemas`, `contains`, `propertyNames`, `unevaluatedItems`, `unevaluatedProperties`, `contentSchema`), and can retain `$ref` siblings via `state.refSiblings`
* no changes to the validation or linting of OpenAPI 3.0.x definitions

## swagger2openapi v7.0 and oas-validator v5.0

* remove use of `ajv` for fallback schema validation

## swagger2openapi v6.1.0 and oas-resolver v2.4.0

New properties on the `options` object:

* `fetch` - to override the built-in `fetch` function
* `fetchOptions` - additional options to be passed to the `fetch` function

## swagger2openapi v6.0.0 and oas-validator v4.0.0

* Converter will now error out if passed in input containing YAML anchors/aliases. To bypass this check, pass the `--anchors` option or set `options.anchors` to `true`.
* Validator method `validateSync` has now been renamed `validateInner` as it (still) returns a Promise or calls a given callback.
