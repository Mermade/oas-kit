# `oas-overlay`

## Usage

```
const applicator = require('oas-overlay');

applicator.apply(overlayObject,openAPIObject,options);
```

`options`: only `verbose` is used so far.

## CLI

`node apply.js {overlayfile} {openapifile}`

This program writes to `stdout` in YAML format.
