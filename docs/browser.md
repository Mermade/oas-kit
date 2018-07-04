# Browser support

## Webpack v4

Many thanks to @RomanGotsiy for getting these sizes down somewhat.

```shell
$ npx webpack -p
$ ls -lh dist
total 1.8M
-rw-r--r-- 1 mike mike 421K Jul  4 13:43 converter.min.js
-rw-r--r-- 1 mike mike 242K Jul  4 13:43 linter.min.js
-rw-r--r-- 1 mike mike 226K Jul  4 13:43 resolver.min.js
-rw-r--r-- 1 mike mike 922K Jul  4 13:43 validator.min.js
-rw-r--r-- 1 mike mike 2.4K Jul  4 13:43 walker.min.js
```

## Browserify

Please see [api-spec-converter](https://github.com/LucyBot-Inc/api-spec-converter/) for setup or to use this [bundle](https://github.com/LucyBot-Inc/api-spec-converter/blob/master/dist/api-spec-converter.js).

Size: 8.45M
