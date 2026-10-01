import { CameraVideoSourceErrorCode } from './cameraVideoSource.errors';

/**
 * @hidden
 */
export const isCameraVideoSourceErrorCode = (
  code: string
): code is CameraVideoSourceErrorCode =>
  Object.values(CameraVideoSourceErrorCode).includes(
    code as CameraVideoSourceErrorCode
  );
