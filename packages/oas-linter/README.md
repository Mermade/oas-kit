# oas-linter

This is a plugin for [oas-validator](https://github.com/mermade/oas-kit) which implements a simple linter using a [DSL](https://mermade.github.io/oas-kit/linter-rules.html) and a set of [default rules](https://mermade.github.io/oas-kit/default-rules.html).

Rules can be limited to particular documents with the `skip` and `only` keys, which name a property of the `options` object. For example, the default rules use `skip: oas31` and `only: oas31` to apply different versions of some rules to OpenAPI 3.0.x and 3.1.x definitions.

See here for complete [documentation](/docs/options.md) of the `options` object.

