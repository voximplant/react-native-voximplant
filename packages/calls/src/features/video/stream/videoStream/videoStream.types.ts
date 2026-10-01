/**
 * Enum that represents the types of the video stream.
 *
 * @folder Video
 */
export enum VideoStreamType {
  /**
   * Indicates that the video stream source is a camera or custom video source.
   */
  Video = 'VIDEO',
  /**
   * Indicates that the video stream source is screen sharing.
   */
  ScreenSharing = 'SCREEN_SHARING',
}

/**
 * Enum that represents the sources of the video stream.
 *
 * @folder Video
 */
export enum VideoSource {
  /**
   * Local video source (camera or custom video source).
   */
  Camera = 'CAMERA',
  /**
   * Remote participant video source.
   */
  Remote = 'REMOTE',
}

/**
 * @hidden
 */
export type VideoStreamId = string;

/**
 * Interface that represents a video stream.
 *
 * @folder Video
 */
export interface VideoStream {
  /**
   * Video stream id
   */
  readonly id: VideoStreamId;

  /**
   * Video stream type
   */
  readonly type: VideoStreamType;

  /**
   * Video stream source
   */
  readonly source: VideoSource;
}
