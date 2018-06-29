# Linter rules format

## Rules file format

A rules file is a YAML (or JSON) formatted file, containing an object, with a `rules` property, which is an array of `rule` objects.

There is a reserved `require` property (type `string`) at the top level, which may be used for rule-set chaining in the future.

### Example

```yaml
rules:
- name: parameter-description
  object: parameter
  description: parameter objects should have a description
  truthy: description
- name: parameter-name-regex
  object: parameter
  description: parameter names should match RFC6570
  pattern:
    property: name
    value: '^[A-Za-z0-9?_()]+$'
```

## Rule object format

|Property|Type|Required|Description|
|---|---|---|---|
|name|string|yes|The name/slug of the rule. Use hyphens. Used as the unique key. You can namespace your rules with any prefix and delimiter you wish, to avoid clashes with other people's and the the built-in rules|
|description|string|recommended|An optional description for the rule|
|disabled|boolean|no|Set to `true` to temporarily disable a rule|
|enabled|boolean|deprecated|No longer used by `oas-linter`|
|object|string|array|no|The object(s) to act upon, may be `*` for all objects. E.g. `parameter`|
|truthy|string\|array|no|A property or list of properties which must be truthy (present with a non-false, non-null, non-empty value). Empty arrays are not considered truthy|
|alphabetical|object|reserved|Not used by `oas-linter`. Structure: `{ properties: string, keyedBy: string }`|
|or|array|no|An array of property names, one or more of which must be present|
|maxLength|object|reserved|An object containing a `property` string name, and a ``value` (integer). The length of the `property` value must not be longer than `value`|
|notContain|object|no|An object containing a `properties` array and a `value`. None of the `properties` must contain the `value`. Used with strings|
|notEndWith|object|no|An object containing a `property` and a `value` string. The given `property` must not end with the given `value`. Used with strings|
|pattern|object|no|An object containing a `property` name, an optional `split` string which is used to split the value being tested into individual components, an optional `omit` string (which is chopped off the front of each component being tested), and a `value` regex property which is used to test all components of the property value being tested|
|properties|integer|no|The exact number of non-extension properties which must be present on the target object|
|skip|string|no|The name of a property in the `options` object. If this property is truthy, then the rule is skipped. E.g. `isCallback` can be used to skip rules for `operation` objects within `callback` objects, while still applying to top-level `operation` objects|
|xor|array|no|An array of property names, only one of which must be present|
