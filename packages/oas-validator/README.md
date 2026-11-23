# oas-validator

Usage:

```javascript
const validator = require('oas-validator');
const options = {};
validator.validate(openapi, options)
.then(function(options){
  // options.valid contains the result of the validation, true in this branch
})
.catch(function(err){
  console.warn(err.message);
  if (options.context) console.warn('Location',options.context.pop());
});
```

If a third `callback` argument to `validate` is provided, the callback will be called instead of a Promise being returned.

`oas-validator` is an assertion-based validator, which stops on the first error, as structural errors may otherwise cause further (spurious) errors to be reported. If the `lint` option is set, multiple `warnings` may be reported.

See here for complete [documentation](/docs/options.md) of the `options` object.

## Supported OpenAPI versions

`oas-validator` validates OpenAPI 3.0.x and 3.1.x definitions. The version is detected from the `openapi` field, and `options.oas31` is set to `true` for 3.1.x definitions.

### OpenAPI 3.1.x

Schema objects are checked against JSON Schema draft 2020-12 rather than the OpenAPI 3.0 schema subset. This includes type arrays (e.g. `type: [string, 'null']`), boolean schemas, numeric `exclusiveMinimum` / `exclusiveMaximum`, `const`, `examples`, `prefixItems`, `$defs`, `if` / `then` / `else`, `dependentRequired` / `dependentSchemas`, `unevaluatedItems` / `unevaluatedProperties` and `$anchor`. Keywords alongside a schema `$ref` are checked, and plain-name `$ref`s such as `#pet` are resolved against `$anchor`s.

Keywords left over from OpenAPI 3.0 are rejected with a message pointing at their 3.1 replacement, as they would otherwise be silently ignored:

* `nullable` - use a type array including `"null"`
* `additionalItems` and array-form `items` - use `prefixItems` and `items`
* boolean `exclusiveMinimum` / `exclusiveMaximum` - use a number

Other OpenAPI 3.1 features supported:

* `paths` is optional if `components` or `webhooks` is present
* `webhooks`, `jsonSchemaDialect` and `components.pathItems` (including path item `$ref`s to them)
* `info.summary` and `license.identifier` (mutually exclusive with `license.url`)
* the `mutualTLS` security scheme type, and role names in security requirements for non-OAuth2 / OpenID Connect schemes
* `summary` and `description` alongside `$ref` in Reference Objects; any other sibling is an error

Not yet supported for 3.1.x:

* `$ref`s relative to a schema `$id` are not resolved (they are skipped rather than reported)
* `$dynamicRef` is only checked to be a string

When linting 3.1.x definitions, some default linter rules are replaced by 3.1-aware versions. See the [default rules](https://mermade.github.io/oas-kit/default-rules.html).
