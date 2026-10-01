import type { NativeError } from './errors.types';

/**
 * @hidden
 */
export const isNativeError = <T extends string = string>(
  err: unknown,
  isValidCode?: (code: string) => code is T
): err is NativeError<T> => {
  if (!(err instanceof Error) || !('code' in err) || !('message' in err)) {
    return false;
  }

  return isValidCode ? isValidCode((err as NativeError).code) : true;
};
