import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import {
  CallAlreadyInThisStateError,
  CallCameraNotFoundError,
  CallError,
  CallIncorrectOperationError,
  CallInternalError,
  CallInterruptedError,
  CallInvalidArgumentError,
  CallInvalidCallStateError,
  CallMediaIsOnHoldError,
  CallPermissionRequiredError,
  CallRejectedError,
  CallTimeoutError,
  CallUnknownError,
} from './calls.errors';
import { CallErrorCode, isCallErrorCode } from './internal';

/**
 * @hidden
 */
export const toCallError = (err: unknown): CallError => {
  if (!isNativeError(err, isCallErrorCode)) {
    return new CallUnknownError();
  }

  switch (err.code) {
    case CallErrorCode.AlreadyInThisState:
      return new CallAlreadyInThisStateError(err.message);
    case CallErrorCode.IncorrectOperation:
      return new CallIncorrectOperationError(err.message);
    case CallErrorCode.InternalError:
      return new CallInternalError(err.message);
    case CallErrorCode.InvalidCallState:
      return new CallInvalidCallStateError(err.message);
    case CallErrorCode.MediaIsOnHold:
      return new CallMediaIsOnHoldError(err.message);
    case CallErrorCode.Rejected:
      return new CallRejectedError(err.message);
    case CallErrorCode.Timeout:
      return new CallTimeoutError(err.message);
    case CallErrorCode.PermissionRequired:
      return new CallPermissionRequiredError(err.message);
    case CallErrorCode.InvalidArgument:
      return new CallInvalidArgumentError(err.message);
    case CallErrorCode.Interrupted:
      return new CallInterruptedError(err.message);
    case CallErrorCode.CameraNotFound:
      return new CallCameraNotFoundError(err.message);
    case CallErrorCode.Unknown:
      return new CallUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new CallUnknownError();
  }
};
