import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';
import type { VideoRenderScaleType } from '../features/video';

export interface NativeProps extends ViewProps {
  streamId: string;
  scaleType: VideoRenderScaleType;
}

export default codegenNativeComponent<NativeProps>(
  'RNVIVideoView'
) as HostComponent<NativeProps>;
