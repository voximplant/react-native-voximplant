import {
  createReadonlyWatchable,
  generateUUID,
  updateReadonlyWatchableValue,
  type ReadonlyWatchable,
} from '@voximplant/react-native-shared';
import NativeAudio from '../../../specs/audio.native-spec';
import {
  AudioDeviceRepository,
  toAudioDeviceError,
  type AudioDevice,
  type AudioDeviceType,
} from '../audioDevice';

/**
 * Audio device manager for managing audio devices.
 *
 * @folder Audio
 * @hideconstructor
 */
export abstract class AudioDeviceManager {
  private static instance: AudioDeviceManager | null = null;

  public static getInstance(): AudioDeviceManager {
    if (!AudioDeviceManager.instance) {
      AudioDeviceManager.instance = new AudioDeviceManagerImpl();
    }
    return AudioDeviceManager.instance;
  }

  protected constructor() {}

  /**
   * Watchable property that allows getting the list of audio devices and observing its changes.
   */
  abstract readonly devices: ReadonlyWatchable<AudioDevice[]>;

  /**
   * Watchable property that allows getting the selected audio device and observing its changes.
   */
  abstract readonly selectedDevice: ReadonlyWatchable<AudioDevice | null>;

  /**
   * Selects an audio device.
   *
   * @param device Audio device to select.
   * @throws
   * - [Core.Audio.AudioDeviceErrors.AudioDeviceNotFoundError] If the audio device is not in the current audio device list
   * - [Core.Audio.AudioDeviceErrors.AudioDeviceAlreadyActiveError] If the audio device is already in use
   * - [Core.Audio.AudioDeviceErrors.AudioDeviceUnsupportedError] If the audio device is unsupported
   */
  abstract selectDevice(device: AudioDevice): Promise<void>;

  /**
   * Sets the default audio device type.
   *
   * @param deviceType Default audio device type.
   * @android
   */
  abstract setDefaultDeviceType(deviceType: AudioDeviceType): void;

  /**
   * Called when the call kit provider activates the audio session.
   *
   * @ios
   */
  abstract callKitProviderDidActivateAudioSession(): void;

  /**
   * Called when the call kit provider deactivates the audio session.
   *
   * @ios
   */
  abstract callKitProviderDidDeactivateAudioSession(): void;
}

const watchableKey = generateUUID();

/**
 * @hidden
 */
class AudioDeviceManagerImpl extends AudioDeviceManager {
  public readonly devices: ReadonlyWatchable<AudioDevice[]>;
  public readonly selectedDevice: ReadonlyWatchable<AudioDevice | null>;

  private readonly repository: AudioDeviceRepository;

  constructor() {
    super();

    this.repository = new AudioDeviceRepository(NativeAudio);

    this.devices = createReadonlyWatchable(
      this.repository.getList(),
      watchableKey
    );

    this.selectedDevice = createReadonlyWatchable(
      this.repository.getSelectedDevice(),
      watchableKey
    );

    this.bridgeNativeEvents();
  }

  public async selectDevice(device: AudioDevice): Promise<void> {
    try {
      await NativeAudio.selectDevice(device);
    } catch (err) {
      throw toAudioDeviceError(err);
    }
  }

  public setDefaultDeviceType(deviceType: AudioDeviceType): void {
    return NativeAudio.setDefaultDeviceType(deviceType);
  }

  public callKitProviderDidActivateAudioSession(): void {
    return NativeAudio.callKitProviderDidActivateAudioSession();
  }

  public callKitProviderDidDeactivateAudioSession(): void {
    return NativeAudio.callKitProviderDidDeactivateAudioSession();
  }

  private bridgeNativeEvents(): void {
    NativeAudio.onAudioDeviceChanged((device) => {
      const synced = this.repository.syncDevice(device);
      updateReadonlyWatchableValue(this.selectedDevice, synced, watchableKey);
    });

    NativeAudio.onAudioDeviceListChanged((devices) => {
      const syncedList = this.repository.syncDeviceList(devices);
      updateReadonlyWatchableValue(this.devices, syncedList, watchableKey);
    });
  }
}
