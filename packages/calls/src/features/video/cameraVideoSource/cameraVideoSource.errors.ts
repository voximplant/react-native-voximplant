/**
 * Base error for camera video source.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CameraVideoSourceError';
  }
}

/**
 * Indicates that the device does not have any camera or a hardware error has occurred.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourceCameraNotFoundError extends CameraVideoSourceError {
  constructor(message = 'Camera not found') {
    super(message);
    this.name = 'CameraVideoSourceCameraNotFoundError';
  }
}

/**
 * Indicates that a camera permission is not granted.
 *
 * On Android, [android.Manifest.permission.CAMERA](https://developer.android.com/reference/android/Manifest.permission#CAMERA) permission should be granted.
 *
 * On iOS, [NSCameraUsageDescription](https://developer.apple.com/documentation/bundleresources/information-property-list/nscamerausagedescription) should be set in the application Info.plist.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourcePermissionRequiredError extends CameraVideoSourceError {
  constructor(message = 'Permission required') {
    super(message);
    this.name = 'CameraVideoSourcePermissionRequiredError';
  }
}

/**
 * Indicates that a camera device has encountered a error.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourceCameraError extends CameraVideoSourceError {
  constructor(message = 'Camera error') {
    super(message);
    this.name = 'CameraVideoSourceCameraError';
  }
}

/**
 * Indicates that a camera has been closed while being started.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourceInterruptedError extends CameraVideoSourceError {
  constructor(message = 'Interrupted') {
    super(message);
    this.name = 'CameraVideoSourceInterruptedError';
  }
}

/**
 * Indicates that an unknown error has occurred.
 *
 * @folder Video.CameraVideoSourceErrors
 * @hideconstructor
 */
export class CameraVideoSourceUnknownError extends CameraVideoSourceError {
  constructor(message = 'Unknown error') {
    super(message);
    this.name = 'CameraVideoSourceUnknownError';
  }
}
