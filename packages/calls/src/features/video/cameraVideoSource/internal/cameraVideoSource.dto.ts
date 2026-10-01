import type { CameraResolution } from '../../cameraDevice';
import type { QualityPreset } from '../../video.types';

/**
 * @hidden
 */
export type PreferredResolutionDTO =
  | {
      width: number;
      height: number;
    }
  | {
      preset: QualityPreset;
    };

/**
 * @hidden
 */
export const preferredResolutionToDTO = (
  preference: CameraResolution | QualityPreset
): PreferredResolutionDTO => {
  if (typeof preference === 'object') {
    return {
      width: preference.width,
      height: preference.height,
    };
  }

  return {
    preset: preference,
  };
};

/**
 * @hidden
 */
export const preferredResolutionFromDTO = (
  dto: PreferredResolutionDTO
): CameraResolution | QualityPreset => {
  if ('preset' in dto) {
    return dto.preset;
  }

  return {
    width: dto.width,
    height: dto.height,
  };
};
