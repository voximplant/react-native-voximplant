import {
  resolveNativeModule,
  withLegacyEvents,
} from '@voximplant/react-native-shared';
import { type CodegenTypes, type TurboModule } from 'react-native';
import type {
  AudioDevice,
  AudioDeviceType,
} from '../features/audio/audioDevice';

const MODULE_NAME = 'RNVIAudio';

export interface Spec extends TurboModule {
  getDevices: () => AudioDevice[];
  getDevice: (id: string) => AudioDevice | null;
  hasDevice: (id: string) => boolean;
  getSelectedDevice: () => AudioDevice | null;
  selectDevice: (device: AudioDevice) => Promise<void>;
  setDefaultDeviceType: (deviceType: AudioDeviceType) => void;
  callKitProviderDidActivateAudioSession: () => void;
  callKitProviderDidDeactivateAudioSession: () => void;

  readonly onAudioDeviceChanged: CodegenTypes.EventEmitter<AudioDevice>;
  readonly onAudioDeviceListChanged: CodegenTypes.EventEmitter<AudioDevice[]>;
}

const resolved = resolveNativeModule<Spec>(MODULE_NAME);
const NativeAudio = withLegacyEvents<Spec>(MODULE_NAME, resolved);

export default NativeAudio;
