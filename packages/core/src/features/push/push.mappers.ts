import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import { isPushTokenErrorCode, PushTokenErrorCode } from './internal';
import {
  PushTokenCancelledError,
  PushTokenConnectionClosedError,
  PushTokenError,
  PushTokenInternalError,
  PushTokenInvalidArgumentError,
  PushTokenInvalidTokenError,
  PushTokenTimeoutError,
  PushTokenUnknownError,
} from './push.errors';

/**
 * @hidden
 */
export const toPushTokenError = (err: unknown): PushTokenError => {
  if (!isNativeError(err, isPushTokenErrorCode)) {
    return new PushTokenUnknownError();
  }

  switch (err.code) {
    case PushTokenErrorCode.Cancelled:
      return new PushTokenCancelledError(err.message);
    case PushTokenErrorCode.ConnectionClosed:
      return new PushTokenConnectionClosedError(err.message);
    case PushTokenErrorCode.InternalError:
      return new PushTokenInternalError(err.message);
    case PushTokenErrorCode.InvalidArgument:
      return new PushTokenInvalidArgumentError(err.message);
    case PushTokenErrorCode.InvalidToken:
      return new PushTokenInvalidTokenError(err.message);
    case PushTokenErrorCode.Timeout:
      return new PushTokenTimeoutError(err.message);
    case PushTokenErrorCode.Unknown:
      return new PushTokenUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new PushTokenUnknownError();
  }
};
