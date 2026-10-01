import type {
  VideoSource,
  VideoStream,
  VideoStreamId,
  VideoStreamType,
} from './videoStream.types';

/**
 * @hidden
 */
export abstract class VideoStreamImpl implements VideoStream {
  public readonly id: VideoStreamId;

  abstract readonly type: VideoStreamType;
  abstract readonly source: VideoSource;

  constructor(id: VideoStreamId) {
    this.id = id;
  }
}
