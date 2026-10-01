import type { RemoteVideoStream, VideoStreamId } from '../../../video';
import type { EndpointId } from './endpoint.types';

/**
 * @folder Conference.EndpointEvents
 */
export enum EndpointEvent {
  /**
   * Triggered after an endpoint has added a remote video stream.
   *
   * Listener is called with [Calls.Conference.EndpointEvents.EndpointRemoteVideoStreamAdded] and payload:
   * @cast Calls.Conference.EndpointEvents.EndpointRemoteVideoStreamAddedPayload
   */
  RemoteVideoStreamAdded = 'REMOTE_VIDEO_STREAM_ADDED',

  /**
   * Triggered after an endpoint has removed a remote video stream.
   *
   * Listener is called with [Calls.Conference.EndpointEvents.EndpointRemoteVideoStreamRemoved] and payload:
   * @cast Calls.Conference.EndpointEvents.EndpointRemoteVideoStreamRemovedPayload
   */
  RemoteVideoStreamRemoved = 'REMOTE_VIDEO_STREAM_REMOVED',

  /**
   * Triggered when receiving video on a remote video stream is started after previously being stopped.
   *
   * The event is triggered if:
   * - [Calls.Conference.Endpoint.startReceivingVideo] has been called and the request has been processed successfully.
   * - A network issue that caused the Voximplant Cloud to stop receiving video of the remote video stream is gone.
   *
   * Listener is called with [Calls.Conference.EndpointEvents.EndpointStartReceivingVideoStream] and payload:
   * @cast Calls.Conference.EndpointEvents.EndpointStartReceivingVideoStreamPayload
   */
  StartReceivingVideoStream = 'START_RECEIVING_VIDEO_STREAM',

  /**
   * Triggered when receiving video on a remote video stream is stopped.
   *
   * Receiving video on a remote video stream can be stopped due to:
   * - [Calls.Conference.Endpoint.stopReceivingVideo] has been called and the request has been processed successfully.
   *   In this case the value of the “reason” parameter is [Calls.Conference.EndpointEvents.VideoStreamReceiveStopReason.Manual].
   * - Voximplant Cloud has detected a network issue on the client and automatically stopped the video.
   *   In this case the value of the “reason” parameter is [Calls.Conference.EndpointEvents.VideoStreamReceiveStopReason.Automatic].
   *
   * If receiving video is disabled automatically, it may be automatically enabled as soon as the network condition
   * on the device is good and there is enough bandwidth to receive the video on this remote video stream.
   * In this case [Calls.Conference.EndpointEvents.EndpointStartReceivingVideoStream] event is triggered.
   *
   * Listener is called with [Calls.Conference.EndpointEvents.EndpointStopReceivingVideoStream] and payload:
   * @cast Calls.Conference.EndpointEvents.EndpointStopReceivingVideoStreamPayload
   */
  StopReceivingVideoStream = 'STOP_RECEIVING_VIDEO_STREAM',
}

/**
 * Enum that contains reasons why receiving video on a remote video stream was stopped.
 *
 * @folder Conference.EndpointEvents
 */
export enum VideoStreamReceiveStopReason {
  /**
   * Receiving video was stopped automatically by the Voximplant Cloud due to a network
   * or bandwidth issue on the device.
   */
  Automatic = 'AUTOMATIC',

  /**
   * Receiving video was stopped by the client via [Calls.Conference.Endpoint.stopReceivingVideo].
   */
  Manual = 'MANUAL',
}

/**
 * @hidden
 */
export interface BaseEndpointEventPayload {
  /**
   * Endpoint id.
   */
  endpointId: EndpointId;
}

/**
 * @hidden
 */
export type BaseEndpointEvent<
  Name extends EndpointEvent,
  Payload extends BaseEndpointEventPayload = BaseEndpointEventPayload
> = {
  name: Name;
  payload: Payload;
};

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointRemoteVideoStreamAddedPayload
  extends BaseEndpointEventPayload {
  /**
   * Remote video stream
   */
  stream: RemoteVideoStream;
}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointRemoteVideoStreamAdded
  extends BaseEndpointEvent<
    EndpointEvent.RemoteVideoStreamAdded,
    EndpointRemoteVideoStreamAddedPayload
  > {}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointRemoteVideoStreamRemovedPayload
  extends BaseEndpointEventPayload {
  /**
   * Remote video stream
   */
  stream: RemoteVideoStream;
}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointRemoteVideoStreamRemoved
  extends BaseEndpointEvent<
    EndpointEvent.RemoteVideoStreamRemoved,
    EndpointRemoteVideoStreamRemovedPayload
  > {}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointStartReceivingVideoStreamPayload
  extends BaseEndpointEventPayload {
  /**
   * Remote video stream id
   */
  streamId: VideoStreamId;
}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointStartReceivingVideoStream
  extends BaseEndpointEvent<
    EndpointEvent.StartReceivingVideoStream,
    EndpointStartReceivingVideoStreamPayload
  > {}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointStopReceivingVideoStreamPayload
  extends BaseEndpointEventPayload {
  /**
   * Remote video stream id
   */
  streamId: VideoStreamId;
  /**
   * Reason why video receiving was stopped
   */
  reason: VideoStreamReceiveStopReason;
}

/**
 * @folder Conference.EndpointEvents
 */
export interface EndpointStopReceivingVideoStream
  extends BaseEndpointEvent<
    EndpointEvent.StopReceivingVideoStream,
    EndpointStopReceivingVideoStreamPayload
  > {}

/**
 * @folder Conference.EndpointEvents
 */
export type AnyEndpointEvent =
  | EndpointRemoteVideoStreamAdded
  | EndpointRemoteVideoStreamRemoved
  | EndpointStartReceivingVideoStream
  | EndpointStopReceivingVideoStream;
