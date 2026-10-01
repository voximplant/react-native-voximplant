import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../specs/audio.native-spec';
import { AudioDeviceImpl } from '../audioDevice';
import type { AudioDevice } from '../audioDevice.types';

/**
 * @hidden
 */
export class AudioDeviceRepository extends Repository<
  AudioDevice,
  AudioDevice,
  string
> {
  private readonly native: Spec;

  constructor(native: Spec) {
    super();
    this.native = native;
  }

  protected getEntityData(id: string): AudioDevice | null {
    return this.native.getDevice(id);
  }

  protected getEntityDataList(): AudioDevice[] {
    return this.native.getDevices();
  }

  protected sourceHas(id: string): boolean {
    return this.native.hasDevice(id);
  }

  protected createEntity(data: AudioDevice): AudioDevice {
    return new AudioDeviceImpl(data);
  }

  public getSelectedDevice(): AudioDevice | null {
    const device = this.native.getSelectedDevice();
    if (!device) return null;

    return this.store(device);
  }

  public syncDevice(device: AudioDevice): AudioDevice {
    return this.store(device);
  }

  public syncDeviceList(devices: readonly AudioDevice[]): AudioDevice[] {
    const idSet = new Set(devices.map((device) => device.id));

    for (const device of devices) {
      this.store(device);
    }

    for (const id of this.storage.keys()) {
      if (!idSet.has(id)) {
        this.remove(id);
      }
    }

    return Array.from(this.storage.values());
  }
}
