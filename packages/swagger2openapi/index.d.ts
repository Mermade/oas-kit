declare function mock(...args: any[]): any;
declare function convertObj(swagger: any, options: any, callback: any): any;
declare function convertUrl(url: any, options: any, callback: any): any;
declare function convertStr(str: any, options: any, callback: any): any;
declare function convertFile(filename: any, options: any, callback: any): any;
declare function convertStream(readable: any, options: any, callback: any): any;
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
