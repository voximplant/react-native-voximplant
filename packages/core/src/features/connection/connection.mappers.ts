import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import {
  ConnectionError,
  ConnectionInternalError,
  ConnectionInterruptedError,
  ConnectionInvalidArgumentError,
  ConnectionInvalidStateError,
  ConnectionNetworkIssuesError,
  ConnectionTimeoutError,
  ConnectionUnknownError,
} from './connection.errors';
import { ConnectionErrorCode, isConnectionErrorCode } from './internal';

/**
 * @hidden
 */
export const toConnectionError = (err: unknown): ConnectionError => {
  if (!isNativeError(err, isConnectionErrorCode)) {
    return new ConnectionUnknownError();
  }

  switch (err.code) {
    case ConnectionErrorCode.InternalError:
      return new ConnectionInternalError(err.message);
    case ConnectionErrorCode.Interrupted:
      return new ConnectionInterruptedError(err.message);
    case ConnectionErrorCode.InvalidArgument:
      return new ConnectionInvalidArgumentError(err.message);
    case ConnectionErrorCode.InvalidState:
      return new ConnectionInvalidStateError(err.message);
    case ConnectionErrorCode.NetworkIssues:
      return new ConnectionNetworkIssuesError(err.message);
    case ConnectionErrorCode.Timeout:
      return new ConnectionTimeoutError(err.message);
    case ConnectionErrorCode.Unknown:
      return new ConnectionUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new ConnectionUnknownError();
  }
};
