import type { VideoStreamId } from '../../../../video';
import type { BaseEndpointEventPayload } from '../endpoint.events';

/**
 * @hidden
 */
export interface EndpointMuteStateChangedInternalPayload
  extends BaseEndpointEventPayload {
  isMuted: boolean;
}

/**
 * @hidden
 */
export interface EndpointVoiceActivityChangedInternalPayload
  extends BaseEndpointEventPayload {
  isVoiceActivityDetected: boolean;
}

/**
 * @hidden
 */
export interface EndpointRemoteVideoStreamAddedInternalPayload
  extends BaseEndpointEventPayload {
  streamId: VideoStreamId;
}
/**
 * @hidden
 */
export interface EndpointRemoteVideoStreamRemovedInternalPayload
  extends BaseEndpointEventPayload {
  streamId: VideoStreamId;
}
