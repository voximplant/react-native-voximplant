/**
 * Enum that contains video quality presets.
 *
 * @folder Video
 */
export enum QualityPreset {
  /**
   * Configures a camera to capture video in 1280x720 resolution.
   */
  High = 'HIGH',

  /**
   * Configures a camera to capture video in 640x480 resolution.
   */
  Medium = 'MEDIUM',

  /**
   * Configures a camera to capture video in 352x288 resolution on iOS and 320x240 resolution on Android.
   */
  Low = 'LOW',
}

/**
 * Enum that describes the reason the video source is stopped.
 *
 * @folder Video
 */
export enum VideoSourceStopReason {
  /**
   * Video source is stopped by the OS.
   */
  BySystem = 'BY_SYSTEM',

  /**
   * Video source is stopped normally.
   */
  Normal = 'NORMAL',

  /**
   * Video source is stopped because of an error.
   *
   * @android
   */
  InternalError = 'INTERNAL_ERROR',
}

/**
 * Enum that describes the types of video renderer scaling.
 *
 * @folder Video
 */
export enum VideoRenderScaleType {
  /**
   * Video frame is scaled to fill the size of the view by maintaining the aspect ratio. Some portion of the video frame may be clipped.
   */
  Fill = 'FILL',

  /**
   * Video frame is scaled to be fit the size of the view by maintaining the aspect ratio (black borders may be displayed).
   */
  Fit = 'FIT',
}

/**
 * Enum that represents video codec types.
 *
 * @folder Video
 */
export enum VideoCodec {
  /**
   * Video codec for a call or conference is chosen automatically.
   */
  Auto = 'AUTO',

  /**
   * Call or conference is set to prioritize the H.264 video codec.
   */
  H264 = 'H264',

  /**
   * Call or conference is set to prioritize the VP8 video codec.
   */
  VP8 = 'VP8',
}

/**
 * Interface that represents a video resolution.
 *
 * @folder Video
 */
export interface VideoResolution {
  /**
   * Video width
   */
  width: number;
  /**
   * Video height
   */
  height: number;
}
