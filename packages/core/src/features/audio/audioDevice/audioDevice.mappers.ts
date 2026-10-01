import {
  assertUnreachable,
  isNativeError,
} from '@voximplant/react-native-shared';
import {
  AudioDeviceAlreadyActiveError,
  AudioDeviceInternalError,
  AudioDeviceInvalidArgumentError,
  AudioDeviceNotFoundError,
  AudioDeviceUnknownError,
  AudioDeviceUnsupportedError,
  type AudioDeviceError,
} from './audioDevice.errors';
import { AudioDeviceErrorCode, isAudioDeviceErrorCode } from './internal';

/**
 * @hidden
 */
export const toAudioDeviceError = (err: unknown): AudioDeviceError => {
  if (!isNativeError(err, isAudioDeviceErrorCode)) {
    return new AudioDeviceUnknownError();
  }

  switch (err.code) {
    case AudioDeviceErrorCode.AlreadyActive:
      return new AudioDeviceAlreadyActiveError(err.message);
    case AudioDeviceErrorCode.InternalError:
      return new AudioDeviceInternalError(err.message);
    case AudioDeviceErrorCode.InvalidArgument:
      return new AudioDeviceInvalidArgumentError(err.message);
    case AudioDeviceErrorCode.NotFound:
      return new AudioDeviceNotFoundError(err.message);
    case AudioDeviceErrorCode.Unsupported:
      return new AudioDeviceUnsupportedError(err.message);
    case AudioDeviceErrorCode.Unknown:
      return new AudioDeviceUnknownError(err.message);
    default:
      assertUnreachable(err.code);
      return new AudioDeviceUnknownError();
  }
};
