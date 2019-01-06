# oas-validator

Usage:

```javascript
var validator = require('oas-validator');
var options = {};
validator.validate(openapi, options, function(err, options){
  // options.valid contains the result of the validation
  // options.context now contains a stack (array) of JSON-Pointer strings
});
// also available is a synchronous validateSync method which returns a boolean
```

See here for complete [documentation](/docs/options.md) of the `options` object.
