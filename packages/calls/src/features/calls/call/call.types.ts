import type {
  AddEventListener,
  ExtraHeaders,
  ListenerOptions,
  ReadonlyWatchable,
  RemoveEventListener,
} from '@voximplant/react-native-shared';
import type {
  LocalVideoStream,
  RemoteVideoStream,
  VideoCodec,
} from '../../video';
import type { AnyCallEvent, CallEvent } from './call.events';

/**
 * @hidden
 */
export type CallId = string;

/**
 * Enum that represents call directions.
 *
 * @folder Call
 */
export enum CallDirection {
  /**
   * Incoming call
   */
  Incoming = 'INCOMING',
  /**
   * Outgoing call
   */
  Outgoing = 'OUTGOING',
}

/**
 * Enum that contains the states of a call.
 *
 * @folder Call
 */
export enum CallState {
  /**
   * Call has been created
   */
  Created = 'CREATED',
  /**
   * Call is connecting
   */
  Connecting = 'CONNECTING',
  /**
   * Call is connected
   */
  Connected = 'CONNECTED',
  /**
   * Call is reconnecting after a failure
   */
  Reconnecting = 'RECONNECTING',
  /**
   * Call is disconnecting
   */
  Disconnecting = 'DISCONNECTING',
  /**
   * Call has been disconnected
   */
  Disconnected = 'DISCONNECTED',
  /**
   * Call failed
   */
  Failed = 'FAILED',
}

/**
 * Call settings with additional call parameters, such as the preferred video codec, custom data, extra headers, etc.
 *
 * @folder Call
 */
export interface CallSettings {
  /**
   * Custom string associated with a call session.
   *
   * It can be passed to the cloud to be obtained from the [CallAlerting](/docs/references/voxengine/appevents#callalerting)
   * event or [Call History](/docs/references/httpapi/history#getcallhistory) via Management API.
   *
   * Maximum size is 200 bytes.
   *
   * Use the [Calls.Call.Call.sendMessage] method to pass a string over the limit; in order to pass a large data use
   * [media_session_access_url](/docs/references/httpapi/scenarios#startscenarios) on your backend.
   */
  customData?: string;

  /**
   * Optional set of headers to be sent to the Voximplant cloud. Names should begin with “X-” to be processed by SDK.
   */
  extraHeaders?: ExtraHeaders;

  /**
   * Local video stream to be sent to a call
   */
  localVideoStream?: LocalVideoStream;

  /**
   * Whether audio is muted in a call
   */
  muteAudio?: boolean;

  /**
   * Preferred video codec for a particular call that these settings are applied to.
   *
   * The default value is [Calls.Video.VideoCodec.Auto].
   */
  preferredVideoCodec?: VideoCodec;

  /**
   * Whether video receiving is enabled in a call.
   *
   * The default value is false.
   *
   * If the call is started without video and the user enables video in an active call
   * via the [Calls.Call.Call.startSendingVideo] API, enables video receiving.
   */
  receiveVideo?: boolean;

  /**
   * Call statistics collection interval in milliseconds.
   *
   * The default value is 1000.
   *
   * The interval value should be multiple of 500, otherwise the provided value is rounded to a less value that is multiple of 500.
   */
  statsCollectionInterval?: number;

  /**
   * Whether the CallKit integration is enabled for a call
   *
   * @ios
   */
  callKitSupport?: boolean;
}

/**
 * Enum that contains the call rejection reasons.
 *
 * @folder Call
 */
export enum RejectMode {
  /**
   * Call line is busy.
   */
  Busy = 'BUSY',
  /**
   * Call has been declined.
   */
  Decline = 'DECLINE',
}

/**
 * Interface that represents a call and provides the API to manage it.
 *
 * @folder Call
 */
export interface Call {
  /**
   * Call id
   */
  readonly id: CallId;
  /**
   * Call direction
   */
  readonly direction: CallDirection;
  /**
   * Call duration in milliseconds
   */
  readonly duration: number;

  /**
   * Watchable property that allows getting the current call state and observing its changes
   */
  readonly state: ReadonlyWatchable<CallState>;
  /**
   * Watchable property that allows getting the audio mute status and observing its changes
   */
  readonly isMuted: ReadonlyWatchable<boolean>;
  /**
   * Watchable property that allows getting whether the call is on hold
   */
  readonly isOnHold: ReadonlyWatchable<boolean>;
  /**
   * Watchable property that allows getting the array of the local video streams that are currently being sent
   */
  readonly localVideoStreams: ReadonlyWatchable<LocalVideoStream[]>;
  /**
   * Watchable property that allows getting the array of the remote video streams that are currently being received
   */
  readonly remoteVideoStreams: ReadonlyWatchable<RemoteVideoStream[]>;
  /**
   * Watchable property that allows getting the call participant user display name and observing its changes.
   *
   * Null for outgoing calls until the [Calls.Call.CallEvents.CallEvent.Connected] event is triggered.
   */
  readonly remoteDisplayName: ReadonlyWatchable<string | null>;

  /**
   * Watchable property that allows getting the call participant username and observing its changes
   */
  readonly remoteUsername: ReadonlyWatchable<string | null>;

  /**
   * Starts an outgoing call.
   *
   * You should subscribe to [Calls.Call.CallEvents.CallEvent.Connected] to be
   * notified that the call is established.
   *
   * @throws
   * - [Calls.CallErrors.CallIncorrectOperationError] If the call is already started or the method is called for an incoming call
   * - [Calls.CallErrors.CallPermissionRequiredError] If microphone permission is not granted, or camera permission is not granted for a video call
   */
  start: () => void;

  /**
   * Answers an incoming call.
   *
   * You should subscribe to [Calls.Call.CallEvents.CallEvent.Connected] to be
   * notified that the call is established.
   *
   * @param settings Call settings with additional call parameters, such as the preferred video codec, custom data, extra headers, etc.
   * @throws
   * - [Calls.CallErrors.CallIncorrectOperationError] If the call is already answered or the method is called for an outgoing call
   * - [Calls.CallErrors.CallPermissionRequiredError] If microphone permission is not granted
   */
  answer: (settings?: CallSettings) => void;

  /**
   * Terminates the call.
   *
   * @param headers Optional set of headers to be sent. Names should begin with “X-” to be processed by the SDK.
   */
  hangup: (headers?: ExtraHeaders) => void;

  /**
   * Rejects an incoming call.
   *
   * @param mode Call rejection mode
   * @param headers Optional set of headers to be sent. Names should begin with “X-” to be processed by the SDK.
   * @throws [Calls.CallErrors.CallIncorrectOperationError] If the call is already answered or ended, or the method is called for an outgoing call
   */
  reject: (mode: RejectMode, headers?: ExtraHeaders) => void;

  /**
   * Mutes or unmutes the audio in a call.
   *
   * @param value Whether audio is muted in a call
   */
  mute: (value: boolean) => void;

  /**
   * Sends DTMF(s) within the call.
   *
   * @param tones DTMF(s)
   */
  sendDTMF: (tones: string) => void;

  /**
   * Sends a message within the call.
   *
   * Implemented atop of SIP INFO for communication between the call endpoint and the Voximplant Cloud, and is separated
   * from Voximplant messaging API.
   * @param text Message text
   */
  sendMessage: (text: string) => void;

  /**
   * Sends an INFO message within the call.
   *
   * @param mimeType MIME type of the info
   * @param body Custom string data
   * @param headers Optional set of headers to be sent with the message. Names should begin with “X-” to be processed by the SDK.
   */
  sendInfo: (mimeType: string, body: string, headers?: ExtraHeaders) => void;

  /**
   * Holds or unholds the call.
   *
   * Returns a promise that is resolved when the operation is completed.
   *
   * @param enable Whether to hold or unhold the call
   * @throws
   * - [Calls.CallErrors.CallInvalidCallStateError] If the call is not connected
   * - [Calls.CallErrors.CallAlreadyInThisStateError] If the call is already in the requested hold state
   * - [Calls.CallErrors.CallRejectedError] If the operation is rejected
   */
  hold: (enable: boolean) => Promise<void>;

  /**
   * Starts sending video in the call.
   *
   * Returns a promise that is resolved when the operation is completed.
   *
   * @param stream Local video stream to be sent
   * @throws
   * - [Calls.CallErrors.CallInvalidCallStateError] If the call is not connected
   * - [Calls.CallErrors.CallAlreadyInThisStateError] If the call is already sending this video stream
   * - [Calls.CallErrors.CallMediaIsOnHoldError] If the call is on hold
   * - [Calls.CallErrors.CallPermissionRequiredError] If camera permission is not granted
   * - [Calls.CallErrors.CallCameraNotFoundError] If the camera is not found
   * - [Calls.CallErrors.CallRejectedError] If the operation is rejected
   */
  startSendingVideo: (stream: LocalVideoStream) => Promise<void>;

  /**
   * Stops sending video in the call.
   *
   * Returns a promise that is resolved when the operation is completed.
   *
   * @throws
   * - [Calls.CallErrors.CallInvalidCallStateError] If the call is not connected
   * - [Calls.CallErrors.CallAlreadyInThisStateError] If the call is not sending video
   * - [Calls.CallErrors.CallMediaIsOnHoldError] If the call is on hold
   * - [Calls.CallErrors.CallRejectedError] If the operation is rejected
   */
  stopSendingVideo: () => Promise<void>;

  /**
   * @reinterpret Calls.DocCallAddEventListener
   */
  addEventListener: AddEventListener<AnyCallEvent>;

  /**
   * @reinterpret Calls.DocCallRemoveEventListener
   */
  removeEventListener: RemoveEventListener<AnyCallEvent>;
}

/**
 * @interface
 * @internal
 *
 * Registers a handler for the specified event.
 *
 * One event can have more than one handler; handlers are executed in order of their registration.
 */
export type DocCallAddEventListener = (
  /**
   * Event name
   */
  eventName: CallEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyCallEvent) => void | Promise<void>,
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
export type DocCallRemoveEventListener = (
  /**
   * Event name
   */
  eventName: CallEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyCallEvent) => void | Promise<void>
) => void;
