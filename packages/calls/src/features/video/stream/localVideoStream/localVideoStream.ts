import {
  VideoStreamImpl,
  VideoStreamType,
  type VideoStreamId,
} from '../videoStream';
import type {
  LocalVideoSource,
  LocalVideoStream,
} from './localVideoStream.types';

/**
 * @hidden
 */
export interface LocalVideoStreamData {
  readonly id: VideoStreamId;
  readonly source: LocalVideoSource;
}

/**
 * @hidden
 */
export class LocalVideoStreamImpl
  extends VideoStreamImpl
  implements LocalVideoStream
{
  public readonly type = VideoStreamType.Video;
  public readonly source: LocalVideoSource;

  constructor(data: LocalVideoStreamData) {
    super(data.id);
    this.source = data.source;
  }
}
