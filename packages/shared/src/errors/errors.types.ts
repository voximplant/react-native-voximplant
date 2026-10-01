/**
 * @hidden
 */
export interface NativeError<T extends string = string> extends Error {
  code: T;
  message: string;
}
