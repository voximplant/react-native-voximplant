import { CallErrorCode } from './calls.errors';

/**
 * @hidden
 */
export const isCallErrorCode = (code: string): code is CallErrorCode =>
  Object.values(CallErrorCode).includes(code as CallErrorCode);
