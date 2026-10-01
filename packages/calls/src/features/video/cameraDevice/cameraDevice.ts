import type {
  CameraDevice,
  CameraDeviceType,
  CameraResolution,
} from './cameraDevice.types';

/**
 * @hidden
 */
export class CameraDeviceImpl implements CameraDevice {
  readonly id: string;
  readonly supportedResolutions: CameraResolution[];
  readonly type: CameraDeviceType;

  constructor(data: CameraDevice) {
    this.id = data.id;
    this.supportedResolutions = data.supportedResolutions;
    this.type = data.type;
  }
}
