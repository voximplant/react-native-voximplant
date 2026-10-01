import type {
  AddEventListener,
  ExtraHeaders,
  ListenerOptions,
  ReadonlyWatchable,
  RemoveEventListener,
} from '@voximplant/react-native-shared';
import type { LocalVideoStream, VideoCodec } from '../../video';
import type { AnyConferenceEvent, ConferenceEvent } from './conference.events';
import type { Endpoint } from './endpoint';

/**
 * @hidden
 */
export type ConferenceId = string;

/**
 * Enum that contains the states of a conference.
 *
 * @folder Conference
 */
export enum ConferenceState {
  /**
   * Conference has been created.
   */
  Created = 'CREATED',
  /**
   * Conference is connecting.
   */
  Connecting = 'CONNECTING',
  /**
   * Conference is connected.
   */
  Connected = 'CONNECTED',
  /**
   * Conference is reconnecting after a failure.
   */
  Reconnecting = 'RECONNECTING',
  /**
   * Conference is disconnecting.
   */
  Disconnecting = 'DISCONNECTING',
  /**
   * Conference has been disconnected.
   */
  Disconnected = 'DISCONNECTED',
  /**
   * Conference failed.
   */
  Failed = 'FAILED',
}

/**
 * Conference settings with additional conference parameters, such as the preferred video codec, custom data, extra headers, etc.
 *
 * @folder Conference
 */
export interface ConferenceSettings {
  /**
   * Custom string associated with a conference session.
   *
   * It can be passed to the cloud to be obtained from the [CallAlerting](/docs/references/voxengine/appevents#callalerting)
   * event or [Call History](/docs/references/httpapi/history#getcallhistory) via Management API.
   *
   * Maximum size is 200 bytes.
   *
   * Use the [Calls.Conference.Conference.sendMessage] method to pass a string over the limit; in order to pass a large data use
   * [media_session_access_url](/docs/references/httpapi/scenarios#startscenarios) on your backend.
   */
  customData?: string;

  /**
   * Optional set of headers to be sent to the Voximplant cloud. Names should begin with “X-” to be processed by SDK.
   */
  extraHeaders?: ExtraHeaders;

  /**
   * Local video stream to be sent to a conference
   */
  localVideoStream?: LocalVideoStream;

  /**
   * Whether the audio should be muted when the user joins a conference
   */
  muteAudio?: boolean;

  /**
   * Preferred video codec for a particular conference that these settings are applied to.
   *
   * The default value is [Calls.Video.VideoCodec.Auto].
   */
  preferredVideoCodec?: VideoCodec;

  /**
   * Conference statistics collection interval in milliseconds.
   *
   * The default value is 1000.
   *
   * The interval value should be multiple of 500, otherwise the provided value is rounded to a less value that is multiple of 500.
   *
   * To receive the [Calls.Conference.ConferenceEvents.ConferenceStatsReceived] event, set this interval when joining or creating a conference.
   */
  statsCollectionInterval?: number;
}

/**
 * Interface that represents a conference and provides the API to manage it.
 *
 * @folder Conference
 */
export interface Conference {
  /**
   * Conference id
   */
  readonly id: ConferenceId;
  /**
   * Conference duration in milliseconds
   */
  readonly duration: number;

  /**
   * Watchable property that allows getting the current conference state and observing its changes
   */
  readonly state: ReadonlyWatchable<ConferenceState>;

  /**
   * Watchable property that allows getting the conference endpoint id of this client and observing its changes
   */
  readonly endpointId: ReadonlyWatchable<string | null>;

  /**
   * Watchable property that allows getting the voice activity status of the current user and observing its changes
   */
  readonly isVoiceActivityDetected: ReadonlyWatchable<boolean>;

  /**
   * Watchable property that allows getting the audio mute status and observing its changes
   */
  readonly isMuted: ReadonlyWatchable<boolean>;

  /**
   * Watchable property that allows getting the local video streams that are currently being sent and observing its changes
   */
  readonly localVideoStreams: ReadonlyWatchable<LocalVideoStream[]>;

  /**
   * Watchable property that allows getting the endpoints associated with the conference and observing its changes
   */
  readonly endpoints: ReadonlyWatchable<Endpoint[]>;

  /**
   * Joins a conference.
   *
   * Does not mean that the conference is connected. Subscribe to [Calls.Conference.ConferenceEvents.ConferenceConnected]
   * to be notified that the current user has joined the conference.
   *
   * @param headers Optional set of headers to be sent. Names should begin with “X-” to be processed by the SDK.
   * @throws
   * - [Calls.CallErrors.CallIncorrectOperationError] If the conference is already started
   * - [Calls.CallErrors.CallPermissionRequiredError] If microphone permission is not granted
   */
  join: (headers?: ExtraHeaders) => void;

  /**
   * Terminates the conference on the current user.
   *
   * @param headers Optional set of headers to be sent. Names should begin with “X-” to be processed by the SDK.
   */
  hangup: (headers?: ExtraHeaders) => void;

  /**
   * Sets the audio mute status in the conference.
   *
   * @param value Whether audio should be muted
   */
  mute: (value: boolean) => void;

  /**
   * Sends a message within the conference.
   *
   * Implemented atop of SIP INFO for communication between the conference endpoint and the Voximplant Cloud,
   * and is separated from Voximplant messaging API.
   *
   * @param text Message text
   */
  sendMessage: (text: string) => void;

  /**
   * Sends an INFO message within the conference.
   *
   * @param mimeType MIME type of the info
   * @param body Custom string data
   * @param headers Optional set of headers to be sent with the message. Names should begin with “X-” to be processed by the SDK.
   */
  sendInfo: (mimeType: string, body: string, headers?: ExtraHeaders) => void;

  /**
   * Starts sending a local video stream to the conference.
   *
   * Returns a promise that is resolved when the operation is completed.
   *
   * @param stream Local video stream
   * @throws
   * - [Calls.CallErrors.CallInvalidCallStateError] If the conference is not connected
   * - [Calls.CallErrors.CallIncorrectOperationError] If the conference is already sending a video stream
   * - [Calls.CallErrors.CallPermissionRequiredError] If camera permission is not granted
   * - [Calls.CallErrors.CallCameraNotFoundError] If the camera is not found
   * - [Calls.CallErrors.CallRejectedError] If the operation is rejected
   */
  startSendingVideo: (stream: LocalVideoStream) => Promise<void>;

  /**
   * Stops sending local video to the conference.
   *
   * Returns a promise that is resolved when the operation is completed.
   *
   * @throws
   * - [Calls.CallErrors.CallInvalidCallStateError] If the conference is not connected
   * - [Calls.CallErrors.CallAlreadyInThisStateError] If the conference is not sending video
   * - [Calls.CallErrors.CallRejectedError] If the operation is rejected
   */
  stopSendingVideo: () => Promise<void>;

  /**
   * @reinterpret Calls.DocConferenceAddEventListener
   */
  addEventListener: AddEventListener<AnyConferenceEvent>;

  /**
   * @reinterpret Calls.DocConferenceRemoveEventListener
   */
  removeEventListener: RemoveEventListener<AnyConferenceEvent>;
}

/**
 * @interface
 * @internal
 *
 * Registers a handler for the specified event.
 *
 * One event can have more than one handler; handlers are executed in order of their registration.
 */
export type DocConferenceAddEventListener = (
  /**
   * Event name
   */
  eventName: ConferenceEvent,
  /**
   * Handler function that is triggered when an event of the specified type occurs
   */
  listener: (event: AnyConferenceEvent) => void | Promise<void>,
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
export type DocConferenceRemoveEventListener = (
  /**
   * Event name
   */
  eventName: ConferenceEvent,
  /**
   * Handler function to remove from the event target
   */
  listener: (event: AnyConferenceEvent) => void | Promise<void>
) => void;
