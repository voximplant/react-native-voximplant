/**
 * Base error for audio device.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AudioDeviceError';
  }
}

/**
 * Audio device cannot be activated because it is already in use.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceAlreadyActiveError extends AudioDeviceError {
  constructor(
    message = 'Audio device cannot be activated because it is already in use'
  ) {
    super(message);
    this.name = 'AudioDeviceAlreadyActiveError';
  }
}

/**
 * Something went wrong.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceInternalError extends AudioDeviceError {
  constructor(message = 'Internal error') {
    super(message);
    this.name = 'AudioDeviceInternalError';
  }
}

/**
 * Requested audio device does not exist in the current audio device list.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceNotFoundError extends AudioDeviceError {
  constructor(
    message = 'Requested audio device does not exist in the current audio device list'
  ) {
    super(message);
    this.name = 'AudioDeviceNotFoundError';
  }
}

/**
 * Unsupported device detected.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceUnsupportedError extends AudioDeviceError {
  constructor(message = 'Unsupported device detected') {
    super(message);
    this.name = 'AudioDeviceUnsupportedError';
  }
}

/**
 * Unknown audio device error.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceUnknownError extends AudioDeviceError {
  constructor(message = 'Unknown error') {
    super(message);
    this.name = 'AudioDeviceUnknownError';
  }
}

/**
 * Invalid argument passed to an audio device operation.
 *
 * @folder Audio.AudioDeviceErrors
 * @hideconstructor
 */
export class AudioDeviceInvalidArgumentError extends AudioDeviceError {
  constructor(message = 'Invalid argument') {
    super(message);
    this.name = 'AudioDeviceInvalidArgumentError';
  }
}
