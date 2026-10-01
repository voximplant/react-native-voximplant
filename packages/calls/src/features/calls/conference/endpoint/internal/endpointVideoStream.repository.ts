import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../../specs/calls.native-spec';
import {
  RemoteVideoStreamImpl,
  type RemoteVideoStream,
  type RemoteVideoStreamData,
  type VideoStreamId,
} from '../../../../video';
import type { EndpointId } from '../endpoint.types';

/**
 * @hidden
 */
export class EndpointVideoStreamRepository extends Repository<
  RemoteVideoStream,
  RemoteVideoStreamData,
  VideoStreamId
> {
  private readonly endpointId: EndpointId;
  private readonly native: Spec;

  constructor(params: { endpointId: EndpointId; native: Spec }) {
    super();
    this.endpointId = params.endpointId;
    this.native = params.native;
  }

  protected getEntityData(id: VideoStreamId): RemoteVideoStreamData | null {
    return this.native.hasVideoStreamForEndpoint(this.endpointId, id)
      ? { id }
      : null;
  }

  protected getEntityDataList(): RemoteVideoStreamData[] {
    return this.native
      .getVideoStreamsForEndpoint(this.endpointId)
      .map((id) => ({ id }));
  }

  protected sourceHas(streamId: VideoStreamId): boolean {
    return this.native.hasVideoStreamForEndpoint(this.endpointId, streamId);
  }

  protected createEntity(data: RemoteVideoStreamData): RemoteVideoStream {
    return new RemoteVideoStreamImpl(data);
  }
}
