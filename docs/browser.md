# Browser support

## Webpack v4

Many thanks to @RomanGotsiy for getting these sizes down somewhat.
Further size reductions were made by replacing `js-yaml` with `yaml`.

```shell
$ npm run webpack
$ ls -lh dist
total 872K
-rw-r--r-- 1 mike mike  42K Jan  6 13:28 converter.min.js
-rw-r--r-- 1 mike mike 5.0K Jan  6 13:28 linter.min.js
-rw-r--r-- 1 mike mike  13K Jan  6 13:28 resolver.min.js
-rw-r--r-- 1 mike mike  82K Jan  6 13:28 validator.min.js
-rw-r--r-- 1 mike mike 713K Jan  6 13:28 vendors.min.js
-rw-r--r-- 1 mike mike 2.5K Jan  6 13:28 walker.min.js
```

## Browserify

Please see [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter/) for setup or to use this [bundle](https://github.com/LucyBot-Inc/api-spec-converter/blob/master/dist/api-spec-converter.js).

Size: 8.45M
