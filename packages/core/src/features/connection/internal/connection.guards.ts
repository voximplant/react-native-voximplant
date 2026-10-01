import { ConnectionErrorCode } from './connection.errors';

/**
 * @hidden
 */
export const isConnectionErrorCode = (
  code: string
): code is ConnectionErrorCode =>
  Object.values(ConnectionErrorCode).includes(code as ConnectionErrorCode);
