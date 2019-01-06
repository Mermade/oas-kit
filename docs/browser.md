# Browser support

## Webpack v4

Many thanks to @RomanGotsiy for getting these sizes down somewhat.
Further size reductions were made by replacing `js-yaml` with `yaml` and
forcing `webpack` to deduplicate across packages.

```shell
$ npm run webpack
$ ls -lh dist
total 568K
-rw-r--r-- 1 mike mike  42K Jan  6 21:21 converter.min.js
-rw-r--r-- 1 mike mike 5.0K Jan  6 21:21 linter.min.js
-rw-r--r-- 1 mike mike  13K Jan  6 21:21 resolver.min.js
-rw-r--r-- 1 mike mike  82K Jan  6 21:21 validator.min.js
-rw-r--r-- 1 mike mike 412K Jan  6 21:21 vendor.min.js
-rw-r--r-- 1 mike mike 2.5K Jan  6 21:21 walker.min.js
```

The whole suite is therefore around 149K gzipped.

## Browserify

Please see [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter/) for setup or to use this [bundle](https://github.com/LucyBot-Inc/api-spec-converter/blob/master/dist/api-spec-converter.js).

Size: 8.45M
