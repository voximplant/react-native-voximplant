import { AudioDeviceErrorCode } from './audioDevice.errors';

/**
 * @hidden
 */
export const isAudioDeviceErrorCode = (
  code: string
): code is AudioDeviceErrorCode =>
  Object.values(AudioDeviceErrorCode).includes(code as AudioDeviceErrorCode);
