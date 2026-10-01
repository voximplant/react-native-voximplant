/**
 * Enum representing camera device types.
 *
 * @folder Video
 */
export enum CameraDeviceType {
  /**
   * Back camera.
   */
  Back = 'BACK',
  /**
   * Front camera.
   */
  Front = 'FRONT',
  /**
   * Unknown camera.
   */
  Unknown = 'UNKNOWN',
}

/**
 * Represents a camera resolution supported by the camera device.
 *
 * @folder Video
 */
export interface CameraResolution {
  /**
   * Camera resolution width
   */
  width: number;
  /**
   * Camera resolution height
   */
  height: number;
}

/**
 * Provides information about the camera device.
 *
 * @folder Video
 */
export interface CameraDevice {
  /**
   * Camera device id
   */
  readonly id: string;

  /**
   * Camera device type
   */
  readonly type: CameraDeviceType;

  /**
   * List of [Calls.Video.CameraResolution] values supported by the camera device
   *
   * @android
   */
  readonly supportedResolutions: CameraResolution[];
}
