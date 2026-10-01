import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import {
  CameraVideoSourceCameraError,
  CameraVideoSourceCameraNotFoundError,
  CameraVideoSourceError,
  CameraVideoSourceInterruptedError,
  CameraVideoSourcePermissionRequiredError,
  CameraVideoSourceUnknownError,
} from './cameraVideoSource.errors';
import {
  CameraVideoSourceErrorCode,
  isCameraVideoSourceErrorCode,
} from './internal';

/**
 * @hidden
 */
export const toCameraVideoSourceError = (
  err: unknown
): CameraVideoSourceError => {
  if (!isNativeError(err, isCameraVideoSourceErrorCode)) {
    return new CameraVideoSourceUnknownError();
  }

  switch (err.code) {
    case CameraVideoSourceErrorCode.CameraNotFound:
      return new CameraVideoSourceCameraNotFoundError(err.message);
    case CameraVideoSourceErrorCode.PermissionRequired:
      return new CameraVideoSourcePermissionRequiredError(err.message);
    case CameraVideoSourceErrorCode.CameraError:
      return new CameraVideoSourceCameraError(err.message);
    case CameraVideoSourceErrorCode.Interrupted:
      return new CameraVideoSourceInterruptedError(err.message);
    case CameraVideoSourceErrorCode.Unknown:
      return new CameraVideoSourceUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new CameraVideoSourceUnknownError();
  }
};
