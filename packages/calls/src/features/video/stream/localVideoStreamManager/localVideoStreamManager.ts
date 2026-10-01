import NativeVideo from '../../../../specs/video.native-spec';
import {
  LocalVideoStreamRepository,
  type LocalVideoSource,
  type LocalVideoStream,
} from '../localVideoStream';
import type { VideoStreamId } from '../videoStream';

/**
 * Local video stream manager for creating and managing local video streams.
 *
 * @folder Video
 * @hideconstructor
 */
export abstract class LocalVideoStreamManager {
  private static instance: LocalVideoStreamManager | null = null;

  public static getInstance(): LocalVideoStreamManager {
    if (!LocalVideoStreamManager.instance) {
      LocalVideoStreamManager.instance = new LocalVideoStreamManagerImpl();
    }
    return LocalVideoStreamManager.instance;
  }

  protected constructor() {}

  /**
   * Returns a map of local video streams with their ids.
   */
  abstract getStreams(): Map<VideoStreamId, LocalVideoStream>;

  /**
   * Returns a local video stream with the given id.
   *
   * @param streamId Local video stream id
   */
  abstract getStream(streamId: VideoStreamId): LocalVideoStream | null;

  /**
   * Creates a new local video stream with the given source.
   *
   * @param source Local video source
   */
  abstract createStream(source: LocalVideoSource): LocalVideoStream | null;

  /**
   * Removes the local video stream with the given id.
   *
   * @param streamId Local video stream id
   */
  abstract removeStream(streamId: VideoStreamId): void;

  /**
   * Removes all local video streams.
   */
  abstract removeAllStreams(): void;
}

/**
 * @hidden
 */
class LocalVideoStreamManagerImpl extends LocalVideoStreamManager {
  private readonly repository: LocalVideoStreamRepository;

  constructor() {
    super();
    this.repository = new LocalVideoStreamRepository(NativeVideo);
  }

  public getStreams(): Map<VideoStreamId, LocalVideoStream> {
    return this.repository.getMap();
  }

  public getStream(streamId: VideoStreamId): LocalVideoStream | null {
    return this.repository.get(streamId);
  }

  public createStream(source: LocalVideoSource): LocalVideoStream | null {
    return this.repository.createStream(source);
  }

  public removeStream(streamId: VideoStreamId): void {
    return this.repository.removeStream(streamId);
  }

  public removeAllStreams(): void {
    return this.repository.removeAllStreams();
  }
}
