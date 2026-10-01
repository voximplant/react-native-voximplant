import type { ViewProps } from 'react-native';
import type { VideoRenderScaleType } from '..';
import RNVIVideoView from '../../../specs/generated/VideoViewNativeComponent';
import type { VideoStreamId } from '../stream';

/**
 * @internal
 */
export interface VideoViewProps extends ViewProps {
  /**
   * Video stream id that is rendered to the video view.
   */
  streamId: VideoStreamId;

  /**
   * Video render scale type.
   */
  scaleType: VideoRenderScaleType;
}

/**
 * React component to render video streams.
 *
 * @folder Video
 * @interface
 */
export const VideoView: React.FC<VideoViewProps> = ({
  streamId,
  scaleType,
  ...props
}) => {
  return <RNVIVideoView streamId={streamId} scaleType={scaleType} {...props} />;
};
