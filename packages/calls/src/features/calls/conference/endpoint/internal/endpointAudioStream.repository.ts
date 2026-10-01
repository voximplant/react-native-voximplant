import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../../specs/calls.native-spec';
import {
  RemoteAudioStreamImpl,
  type AudioStreamId,
  type RemoteAudioStream,
  type RemoteAudioStreamData,
} from '../../../../audio';
import type { EndpointId } from '../endpoint.types';

/**
 * @hidden
 */
export class EndpointAudioStreamRepository extends Repository<
  RemoteAudioStream,
  RemoteAudioStreamData,
  AudioStreamId
> {
  private readonly endpointId: EndpointId;
  private readonly native: Spec;

  constructor(params: { endpointId: EndpointId; native: Spec }) {
    super();

    this.endpointId = params.endpointId;
    this.native = params.native;
  }

  protected getEntityData(id: AudioStreamId): RemoteAudioStreamData | null {
    return this.native.hasAudioStreamForEndpoint(this.endpointId, id)
      ? { id }
      : null;
  }

  protected getEntityDataList(): RemoteAudioStreamData[] {
    return this.native
      .getAudioStreamsForEndpoint(this.endpointId)
      .map((id) => ({ id }));
  }

  protected sourceHas(streamId: AudioStreamId): boolean {
    return this.native.hasAudioStreamForEndpoint(this.endpointId, streamId);
  }

  protected createEntity(data: RemoteAudioStreamData): RemoteAudioStream {
    return new RemoteAudioStreamImpl(data);
  }
}
