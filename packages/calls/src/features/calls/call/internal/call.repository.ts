import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../specs/calls.native-spec';
import { CallImpl, type CallData } from '../call';
import type { Call, CallId, CallSettings } from '../call.types';
import { callSettingsToDTO } from './call.dto';

/**
 * @hidden
 */
export class CallRepository extends Repository<Call, CallData, CallId> {
  private readonly native: Spec;

  constructor(native: Spec) {
    super();
    this.native = native;
  }

  protected getEntityData(id: CallId): CallData | null {
    return this.native.hasCall(id) ? { id } : null;
  }

  protected getEntityDataList(): CallData[] {
    return this.native.getCalls().map((id) => ({ id }));
  }

  protected sourceHas(id: CallId): boolean {
    return this.native.hasCall(id);
  }

  protected createEntity(data: CallData): Call {
    return new CallImpl(data);
  }

  public create(destination: string, settings?: CallSettings): Call | null {
    const settingsToUse = settings ? callSettingsToDTO(settings) : null;
    const id = this.native.createCall(destination, settingsToUse);

    if (id === null) return null;

    return this.store({ id });
  }

  public storeCall(id: CallId): Call {
    return this.store({ id });
  }
}
