import type { VideoSource, VideoStream, VideoStreamType } from '../videoStream';

/**
 * @hidden
 */
export type LocalVideoSource = Exclude<VideoSource, VideoSource.Remote>;

/**
 * Local video stream.
 *
 * Inherits from [Calls.Video.VideoStream]
 *
 * @folder Video
 */
export interface LocalVideoStream extends VideoStream {
  /**
   * Type of the local video stream
   */
  readonly type: VideoStreamType.Video;

  /**
   * Source of the local video stream
   */
  readonly source: LocalVideoSource;
}
