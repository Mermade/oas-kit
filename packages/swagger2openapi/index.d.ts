declare interface Options {
  /** Optional http(s).Agent to be used when fetching resources */
  agent?: Object;
  /** Allow use of YAML anchors/aliases. May break things */
  anchors?: Boolean;
  /** Optional cache of external resources */
  cache?: Object;
  /** Command-line flag to indicate unresolve information should be displayed */
  components?: Boolean;
  /** Flag to enable debug mode, adds specification-extensions */
  debug?: Boolean;
  /**
   * Flag to indicate that only the converted OpenApi definition should be
   * returned, not wrapped in options
   */
  direct?: Boolean;
  /** Encoding to use when reading/writing files */
  encoding?: String;
  /** Flag to invert the status of a validation step */
  expectFailure?: Boolean;
  /** Command-line flag used by `testRunner` */
  fail?: Boolean;
  /**
   * Treat ENOTFOUND and 404 errors as fatal during resolution, otherwise
   * returns empty objects
   */
  fatal?: Boolean;
  /** Used to pass filename back to `testRunner` */
  file?: String;
  /** Input filters for the resolver (e.g. to convert JSON schema dialects) */
  filters?: Array;
  /** Used to override the internal `fetch` implementation */
  fetch?: function;
  /** Additional options to be passed to `fetch` calls */
  fetchOptions?: Object;
  /**
   * Map of additional [protocol/scheme handlers](handlers.md), must be
   * functions which return a Promise
   */
  handlers?: Object;
  /** Set to `true` to ignore IO errors when resolving */
  ignoreIOErrors?: Boolean;
  /** Command-line flag to control JSON indenting */
  indent?: String;
  /** Hint to the linter that we are within a `callback` object */
  isCallback?: Boolean;
  /** Flag to validation step to ignore default/type mismatches */
  laxDefaults?: Boolean;
  /** Flag to validation step to ignore empty URLs and # ? in paths */
  laxurls?: Boolean;
  /** Whether to lint the document during validation */
  lint?: Boolean;
  /** A linter plugin to use in place of the default linter */
  linter?: Function;
  /** A function to return the set of linter warnings */
  linterResults?: Function;
  /** Controls how many linter warnings are logged in verbose mode */
  lintLimit?: Integer;
  /** A list of lint rule names which will not be tested */
  lintSkip?: Array;
  /** Flag to validation step to check media-type strings against RFC pattern */
  mediatype?: Boolean;
  /** Command-line flag by `testRunner` to unset `patch` */
  nopatch?: Boolean;
  /**
   * `true` or a URL, to indicate an `x-origin` extension should be added to the
   * converted output
   */
  origin?: Boolean | String;
  /** The output file to write to */
  outfile?: String;
  /** Internal flag to testRunner to write output openapi.yaml files */
  output?: Boolean;
  /** Flag to fix-up minor errors in the source definition during conversion */
  patch?: Boolean;
  /** Count of number of patches applied during conversion */
  patches?: Integer;
  /**
   * Flag to resolver as to whether to preserve old value of `$ref` in `x-miro`,
   * default?: `false`
   */
  preserveMiro?: Boolean;
  /** Whether to validate each externally `$ref`d file separately */
  prevalidate?: Boolean;
  /** Command-line flag used by `testRunner` */
  quiet?: Boolean;
  /**
   * The name of the vendor extension to use to preserve body parameter names
   * (e.g. x-codegen-request-body-name)
   */
  rbname?: String;
  /**
   * Controls handling of `$ref` which has sibling properties. Valid values are
   * `remove` (to remove such properties) which is the default outside `schema`
   * objects, `preserve` to keep the (incorrect) use of sibling properties, and
   * `allOf`, to wrap the `$ref` and the remaining sibling properties in an
   * `allOf`, which is the default/allowed only within `schema` objects
   */
  refSiblings?: string;
  /** Flag to enable resolution of external `$ref`s */
  resolve?: Boolean;
  /**
   * Flag to enable resolution of internal `$ref`s. Also disables deduplication
   * of `requestBodies`
   */
  resolveInternal?: Boolean;
  /** Command-line flag used by `testRunner` */
  stop?: Boolean;
  /** The source filename or url of the definition, used by the resolver */
  source?: String;
  /** Used to override the default target OpenAPI version of `3.0.0` */
  targetVersion?: String;
  /** If not already a truthy value, will be set to the input text of the conversion */
  text?: String;
  /** Used by tests only to indicate the fixture should throw an exception */
  throws?: Boolean;
  /**
   * URL of the original definition, used when reading a file to create
   * `x-origin` extension
   */
  url?: String;
  /** Increase verbosity, e.g. show HTTP GET requests */
  verbose?: Boolean;
  /** Command-line flag to show version information */
  version?: Boolean;
  /** Do not throw on non-patchable errors, add warning extensions */
  warnOnly?: Boolean;
  /** Property name to use for warning extensions, default `x-s2o-warning` */
  warnProperty?: String;
  /** Ignored (enable WHATWG URL parsing in validation step, now the default) */
  whatwg?: Boolean;
  /** Flag to write YAML, default JSON (overridden by --outfile filepath extension) */
  yaml?: Boolean;
}

declare interface Result {
  /**
   * The context stack of associated with errors in a validation step, you
   * normally want the last entry only
   */
  context?: any[];
  /** Information required to unresolve a resolved definition back into its component parts */
  externals?: any[];
  /**
   * Used by the validator, if `options.text` is a string, will have a property
   * `lines` containing the number of lines in the input document. Has a
   * property `count`, an Object keyed by the object-type within the document
   * having values summarising the number of times that object appears in total.
   */
  metadata?: Object;
  /** The OpenApi 3.x definition returned from a conversion step */
  openapi?: Object;
  /** Used by validation to track uniqueness of operationIds */
  operationIds?: string[];
  /** Flag set if the source string, URL or stream contained a YAML formatted definition */
  sourceYaml?: Boolean;
  /** If not already a truthy value, will be set to the input text of the conversion */
  text?: String;
  /** The result of a validation step */
  valid?: Boolean;
  /** Warnings generated by a validation step */
  warnings?: Array;
}

declare type Callback = (err: Error, result: Result) => void;

declare function convertObj(
  swagger: any,
  options: Options,
  callback: Callback,
): Promise<Result>;
declare function convertUrl(
  url: string,
  options: Options,
  callback: Callback,
): Promise<Result>;
declare function convertStr(
  str: string | Buffer,
  options: Options,
  callback: Callback,
): Promise<Result>;
declare function convertFile(
  filename: string | number | Buffer,
  options: Options,
  callback: Callback,
): Promise<Result>;
declare function convertStream(
  readable: any,
  options: Options,
  callback: Callback,
): Promise<Result>;
class S2OError extends Error {
  name: string;
}

declare const targetVersion: string;
declare const convert: convertObj;

export {
  S2OError,
  targetVersion,
  convert,
  convertObj,
  convertUrl,
  convertStr,
  convertFile,
  convertStream,
};
