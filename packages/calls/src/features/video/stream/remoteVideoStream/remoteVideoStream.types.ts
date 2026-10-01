import type { VideoSource, VideoStream, VideoStreamType } from '../videoStream';

/**
 * Remote participant video stream in a call or conference.
 *
 * Inherits from [Calls.Video.VideoStream]
 *
 * @folder Video
 */
export interface RemoteVideoStream extends VideoStream {
  /**
   * Remote video stream type
   */
  readonly type: VideoStreamType.Video;

  /**
   * Remote video stream source
   */
  readonly source: VideoSource.Remote;
}
