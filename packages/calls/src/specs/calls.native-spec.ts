import {
  resolveNativeModule,
  withLegacyEvents,
  type ExtraHeaders,
} from '@voximplant/react-native-shared';
import { type CodegenTypes, type TurboModule } from 'react-native';
import type { AudioStreamId } from '../features/audio';
import type {
  BaseCallEventPayload,
  BaseConferenceEventPayload,
  CallConnectedPayload,
  CallDirection,
  CallDisconnectedPayload,
  CallFailedPayload,
  CallId,
  CallInfoReceivedPayload,
  CallMessageReceivedPayload,
  CallRemoteVideoStreamAddedInternalPayload,
  CallRemoteVideoStreamRemovedInternalPayload,
  CallSettingsDTO,
  CallStartRingingPayload,
  CallState,
  CallStatsReceivedPayload,
  ConferenceConnectedPayload,
  ConferenceDisconnectedPayload,
  ConferenceEndpointAddedPayload,
  ConferenceEndpointRemovedPayload,
  ConferenceFailedPayload,
  ConferenceId,
  ConferenceInfoReceivedPayload,
  ConferenceMessageReceivedPayload,
  ConferenceSettingsDTO,
  ConferenceState,
  ConferenceStatsReceivedPayload,
  EndpointId,
  EndpointStartReceivingVideoStreamPayload,
  EndpointStopReceivingVideoStreamPayload,
  RejectMode,
  SendInfoParams,
} from '../features/calls';
import type {
  EndpointMuteStateChangedInternalPayload,
  EndpointRemoteVideoStreamAddedInternalPayload,
  EndpointRemoteVideoStreamRemovedInternalPayload,
  EndpointVoiceActivityChangedInternalPayload,
} from '../features/calls/conference/endpoint/internal';
import type { ConferenceLocalVoiceActivityChangedInternalPayload } from '../features/calls/conference/internal';
import type {
  LocalVideoStreamDTO,
  VideoResolution,
  VideoStreamId,
} from '../features/video';

const MODULE_NAME = 'RNVICalls';

export interface Spec extends TurboModule {
  // ---- CallManager ----
  createCall(
    destination: string,
    settings: CallSettingsDTO | null
  ): CallId | null;
  getCalls(): CallId[];
  hasCall(id: CallId): boolean;

  createConference(
    conferenceName: string,
    settings: ConferenceSettingsDTO | null
  ): ConferenceId | null;
  getConferences(): ConferenceId[];
  hasConference(id: ConferenceId): boolean;

  readonly onIncomingCall: CodegenTypes.EventEmitter<{
    callId: CallId;
    withVideo: boolean;
    headers?: ExtraHeaders;
  }>;
  // ---- /CallManager ----

  // ---- Shared Call/Conference ----
  getDuration: (id: CallId | ConferenceId) => number;
  getIsMuted: (id: CallId | ConferenceId) => boolean;
  getLocalVideoStreams: (id: CallId | ConferenceId) => LocalVideoStreamDTO[];
  getLocalVideoStream: (
    id: CallId | ConferenceId,
    streamId: VideoStreamId
  ) => LocalVideoStreamDTO | null;

  hangup(id: CallId | ConferenceId, headers: ExtraHeaders | null): void;
  mute(id: CallId | ConferenceId, value: boolean): void;
  sendMessage(id: CallId | ConferenceId, text: string): void;
  sendInfo(id: CallId | ConferenceId, params: SendInfoParams): void;

  startSendingVideo(
    id: CallId | ConferenceId,
    streamId: VideoStreamId
  ): Promise<void>;
  stopSendingVideo(id: CallId | ConferenceId): Promise<void>;
  // ---- /Shared Call/Conference ----

  // ---- Call ----
  getCallState: (id: CallId) => CallState;
  getCallDirection: (id: CallId) => CallDirection;

  getIsOnHold: (id: CallId) => boolean;
  getRemoteDisplayName: (id: CallId) => string | null;
  getRemoteUsername: (id: CallId) => string | null;
  getRemoteVideoStreams: (id: CallId) => VideoStreamId[];
  hasRemoteVideoStreamForCall: (id: CallId, streamId: VideoStreamId) => boolean;

  start(id: CallId): void;
  answer(id: CallId, settings: CallSettingsDTO | null): void;
  reject(id: CallId, mode: RejectMode, headers: ExtraHeaders | null): void;
  sendDTMF(id: CallId, tones: string): void;

  hold(id: CallId, enable: boolean): Promise<void>;

  readonly onCallConnected: CodegenTypes.EventEmitter<CallConnectedPayload>;
  readonly onCallDisconnected: CodegenTypes.EventEmitter<CallDisconnectedPayload>;
  readonly onCallFailed: CodegenTypes.EventEmitter<CallFailedPayload>;
  readonly onCallStartRinging: CodegenTypes.EventEmitter<CallStartRingingPayload>;
  readonly onCallStopRinging: CodegenTypes.EventEmitter<BaseCallEventPayload>;
  readonly onCallMessageReceived: CodegenTypes.EventEmitter<CallMessageReceivedPayload>;
  readonly onCallInfoReceived: CodegenTypes.EventEmitter<CallInfoReceivedPayload>;
  readonly onCallStatsReceived: CodegenTypes.EventEmitter<CallStatsReceivedPayload>;
  readonly onCallRemoteVideoStreamAdded: CodegenTypes.EventEmitter<CallRemoteVideoStreamAddedInternalPayload>;
  readonly onCallRemoteVideoStreamRemoved: CodegenTypes.EventEmitter<CallRemoteVideoStreamRemovedInternalPayload>;

  readonly onCallReconnecting: CodegenTypes.EventEmitter<BaseCallEventPayload>;
  readonly onCallReconnected: CodegenTypes.EventEmitter<BaseCallEventPayload>;
  // ---- /Call ----

  // ---- Conference ----
  getStateForConference: (id: ConferenceId) => ConferenceState;
  getEndpointIdForConference: (id: ConferenceId) => EndpointId | null;
  getEndpointsForConference: (id: ConferenceId) => EndpointId[];
  hasEndpointForConference: (
    id: ConferenceId,
    endpointId: EndpointId
  ) => boolean;

  joinForConference: (id: ConferenceId) => void;

  readonly onConferenceConnected: CodegenTypes.EventEmitter<ConferenceConnectedPayload>;
  readonly onConferenceDisconnected: CodegenTypes.EventEmitter<ConferenceDisconnectedPayload>;
  readonly onConferenceFailed: CodegenTypes.EventEmitter<ConferenceFailedPayload>;
  readonly onConferenceStatsReceived: CodegenTypes.EventEmitter<ConferenceStatsReceivedPayload>;
  readonly onConferenceEndpointAdded: CodegenTypes.EventEmitter<ConferenceEndpointAddedPayload>;
  readonly onConferenceEndpointRemoved: CodegenTypes.EventEmitter<ConferenceEndpointRemovedPayload>;
  readonly onConferenceMessageReceived: CodegenTypes.EventEmitter<ConferenceMessageReceivedPayload>;
  readonly onConferenceInfoReceived: CodegenTypes.EventEmitter<ConferenceInfoReceivedPayload>;

  readonly onConferenceLocalVoiceActivityChanged: CodegenTypes.EventEmitter<ConferenceLocalVoiceActivityChangedInternalPayload>;
  readonly onConferenceReconnecting: CodegenTypes.EventEmitter<BaseConferenceEventPayload>;
  readonly onConferenceReconnected: CodegenTypes.EventEmitter<BaseConferenceEventPayload>;
  // ---- /Conference ----

  // ---- Endpoint ----
  getDisplayNameForEndpoint: (id: EndpointId) => string | null;
  getUsernameForEndpoint: (id: EndpointId) => string | null;
  getSipUriForEndpoint: (id: EndpointId) => string | null;
  getIsMutedForEndpoint: (id: EndpointId) => boolean;
  getIsVoiceActivityDetectedForEndpoint: (id: EndpointId) => boolean;
  getAudioStreamsForEndpoint: (id: EndpointId) => AudioStreamId[];
  hasAudioStreamForEndpoint: (
    id: EndpointId,
    streamId: AudioStreamId
  ) => boolean;
  getVideoStreamsForEndpoint: (id: EndpointId) => VideoStreamId[];
  hasVideoStreamForEndpoint: (
    id: EndpointId,
    streamId: VideoStreamId
  ) => boolean;

  startReceivingVideoForEndpoint: (
    id: EndpointId,
    streamId: VideoStreamId
  ) => void;
  stopReceivingVideoForEndpoint: (
    id: EndpointId,
    streamId: VideoStreamId
  ) => void;

  requestVideoSizeForEndpoint: (
    id: EndpointId,
    streamId: VideoStreamId,
    size: VideoResolution
  ) => Promise<void>;

  readonly onEndpointRemoteVideoStreamAdded: CodegenTypes.EventEmitter<EndpointRemoteVideoStreamAddedInternalPayload>;
  readonly onEndpointRemoteVideoStreamRemoved: CodegenTypes.EventEmitter<EndpointRemoteVideoStreamRemovedInternalPayload>;
  readonly onEndpointStartReceivingVideoStream: CodegenTypes.EventEmitter<EndpointStartReceivingVideoStreamPayload>;
  readonly onEndpointStopReceivingVideoStream: CodegenTypes.EventEmitter<EndpointStopReceivingVideoStreamPayload>;

  readonly onEndpointMuteStateChanged: CodegenTypes.EventEmitter<EndpointMuteStateChangedInternalPayload>;
  readonly onEndpointVoiceActivityChanged: CodegenTypes.EventEmitter<EndpointVoiceActivityChangedInternalPayload>;
  // ---- /Endpoint ----
}

const resolved = resolveNativeModule<Spec>(MODULE_NAME);
const NativeCalls = withLegacyEvents<Spec>(MODULE_NAME, resolved);

export default NativeCalls;
