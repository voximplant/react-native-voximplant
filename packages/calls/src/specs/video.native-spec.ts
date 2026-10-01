import {
  resolveNativeModule,
  withLegacyEvents,
} from '@voximplant/react-native-shared';
import { type CodegenTypes, type TurboModule } from 'react-native';
import type {
  CameraDevice,
  CameraVideoSourceErrorCode,
  LocalVideoStreamDTO,
  PreferredResolutionDTO,
  VideoSource,
  VideoSourceStopReason,
  VideoStreamId,
} from '../features/video';

const MODULE_NAME = 'RNVIVideo';

export interface Spec extends TurboModule {
  getDevices: () => CameraDevice[];
  getDevice: (id: string) => CameraDevice | null;
  hasDevice: (id: string) => boolean;
  getSelectedDevice: () => CameraDevice | null;
  getPreferredResolution: () => PreferredResolutionDTO;
  selectDevice: (device: CameraDevice) => Promise<void>;
  setPreferredResolution: (preference: PreferredResolutionDTO) => void;

  getLocalStreams: () => LocalVideoStreamDTO[];
  getLocalStream: (streamId: VideoStreamId) => LocalVideoStreamDTO | null;
  createLocalStream: (source: VideoSource) => VideoStreamId | null;
  removeLocalStream: (streamId: VideoStreamId) => void;
  removeAllLocalStreams: () => void;

  readonly onStarted: CodegenTypes.EventEmitter<void>;
  readonly onStopped: CodegenTypes.EventEmitter<VideoSourceStopReason>;
  readonly onFailed: CodegenTypes.EventEmitter<{
    code: CameraVideoSourceErrorCode;
    message: string;
  }>;
}

const resolved = resolveNativeModule<Spec>(MODULE_NAME);
const NativeVideo = withLegacyEvents<Spec>(MODULE_NAME, resolved);

export default NativeVideo;
