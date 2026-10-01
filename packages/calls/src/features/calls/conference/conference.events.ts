import type { ExtraHeaders } from '@voximplant/react-native-shared';
import type {
  ConnectionStatsReport,
  LocalAudioStreamStatsReport,
  LocalVideoStreamStatsReport,
  RemoteAudioStreamStatsReport,
  RemoteVideoStreamStatsReport,
} from '../../stats';
import type { ConferenceId } from './conference.types';
import type { EndpointId } from './endpoint';

/**
 * @folder Conference.ConferenceEvents
 * @event
 */
export enum ConferenceEvent {
  /**
   * Triggered after a conference has been successfully connected.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceConnected] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceConnectedPayload
   */
  Connected = 'CONFERENCE_CONNECTED',
  /**
   * Triggered if a conference has failed.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceFailed] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceFailedPayload
   */
  Failed = 'CONFERENCE_FAILED',
  /**
   * Triggered after a conference has been disconnected.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceDisconnected] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceDisconnectedPayload
   */
  Disconnected = 'CONFERENCE_DISCONNECTED',
  /**
   * Triggered after an endpoint is added to a conference.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceEndpointAdded] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceEndpointAddedPayload
   */
  EndpointAdded = 'CONFERENCE_ENDPOINT_ADDED',
  /**
   * Triggered after an endpoint is removed from a conference.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceEndpointRemoved] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceEndpointRemovedPayload
   */
  EndpointRemoved = 'CONFERENCE_ENDPOINT_REMOVED',
  /**
   * Triggered when an INFO message is received within a conference.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceInfoReceived] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceInfoReceivedPayload
   */
  InfoReceived = 'CONFERENCE_INFO_RECEIVED',
  /**
   * Triggered when a message is received within a conference.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceMessageReceived] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceMessageReceivedPayload
   */
  MessageReceived = 'CONFERENCE_MESSAGE_RECEIVED',
  /**
   * Triggered when conference statistics are available for a conference.
   *
   * Listener is called with [Calls.Conference.ConferenceEvents.ConferenceStatsReceived] and payload:
   * @cast Calls.Conference.ConferenceEvents.ConferenceStatsReceivedPayload
   */
  StatsReceived = 'CONFERENCE_STATS_RECEIVED',
}

/**
 * Enum that contains reasons why a conference has ended.
 *
 * @folder Conference.ConferenceEvents
 */
export enum ConferenceDisconnectReason {
  /**
   * Local party has explicitly ended a conference.
   */
  LocalEnded = 'LOCAL_ENDED',
  /**
   * Conference has ended by a VoxEngine scenario.
   */
  RemoteEnded = 'REMOTE_ENDED',
  /**
   * Connection to the Voximplant Cloud has been lost and cannot be recovered during a conference.
   */
  ConnectionLost = 'CONNECTION_LOST',
}

/**
 * @hidden
 */
export interface BaseConferenceEventPayload {
  /**
   * Conference id.
   */
  conferenceId: ConferenceId;
}

/**
 * @hidden
 */
export type BaseConferenceEvent<
  Name extends ConferenceEvent,
  Payload extends BaseConferenceEventPayload = BaseConferenceEventPayload
> = {
  name: Name;
  payload: Payload;
};

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceConnectedPayload extends BaseConferenceEventPayload {
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceConnected
  extends BaseConferenceEvent<
    ConferenceEvent.Connected,
    ConferenceConnectedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceDisconnectedPayload
  extends BaseConferenceEventPayload {
  /**
   * Reason why the conference ended
   */
  reason: ConferenceDisconnectReason;
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceDisconnected
  extends BaseConferenceEvent<
    ConferenceEvent.Disconnected,
    ConferenceDisconnectedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceFailedPayload extends BaseConferenceEventPayload {
  /**
   * Conference failure status code
   */
  code: number;
  /**
   * Conference failure reason
   */
  reason?: string;
  /**
   * Optional headers passed with the event
   */
  headers?: ExtraHeaders;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceFailed
  extends BaseConferenceEvent<
    ConferenceEvent.Failed,
    ConferenceFailedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceStatsReceivedPayload
  extends BaseConferenceEventPayload {
  /**
   * Time at which the conference statistics are collected, relative to the UNIX epoch (Jan 1, 1970, UTC), in microseconds
   */
  timestamp: number;
  /**
   * Media connectivity statistics
   */
  connection: ConnectionStatsReport;
  /**
   * Statistics for all active outgoing audio streams in a conference at the moment of the statistics collection
   */
  localAudio: LocalAudioStreamStatsReport;
  /**
   * Statistics for all active outgoing video streams in a conference at the moment of the statistics collection
   */
  localVideo: LocalVideoStreamStatsReport;
  /**
   * Endpoint statistics
   */
  remote: Record<
    EndpointId,
    {
      audio: RemoteAudioStreamStatsReport;
      video: RemoteVideoStreamStatsReport;
    }
  >;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceStatsReceived
  extends BaseConferenceEvent<
    ConferenceEvent.StatsReceived,
    ConferenceStatsReceivedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceEndpointAddedPayload
  extends BaseConferenceEventPayload {
  /**
   * Endpoint id
   */
  endpointId: EndpointId;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceEndpointAdded
  extends BaseConferenceEvent<
    ConferenceEvent.EndpointAdded,
    ConferenceEndpointAddedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceEndpointRemovedPayload
  extends BaseConferenceEventPayload {
  /**
   * Endpoint id
   */
  endpointId: EndpointId;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceEndpointRemoved
  extends BaseConferenceEvent<
    ConferenceEvent.EndpointRemoved,
    ConferenceEndpointRemovedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceInfoReceivedPayload
  extends BaseConferenceEventPayload {
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
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceInfoReceived
  extends BaseConferenceEvent<
    ConferenceEvent.InfoReceived,
    ConferenceInfoReceivedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceMessageReceivedPayload
  extends BaseConferenceEventPayload {
  /**
   * Content of the message
   */
  text: string;
}

/**
 * @folder Conference.ConferenceEvents
 */
export interface ConferenceMessageReceived
  extends BaseConferenceEvent<
    ConferenceEvent.MessageReceived,
    ConferenceMessageReceivedPayload
  > {}

/**
 * @folder Conference.ConferenceEvents
 */
export type AnyConferenceEvent =
  | ConferenceConnected
  | ConferenceDisconnected
  | ConferenceFailed
  | ConferenceStatsReceived
  | ConferenceEndpointAdded
  | ConferenceEndpointRemoved
  | ConferenceInfoReceived
  | ConferenceMessageReceived;
