import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../../specs/calls.native-spec';
import type { ConferenceId } from '../../conference.types';
import { EndpointImpl, type EndpointData } from '../endpoint';
import type { Endpoint, EndpointId } from '../endpoint.types';

export class EndpointRepository extends Repository<
  Endpoint,
  EndpointData,
  EndpointId
> {
  private readonly conferenceId: ConferenceId;
  private readonly native: Spec;

  constructor(params: { conferenceId: ConferenceId; native: Spec }) {
    super();

    this.conferenceId = params.conferenceId;
    this.native = params.native;
  }

  protected getEntityData(id: EndpointId): EndpointData | null {
    return this.native.hasEndpointForConference(this.conferenceId, id)
      ? { id }
      : null;
  }

  protected getEntityDataList(): EndpointData[] {
    return this.native
      .getEndpointsForConference(this.conferenceId)
      .map((id) => ({ id }));
  }

  protected sourceHas(id: EndpointId): boolean {
    return this.native.hasEndpointForConference(this.conferenceId, id);
  }

  protected createEntity(data: EndpointData): Endpoint {
    return new EndpointImpl(data);
  }
}
