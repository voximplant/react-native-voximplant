import type { AudioDevice, AudioDeviceType } from './audioDevice.types';

/**
 * @hidden
 */
export class AudioDeviceImpl implements AudioDevice {
  readonly id: string;
  readonly name: string;
  readonly type: AudioDeviceType;
  readonly hasMic: boolean;

  constructor(params: AudioDevice) {
    this.id = params.id;
    this.name = params.name;
    this.type = params.type;
    this.hasMic = params.hasMic;
  }
}
