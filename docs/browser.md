# Browser support

## Webpack v4

Many thanks to @RomanGotsiy for getting these sizes down somewhat.

```shell
$ npx webpack -p
$ ls -lh dist
total 1.2M
-rw-r--r-- 1 mike mike   41K Jul  4 13:58 converter.min.js
-rw-r--r-- 1 mike mike  3.0K Jul  4 13:58 linter.min.js
-rw-r--r-- 1 mike mike   12K Jul  4 13:58 resolver.min.js
-rw-r--r-- 1 mike mike   79K Jul  4 13:58 validator.min.js
-rw-r--r-- 1 mike mike 1009K Jul  4 13:58 vendors.min.js
-rw-r--r-- 1 mike mike  2.4K Jul  4 13:58 walker.min.js
```

## Browserify

Please see [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter/) for setup or to use this [bundle](https://github.com/LucyBot-Inc/api-spec-converter/blob/master/dist/api-spec-converter.js).

Size: 8.45M
