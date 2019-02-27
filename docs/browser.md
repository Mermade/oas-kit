# Browser support

## Webpack v4

Many thanks to @RomanGotsiy for getting these sizes down somewhat.
Further size reductions were made by replacing `js-yaml` with `yaml` and
forcing `webpack` to deduplicate across packages, inspired by @mrin9.

```shell
$ npm run webpack
$ ls -lh dist
total 564K
-rw-r--r-- 1 mike mike  42K Jan  7 10:09 converter.min.js
-rw-r--r-- 1 mike mike 5.0K Jan  7 10:09 linter.min.js
-rw-r--r-- 1 mike mike 406K Jan  7 10:09 oas-lib.min.js
-rw-r--r-- 1 mike mike  13K Jan  7 10:09 resolver.min.js
-rw-r--r-- 1 mike mike  82K Jan  7 10:09 validator.min.js
-rw-r--r-- 1 mike mike 2.5K Jan  7 10:09 walker.min.js
```

The whole suite is therefore around 149K gzipped.

The converter only is:

```shell
-rw-r--r-- 1 mike mike 172K Jan  7 09:41 dist/converter-lib.min.js
-rw-r--r-- 1 mike mike  42K Jan  7 09:41 dist/converterOnly.min.js
```

And the validator only is:

```shell
-rw-r--r-- 1 mike mike 359K Jan  7 09:40 dist/validator-lib.min.js
-rw-r--r-- 1 mike mike  82K Jan  7 09:40 dist/validatorOnly.min.js
```

You can also build key parts of `reftools` into browser libraries by using `npm run webpack-reftools`.

## Browserify

Please see [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter/) for setup or to use this [bundle](https://github.com/LucyBot-Inc/api-spec-converter/blob/master/dist/api-spec-converter.js).

Size: 8.45M
