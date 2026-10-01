import { Repository } from '@voximplant/react-native-shared';
import {
  localVideoStreamFromDTO,
  type LocalVideoStream,
  type LocalVideoStreamData,
  type VideoStreamId,
} from '../../video';
import type { CallId } from '../call';
import type { ConferenceId } from '../conference';
import type { Spec } from '../../../specs/calls.native-spec';

/**
 * @hidden
 */
export class CallsLocalVideoStreamRepository extends Repository<
  LocalVideoStream,
  LocalVideoStreamData,
  VideoStreamId
> {
  private readonly callId: CallId | ConferenceId;
  private readonly native: Spec;

  constructor(params: { callId: CallId | ConferenceId; native: Spec }) {
    super();
    this.callId = params.callId;
    this.native = params.native;
  }

  protected getEntityData(id: VideoStreamId): LocalVideoStreamData | null {
    const dto = this.native.getLocalVideoStream(this.callId, id);
    return dto ? { id, source: dto.source } : null;
  }

  protected getEntityDataList(): LocalVideoStreamData[] {
    return this.native.getLocalVideoStreams(this.callId);
  }

  protected sourceHas(id: VideoStreamId): boolean {
    return this.native.getLocalVideoStream(this.callId, id) !== null;
  }

  protected createEntity(data: LocalVideoStreamData): LocalVideoStream {
    return localVideoStreamFromDTO(data);
  }
}
