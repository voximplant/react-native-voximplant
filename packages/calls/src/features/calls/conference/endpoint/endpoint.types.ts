import type {
  AddEventListener,
  ListenerOptions,
  ReadonlyWatchable,
  RemoveEventListener,
} from '@voximplant/react-native-shared';
import type { RemoteAudioStream } from '../../../audio';
import type {
  RemoteVideoStream,
  VideoResolution,
  VideoStreamId,
} from '../../../video';
import type { AnyEndpointEvent, EndpointEvent } from './endpoint.events';

/**
 * @hidden
 */
export type EndpointId = string;

/**
 * Interface that represents a remote participant in a conference.
 *
 * @folder Conference
 */
export interface Endpoint {
  /**
   * Endpoint id
   */
  readonly id: EndpointId;

  /**
   * Endpoint user display name
   */
  readonly displayName: string | null;

  /**
   * Endpoint user name
   */
  readonly username: string | null;

  /**
   * Endpoint SIP URI
   */
  readonly sipUri: string | null;

  /**
   * Watchable property that allows getting the remote participant mute status and observing its changes
   */
  readonly isMuted: ReadonlyWatchable<boolean>;

  /**
   * Watchable property that allows getting the voice activity status of the remote participant and observing its changes
   */
  readonly isVoiceActivityDetected: ReadonlyWatchable<boolean>;

  /**
   * Watchable property that allows getting the remote audio streams associated with the endpoint and observing its changes
   */
  readonly audioStreams: ReadonlyWatchable<readonly RemoteAudioStream[]>;

  /**
   * Watchable property that allows getting the remote video streams associated with the endpoint and observing its changes
   */
  readonly videoStreams: ReadonlyWatchable<readonly RemoteVideoStream[]>;

  /**
   * Requests the specified video size for a remote video stream.
   *
   * The stream resolution may be changed to the closest to the specified width and height.
   *
   * It only makes an impact if the endpoint has enabled the simulcast feature.
   *
   * @param streamId Remote video stream id
   * @param size Requested video frame width and height
   * @throws [Calls.CallErrors.CallInvalidArgumentError] If the video stream is not found or the requested width or height is not positive
   */
  requestVideoSize: (streamId: string, size: VideoResolution) => Promise<void>;

  /**
   * Starts receiving video from the specified remote video stream.
   *
   * If video is already being received, this method call is ignored.
   *
   * If the request is processed successfully, the [Calls.Conference.EndpointEvents.EndpointStartReceivingVideoStream] event is triggered.
   *
   * @param streamId Remote video stream id
   */
  startReceivingVideo: (streamId: VideoStreamId) => void;

  /**
   * Stops receiving video from the specified remote video stream.
   *
   * If the request is processed successfully, the [Calls.Conference.EndpointEvents.EndpointStopReceivingVideoStream] event is triggered
   * with the [Calls.Conference.EndpointEvents.VideoStreamReceiveStopReason.Manual] reason.
   *
   * @param streamId Remote video stream id
   */
  stopReceivingVideo: (streamId: VideoStreamId) => void;

  /**
   * @reinterpret Calls.DocEndpointAddEventListener
   */
  addEventListener: AddEventListener<AnyEndpointEvent>;

  /**
   * @reinterpret Calls.DocEndpointRemoveEventListener
   */
  removeEventListener: RemoveEventListener<AnyEndpointEvent>;
}

/**
 * @interface
 * @internal
 *
 * Registers a handler for the specified event.
 *
 * One event can have more than one handler; handlers are executed in order of their registration.
 */
export type DocEndpointAddEventListener = (
  /**
   * Event name
   */
  eventName: EndpointEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyEndpointEvent) => void | Promise<void>,
  /**
   * Object that specifies characteristics about the event listener
   */
  options: ListenerOptions
) => void;

/**
 * @interface
 * @internal
 *
 * Removes a previously registered handler for the specified event.
 */
export type DocEndpointRemoveEventListener = (
  /**
   * Event name
   */
  eventName: EndpointEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyEndpointEvent) => void | Promise<void>
) => void;
