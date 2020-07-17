# Options documentation

Parameter|Type|Input/Output|Description
|---|---|---|---|
agent|Object|Input|Optional http(s).Agent to be used when fetching resources
ajv|Object|Input|Used to pass the instance of the `ajv` JSON Schema validator from the validator to the linter
allScopes|Object|Internal|Cache of scopes by securityScheme for validation
anchors|Boolean|Input|Allow use of YAML anchors/aliases. May break things
cache|Object|Input|Optional cache of external resources
components|Boolean|Input|Command-line flag to indicate unresolve information should be displayed
context|Array|Output|The context stack of associated with errors in a validation step, you normally want the last entry only
debug|Boolean|Input|Flag to enable debug mode, adds specification-extensions
direct|Boolean|Input|Flag to indicate that only the converted OpenApi definition should be returned, not wrapped in options
encoding|String|Input|Encoding to use when reading/writing files
expectFailure|Boolean|Input|Flag to invert the status of a validation step
externalRef|Object|Internal|When `prevalidate` is true, holds the entire object representing an externally `$ref`d file
externalRefs|Object|Internal|Used to track resolved external references
externals|[Array](externals.md)|Output|Information required to unresolve a resolved definition back into its component parts
fail|Boolean|Input|Command-line flag used by `testRunner`
fatal|Boolean|Input|Treat ENOTFOUND and 404 errors as fatal during resolution, otherwise returns empty objects
file|String|Input|Used to pass filename back to `testRunner`
filters|Array\[function\]|Input|Input filters for the resolver (e.g. to convert JSON schema dialects)
fetch|function|Input|Used to override the internal `fetch` implementation
fetchOptions|Object|Input|Additional options to be passed to `fetch` calls
handlers|Object|Input|Map of additional [protocol/scheme handlers](handlers.md), must be functions which return a Promise
help|Boolean|Reserved|Command-line flag to display help
indent|String|Input|Command-line flag to control JSON indenting
isCallback|Boolean|Input|Hint to the linter that we are within a `callback` object
jsonschema|String|Input|Path to alternative JSON schema (in JSON or YAML) for validation
laxDefaults|Boolean|Input|Flag to validation step to ignore default/type mismatches
laxRefs|Boolean|Input|**No longer has any effect as this is now the default**
laxurls|Boolean|Input|Flag to validation step to ignore empty URLs and # ? in paths
lint|Boolean|Input|Whether to lint the document during validation
linter|Function|Input|A linter plugin to use in place of the default linter
linterResults|Function|Input|A function to return the set of linter warnings
lintLimit|Integer|Input|Controls how many linter warnings are logged in verbose mode
lintSkip|Array|Input|A list of lint rule names which will not be tested
mediatype|Boolean|Input|Flag to validation step to check media-type strings against RFC pattern
metadata|Object|Output|Used by the validator, if `options.text` is a string, will have a property `lines` containing the number of lines in the input document. Has a property `count`, an Object keyed by the object-type within the document having values summarising the number of times that object appears in total.
nopatch|Boolean|Input|Command-line flag by `testRunner` to unset `patch`
openapi|Object|Output|The OpenApi 3.x definition returned from a conversion step
operationIds|Array[string]|Output|Used by validation to track uniqueness of operationIds
origin|Boolean\|String|Input|`true` or a URL, to indicate an `x-origin` extension should be added to the converted output
original|Object|Bi-directional|Used by `testRunner` to round-trip the original definition, set by non-object `ConvertXXX` methods
outfile|String|Input|The output file to write to
output|Boolean|Input|Internal flag to testRunner to write output openapi.yaml files
patch|Boolean|Input|Flag to fix-up minor errors in the source definition during conversion
patches|Integer|Output|Count of number of patches applied during conversion
preserveMiro|Boolean|Input|Flag to resolver as to whether to preserve old value of `$ref` in `x-miro`, default: `false`
prettify|Boolean|Input|Flag to validator to generate pretty (but potentially misleading) schema validation error reports
prevalidate|Boolean|Input|Whether to validate each externally `$ref`d file separately
promise|Object|Internal|Object containing resolve and reject functions for the converter
quiet|Boolean|Input|Command-line flag used by `testRunner`
rbname|String|Input|The name of the vendor extension to use to preserve body parameter names (e.g. x-codegen-request-body-name)
refmap|Object|Internal|Used as a mapping between old and new `$ref`s
refSiblings|string|Input|Controls handling of `$ref` which has sibling properties. Valid values are `remove` (to remove such properties) which is the default outside `schema` objects,  `preserve` to keep the (incorrect) use of sibling properties, and `allOf`, to wrap the `$ref` and the remaining sibling properties in an `allOf`, which is the default/allowed only within `schema` objects
resolve|Boolean|Input|Flag to enable resolution of external `$ref`s
resolveInternal|Boolean|Input|Flag to enable resolution of internal `$ref`s. Also disables deduplication of `requestBodies`
resolver|Object|Internal|Used by the resolver to track outstanding resolutions
schema|Object|Input|Temporarily holds JSON Schema during validation step
skip|Boolean|Reserved|Used by tools such as Speccy to skip linter rules
stop|Boolean|Input|Command-line flag used by `testRunner`
source|String|Input|The source filename or url of the definition, used by the resolver
sourceYaml|Boolean|Output|Flag set if the source string, URL or stream contained a YAML formatted definition
targetVersion|String|Input|Used to override the default target OpenAPI version of `3.0.0`
text|String|Both|If not already a truthy value, will be set to the input text of the conversion
throws|Boolean|Input|Used by tests only to indicate the fixture should throw an exception
url|String|Input|URL of the original definition, used when reading a file to create `x-origin` extension
valid|Boolean|Output|The result of a validation step
validateSchema|String|Input|Set to 'first', 'last' or 'never' to control ordering of validation strategies
verbose|Boolean|Input|Increase verbosity, e.g. show HTTP GET requests
version|Boolean|Input|Command-line flag to show version information
warnings|Array|Output|Warnings generated by a validation step
warnOnly|Boolean|Input|Do not throw on non-patchable errors, add warning extensions
warnProperty|String|Input|Property name to use for warning extensions, default `x-s2o-warning`
whatwg|Boolean|Input|Enable WHATWG URL parsing in validation step (default false)
yaml|Boolean|Input|Flag to write YAML, default JSON (overridden by --outfile filepath extension)
