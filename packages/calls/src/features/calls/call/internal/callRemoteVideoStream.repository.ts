import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../specs/calls.native-spec';
import {
  RemoteVideoStreamImpl,
  type RemoteVideoStream,
  type RemoteVideoStreamData,
  type VideoStreamId,
} from '../../../video';
import type { CallId } from '../call.types';

/**
 * @hidden
 */
export class CallRemoteVideoStreamRepository extends Repository<
  RemoteVideoStream,
  RemoteVideoStreamData,
  VideoStreamId
> {
  private readonly callId: CallId;
  private readonly native: Spec;

  constructor(params: { callId: CallId; native: Spec }) {
    super();
    this.callId = params.callId;
    this.native = params.native;
  }

  protected getEntityData(id: VideoStreamId): RemoteVideoStreamData | null {
    return this.native.hasRemoteVideoStreamForCall(this.callId, id)
      ? { id }
      : null;
  }

  protected getEntityDataList(): RemoteVideoStreamData[] {
    return this.native.getRemoteVideoStreams(this.callId).map((id) => ({
      id,
    }));
  }

  protected sourceHas(streamId: VideoStreamId): boolean {
    return this.native.hasRemoteVideoStreamForCall(this.callId, streamId);
  }

  protected createEntity(data: RemoteVideoStreamData): RemoteVideoStream {
    return new RemoteVideoStreamImpl(data);
  }
}
