import type { VideoStreamId } from '../../../video';
import type { BaseCallEventPayload } from '../call.events';

/**
 * @hidden
 */
export interface CallRemoteVideoStreamAddedInternalPayload
  extends BaseCallEventPayload {
  streamId: VideoStreamId;
}

/**
 * @hidden
 */
export interface CallRemoteVideoStreamRemovedInternalPayload
  extends BaseCallEventPayload {
  streamId: VideoStreamId;
}
