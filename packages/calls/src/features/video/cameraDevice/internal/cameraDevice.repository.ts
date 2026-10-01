import { Repository } from '@voximplant/react-native-shared';
import type { Spec } from '../../../../specs/video.native-spec';
import { CameraDeviceImpl } from '../cameraDevice';
import type { CameraDevice } from '../cameraDevice.types';

export class CameraDeviceRepository extends Repository<
  CameraDevice,
  CameraDevice,
  string
> {
  private readonly native: Spec;

  constructor(native: Spec) {
    super();
    this.native = native;
  }

  protected getEntityData(id: string): CameraDevice | null {
    return this.native.getDevice(id);
  }

  protected getEntityDataList(): CameraDevice[] {
    return this.native.getDevices();
  }

  protected sourceHas(id: string): boolean {
    return this.native.hasDevice(id);
  }

  protected createEntity(data: CameraDevice): CameraDevice {
    return new CameraDeviceImpl(data);
  }

  public getSelectedDevice(): CameraDevice | null {
    const device = this.native.getSelectedDevice();
    if (!device) return null;

    return this.store(device);
  }

  public async selectDevice(device: CameraDevice): Promise<CameraDevice> {
    await this.native.selectDevice(device);

    return this.store(device);
  }
}
