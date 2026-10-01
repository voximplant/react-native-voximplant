import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../../specs/video.native-spec';
import type { VideoStreamId } from '../../videoStream';
import type {
  LocalVideoSource,
  LocalVideoStream,
} from '../localVideoStream.types';
import { localVideoStreamFromDTO } from './localVideoStream.dto';
import type { LocalVideoStreamData } from '../localVideoStream';

/**
 * @hidden
 */
export class LocalVideoStreamRepository extends Repository<
  LocalVideoStream,
  LocalVideoStreamData,
  VideoStreamId
> {
  private readonly native: Spec;

  constructor(native: Spec) {
    super();
    this.native = native;
  }

  protected getEntityData(id: VideoStreamId): LocalVideoStreamData | null {
    const dto = this.native.getLocalStream(id);
    return dto ? { id, source: dto.source } : null;
  }

  protected getEntityDataList(): LocalVideoStreamData[] {
    return this.native.getLocalStreams();
  }

  protected sourceHas(id: VideoStreamId): boolean {
    return this.native.getLocalStream(id) !== null;
  }

  protected createEntity(data: LocalVideoStreamData): LocalVideoStream {
    return localVideoStreamFromDTO(data);
  }

  public createStream(source: LocalVideoSource): LocalVideoStream | null {
    const id = this.native.createLocalStream(source);
    if (id === null) return null;

    return this.store({ id, source });
  }

  public removeStream(id: VideoStreamId): void {
    this.native.removeLocalStream(id);
    this.remove(id);
  }

  public removeAllStreams(): void {
    this.native.removeAllLocalStreams();
    this.sync();
  }
}
