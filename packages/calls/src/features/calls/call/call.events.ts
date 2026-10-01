import type { ExtraHeaders } from '@voximplant/react-native-shared';
import type {
  ConnectionStatsReport,
  LocalAudioStreamStatsReport,
  LocalVideoStreamStatsReport,
  RemoteAudioStreamStatsReport,
  RemoteVideoStreamStatsReport,
} from '../../stats';
import type { RemoteVideoStream } from '../../video';
import type { CallId } from './call.types';

/**
 * @folder Call.CallEvents
 * @event
 */
export enum CallEvent {
  /**
   * Triggered after a call has been successfully connected.
   *
   * Listener is called with [Calls.Call.CallEvents.CallConnected] and payload:
   * @cast Calls.Call.CallEvents.CallConnectedPayload
   */
  Connected = 'CONNECTED',

  /**
   * Triggered if a call has failed.
   *
   * Listener is called with [Calls.Call.CallEvents.CallFailed] and payload:
   * @cast Calls.Call.CallEvents.CallFailedPayload
   */
  Failed = 'FAILED',

  /**
   * Triggered after a call has been disconnected.
   *
   * Listener is called with [Calls.Call.CallEvents.CallDisconnected] and payload:
   * @cast Calls.Call.CallEvents.CallDisconnectedPayload
   */
  Disconnected = 'DISCONNECTED',

  /**
   * Triggered when the [Call.ring](/docs/references/voxengine/call#ring) method is called on the scenario side.
   *
   * Listener is called with [Calls.Call.CallEvents.CallStartRinging] and payload:
   * @cast Calls.Call.CallEvents.CallStartRingingPayload
   */
  StartRinging = 'START_RINGING',

  /**
   * Triggered when the [Call.answer](/docs/references/voxengine/call#answer) or
   * [Call.startEarlyMedia method](/docs/references/voxengine/call#startearlymedia) is called on the scenario side.
   *
   * Listener is called with [Calls.Call.CallEvents.CallStopRinging] and payload:
   * @cast Calls.Call.CallEvents.CallStopRingingPayload
   */
  StopRinging = 'STOP_RINGING',

  /**
   * Triggered when a message is received within a call.
   *
   * Listener is called with [Calls.Call.CallEvents.CallMessageReceived] and payload:
   * @cast Calls.Call.CallEvents.CallMessageReceivedPayload
   */
  MessageReceived = 'MESSAGE_RECEIVED',

  /**
   * Triggered when an INFO message is received within a call.
   *
   * Listener is called with [Calls.Call.CallEvents.CallInfoReceived] and payload:
   * @cast Calls.Call.CallEvents.CallInfoReceivedPayload
   */
  InfoReceived = 'INFO_RECEIVED',

  /**
   * Triggered when call statistics are available for a call.
   *
   * Listener is called with [Calls.Call.CallEvents.CallStatsReceived] and payload:
   * @cast Calls.Call.CallEvents.CallStatsReceivedPayload
   */
  StatsReceived = 'STATS_RECEIVED',

  /**
   * Triggered when another call participant has added a remote video stream to a call.
   *
   * Listener is called with [Calls.Call.CallEvents.CallRemoteVideoStreamAdded] and payload:
   * @cast Calls.Call.CallEvents.CallRemoteVideoStreamAddedPayload
   */
  RemoteVideoStreamAdded = 'REMOTE_VIDEO_STREAM_ADDED',

  /**
   * Triggered when another call participant has removed a remote video stream from a call.
   *
   * Listener is called with [Calls.Call.CallEvents.CallRemoteVideoStreamRemoved] and payload:
   * @cast Calls.Call.CallEvents.CallRemoteVideoStreamRemovedPayload
   */
  RemoteVideoStreamRemoved = 'REMOTE_VIDEO_STREAM_REMOVED',
}

/**
 * Enum that represents the reason why a call has been ended.
 *
 * @folder Call.CallEvents
 */
export enum CallDisconnectReason {
  /**
   * Local party has explicitly ended a call.
   */
  LocalEnded = 'LOCAL_ENDED',

  /**
   * Remote party has explicitly ended a call.
   */
  RemoteEnded = 'REMOTE_ENDED',

  /**
   * Connection to the Voximplant Cloud has been lost and cannot be recovered during a call.
   */
  ConnectionLost = 'CONNECTION_LOST',

  /**
   * Another device has answered the call.
   */
  AnsweredElsewhere = 'ANSWERED_ELSEWHERE',
}

/**
 * @hidden
 */
export interface BaseCallEventPayload {
  /**
   * Call id.
   */
  callId: CallId;
}

/**
 * @hidden
 */
export type BaseCallEvent<
  Name extends CallEvent,
  Payload extends BaseCallEventPayload = BaseCallEventPayload
> = {
  name: Name;
  payload: Payload;
};

/**
 * @folder Call.CallEvents
 */
export interface CallConnectedPayload extends BaseCallEventPayload {
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallConnected
  extends BaseCallEvent<CallEvent.Connected, CallConnectedPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallDisconnectedPayload extends BaseCallEventPayload {
  /**
   * Reason that the call ended
   */
  reason: CallDisconnectReason;
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallDisconnected
  extends BaseCallEvent<CallEvent.Disconnected, CallDisconnectedPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallFailedPayload extends BaseCallEventPayload {
  /**
   * Call failure status code
   */
  code: number;

  /**
   * Call failure reason
   */
  reason?: string;

  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallFailed
  extends BaseCallEvent<CallEvent.Failed, CallFailedPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallStartRingingPayload extends BaseCallEventPayload {
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallStartRinging
  extends BaseCallEvent<CallEvent.StartRinging, CallStartRingingPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallStopRingingPayload extends BaseCallEventPayload {
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallStopRinging extends BaseCallEvent<CallEvent.StopRinging> {}

/**
 * @folder Call.CallEvents
 */
export interface CallMessageReceivedPayload extends BaseCallEventPayload {
  /**
   * Message text
   */
  text: string;
}

/**
 * @folder Call.CallEvents
 */
export interface CallMessageReceived
  extends BaseCallEvent<
    CallEvent.MessageReceived,
    CallMessageReceivedPayload
  > {}

/**
 * @folder Call.CallEvents
 */
export interface CallInfoReceivedPayload extends BaseCallEventPayload {
  /**
   * MIME type of an INFO message
   */
  mimeType: string;
  /**
   * Body of an INFO message
   */
  body: string;
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Call.CallEvents
 */
export interface CallInfoReceived
  extends BaseCallEvent<CallEvent.InfoReceived, CallInfoReceivedPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallStatsReceivedPayload extends BaseCallEventPayload {
  /**
   * Time at which the call statistics are collected, relative to the UNIX epoch (Jan 1, 1970, UTC), in microseconds
   */
  timestamp: number;

  /**
   * Media connectivity statistics
   */
  connection: ConnectionStatsReport;

  /**
   * Statistics for all active outgoing audio streams in a call at the moment of the statistics collection
   */
  localAudio: LocalAudioStreamStatsReport;

  /**
   * Statistics for all active outgoing video streams in a call at the moment of the statistics collection
   */
  localVideo: LocalVideoStreamStatsReport;

  /**
   * Statistics for all incoming audio and video streams of a call at the moment of the statistics collection
   */
  remote: {
    audio: RemoteAudioStreamStatsReport;
    video: RemoteVideoStreamStatsReport;
  };
}

/**
 * @folder Call.CallEvents
 */
export interface CallStatsReceived
  extends BaseCallEvent<CallEvent.StatsReceived, CallStatsReceivedPayload> {}

/**
 * @folder Call.CallEvents
 */
export interface CallRemoteVideoStreamAddedPayload
  extends BaseCallEventPayload {
  /**
   * Remote video stream
   */
  stream: RemoteVideoStream;
}

/**
 * @folder Call.CallEvents
 */
export interface CallRemoteVideoStreamAdded
  extends BaseCallEvent<
    CallEvent.RemoteVideoStreamAdded,
    CallRemoteVideoStreamAddedPayload
  > {}

/**
 * @folder Call.CallEvents
 */
export interface CallRemoteVideoStreamRemovedPayload
  extends BaseCallEventPayload {
  /**
   * Remote video stream
   */
  stream: RemoteVideoStream;
}

/**
 * @folder Call.CallEvents
 */
export interface CallRemoteVideoStreamRemoved
  extends BaseCallEvent<
    CallEvent.RemoteVideoStreamRemoved,
    CallRemoteVideoStreamRemovedPayload
  > {}

/**
 * @folder Call.CallEvents
 */
export type AnyCallEvent =
  | CallConnected
  | CallDisconnected
  | CallFailed
  | CallStartRinging
  | CallStopRinging
  | CallMessageReceived
  | CallInfoReceived
  | CallStatsReceived
  | CallRemoteVideoStreamAdded
  | CallRemoteVideoStreamRemoved;
