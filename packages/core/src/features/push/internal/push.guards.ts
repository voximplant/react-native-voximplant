import { PushTokenErrorCode } from './push.errors';

/**
 * @hidden
 */
export const isPushTokenErrorCode = (
  code: string
): code is PushTokenErrorCode =>
  Object.values(PushTokenErrorCode).includes(code as PushTokenErrorCode);
