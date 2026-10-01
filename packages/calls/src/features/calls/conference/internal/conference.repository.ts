import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../specs/calls.native-spec';
import { ConferenceImpl, type ConferenceData } from '../conference';
import type {
  Conference,
  ConferenceId,
  ConferenceSettings,
} from '../conference.types';
import { conferenceSettingsToDTO } from './conference.dto';

export class ConferenceRepository extends Repository<
  Conference,
  ConferenceData,
  ConferenceId
> {
  private readonly native: Spec;

  constructor(native: Spec) {
    super();
    this.native = native;
  }

  protected getEntityData(id: ConferenceId): ConferenceData | null {
    return this.native.hasConference(id) ? { id } : null;
  }

  protected getEntityDataList(): ConferenceData[] {
    return this.native.getConferences().map((id) => ({ id }));
  }

  protected sourceHas(id: ConferenceId): boolean {
    return this.native.hasConference(id);
  }

  protected createEntity(data: ConferenceData): Conference {
    return new ConferenceImpl(data);
  }

  public create(
    name: string,
    settings?: ConferenceSettings
  ): Conference | null {
    const settingsToUse = settings ? conferenceSettingsToDTO(settings) : null;
    const id = this.native.createConference(name, settingsToUse);
    if (id === null) return null;

    return this.store({ id });
  }
}
