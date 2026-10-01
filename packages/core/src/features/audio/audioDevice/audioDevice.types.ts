/**
 * Enum representing audio device types.
 *
 * @folder Audio
 */
export enum AudioDeviceType {
  /**
   * Bluetooth audio device.
   */
  Bluetooth = 'BLUETOOTH',
  /**
   * Speaker audio device.
   */
  Speaker = 'SPEAKER',
  /**
   * Wired audio device.
   */
  Wired = 'WIRED',

  /**
   * Earpiece audio device.
   */
  Earpiece = 'EARPIECE',

  /**
   * USB headset
   *
   * @android
   */
  Usb = 'USB',

  /**
   * Any audio devices that the SDK cannot manage.
   *
   * @description iOS specific
   */
  Unsupported = 'UNSUPPORTED',
}

/**
 * Interface that describes an audio device.
 *
 * @folder Audio
 */
export interface AudioDevice {
  /**
   * Audio device id.
   */
  readonly id: string;

  /**
   * Audio device name.
   */
  readonly name: string;

  /**
   * Audio device type.
   */
  readonly type: AudioDeviceType;

  /**
   * Whether the audio device has a microphone.
   *
   * @android
   */
  readonly hasMic: boolean;
}
