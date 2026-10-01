import {
  VideoSource,
  VideoStreamImpl,
  VideoStreamType,
  type VideoStreamId,
} from '../videoStream';
import type { RemoteVideoStream } from './remoteVideoStream.types';

/**
 * @hidden
 */
export interface RemoteVideoStreamData {
  readonly id: VideoStreamId;
}
/**
 * @hidden
 */
export class RemoteVideoStreamImpl
  extends VideoStreamImpl
  implements RemoteVideoStream
{
  readonly type = VideoStreamType.Video;
  readonly source = VideoSource.Remote;

  constructor(data: RemoteVideoStreamData) {
    super(data.id);
  }
}
