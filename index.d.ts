declare module "react-native-voximplant" {
  import React from "react";
  import { ViewProps } from "react-native";

  namespace Voximplant {
    export function getInstance(clientConfig?: ClientConfig): Client;
    export function getMessenger(): Messaging.Messenger;

    export class Client {
      public setLoggerCallback(
        callback: (level: LogLevel, message: string) => void,
      ): void;

      public on<K extends ClientEvents>(
        event: K,
        handler: (event: ClientEventHandlers[K]) => void,
      ): void;

      public off<K extends ClientEvents>(
        event: K,
        handler?: (event: ClientEventHandlers[K]) => void,
      ): void;

      public connect(
        options?: ConnectOptions,
      ): Promise<
        | ClientEventHandlers["ConnectionEstablished"]
        | ClientEventHandlers["ConnectionFailed"]
      >;

      public disconnect(): Promise<ClientEventHandlers["ConnectionClosed"]>;

      public getClientState(): Promise<ClientState>;

      public login(
        username: string,
        password: string,
      ): Promise<ClientEventHandlers["AuthResult"]>;

      public loginWithOneTimeKey(
        username: string,
        hash: string,
      ): Promise<ClientEventHandlers["AuthResult"]>;

      public loginWithToken(
        username: string,
        token: string,
      ): Promise<ClientEventHandlers["AuthResult"]>;

      public requestOneTimeLoginKey(
        username: string,
      ): Promise<ClientEventHandlers["AuthResult"]>;

      public tokenRefresh(
        username: string,
        refreshToken: string,
      ): Promise<ClientEventHandlers["RefreshTokenResult"]>;

      public registerPushNotificationsToken(token: string): void;

      public registerIMPushNotificationsTokenIOS(token: string): void;

      public unregisterPushNotificationsToken(token: string): void;

      public unregisterIMPushNotificationsTokenIOS(token: string): void;

      public handlePushNotification(notification: object): void;

      public call(number: string, callSettings?: CallSettings): Promise<Call>;

      public callConference(
        number: string,
        callSettings?: CallSettings,
      ): Promise<Call>;
    }

    class QualitySubscriber {
      public on<K extends QualityEvents>(
        event: K,
        handler: (event: QualityEventHandlers[K]) => void,
      ): void;

      public off<K extends QualityEvents>(
        event: K,
        handler?: (event: QualityEventHandlers[K]) => void,
      ): void;
    }
    export class Call {
      public callId: string;
      public localVideoStreams: VideoStream[];
      public callKitUUID: string | null;
      public qualityIssues: QualitySubscriber;

      public on<K extends CallEvents>(
        event: K,
        handler: (event: CallEventHandlers[K]) => void,
      ): void;

      public off<K extends CallEvents>(
        event: K,
        handler?: (event: CallEventHandlers[K]) => void,
      ): void;

      public answer(callSettings?: CallSettings): void;

      public decline(headers?: object): void;

      public reject(headers?: object): void;

      public sendAudio(enable: boolean): void;

      public sendTone(key: string): void;

      public sendVideo(
        enable: boolean,
      ): Promise<void | CallEventHandlers["CallOperationFailed"]>;

      public hold(
        enable: boolean,
      ): Promise<void | CallEventHandlers["CallOperationFailed"]>;

      public receiveVideo(): Promise<
        void | CallEventHandlers["CallOperationFailed"]
      >;

      public hangup(headers?: object): void;

      public sendMessage(message: string): void;

      public sendInfo(
        mimeType: string,
        body: string,
        extraHeaders?: object,
      ): void;

      public getEndpoints(): Endpoint[];

      public getDuration(): Promise<number | CallError>;

      public currentQualityIssues(): Promise<
        { [key in QualityEvents]?: QualityIssueLevel } | CallError
      >;
    }

    export enum CallEvents {
      Connected = "Connected",
      Disconnected = "Disconnected",
      EndpointAdded = "EndpointAdded",
      Failed = "Failed",
      ICECompleted = "ICECompleted",
      ICETimeout = "ICETimeout",
      InfoReceived = "InfoReceived",
      LocalVideoStreamAdded = "LocalVideoStreamAdded",
      LocalVideoStreamRemoved = "LocalVideoStreamRemoved",
      MessageReceived = "MessageReceived",
      ProgressToneStart = "ProgressToneStart",
      ProgressToneStop = "ProgressToneStop",
      CallReconnecting = "CallReconnecting",
      CallReconnected = "CallReconnected",
    }
    export interface CallEventHandlers {
      [CallEvents.Connected]: EventHandlers.CallEventWithHeaders;
      [CallEvents.Disconnected]: EventHandlers.Disconnected;
      [CallEvents.EndpointAdded]: EventHandlers.EndpointAdded;
      [CallEvents.Failed]: EventHandlers.Failed;
      [CallEvents.ICECompleted]: EventHandlers.CallEvent;
      [CallEvents.ICETimeout]: EventHandlers.CallEvent;
      [CallEvents.InfoReceived]: EventHandlers.InfoReceived;
      [CallEvents.LocalVideoStreamAdded]: EventHandlers.LocalVideoStreamAdded;
      [CallEvents.LocalVideoStreamRemoved]: EventHandlers.LocalVideoStreamRemoved;
      [CallEvents.MessageReceived]: EventHandlers.MessageReceived;
      [CallEvents.ProgressToneStart]: EventHandlers.CallEventWithHeaders;
      [CallEvents.ProgressToneStop]: EventHandlers.CallEvent;
      [CallEvents.CallReconnecting]: EventHandlers.CallEvent;
      [CallEvents.CallReconnected]: EventHandlers.CallEvent;
      CallOperationFailed: EventHandlers.CallOperationFailed;
    }

    export class Endpoint {
      public id: string;
      public displayName: string;
      public sipUri: string;
      public userName: string;
      public videoStreams: VideoStream[];

      public on<K extends EndpointEvents>(
        eventType: K,
        handler: (event: EndpointEventHandlers[K]) => void,
      ): void;

      public off<K extends EndpointEvents>(
        eventType?: K,
        handler?: (event: EndpointEventHandlers[K]) => void,
      ): void;

      public requestVideoSize(
        streamId: string,
        width: number,
        height: number,
      ): Promise<void | CallEventHandlers["CallOperationFailed"]>;

      public startReceiving(streamId: string): Promise<void>;

      public stopReceiving(streamId: string): Promise<void>;
    }

    export class VideoStream {
      public id: string;
      public isLocal: boolean;
      public type: VideoStreamType;
    }

    export class VideoView extends React.Component<VideoViewProps> {}
    export interface VideoViewProps extends ViewProps {
      scaleType?: RenderScaleType;
      videoStreamId?: string;
      showOnTop?: boolean;
    }

    export enum EndpointEvents {
      InfoUpdated = "InfoUpdated",
      RemoteVideoStreamAdded = "RemoteVideoStreamAdded",
      RemoteVideoStreamRemoved = "RemoteVideoStreamRemoved",
      Removed = "Removed",
      VoiceActivityStarted = "VoiceActivityStarted",
      VoiceActivityStopped = "VoiceActivityStopped",
      StartReceivingVideoStream = "StartReceivingVideoStream",
      StopReceivingVideoStream = "StopReceivingVideoStream",
    }
    export interface EndpointEventHandlers {
      [EndpointEvents.InfoUpdated]: EventHandlers.InfoUpdated;
      [EndpointEvents.RemoteVideoStreamAdded]: EventHandlers.RemoteVideoStreamAdded;
      [EndpointEvents.RemoteVideoStreamRemoved]: EventHandlers.RemoteVideoStreamRemoved;
      [EndpointEvents.Removed]: EventHandlers.Removed;
      [EndpointEvents.VoiceActivityStarted]: EventHandlers.EndpointDefaultEvent;
      [EndpointEvents.VoiceActivityStopped]: EventHandlers.EndpointDefaultEvent;
      [EndpointEvents.StartReceivingVideoStream]: EventHandlers.StartReceivingVideoStream;
      [EndpointEvents.StopReceivingVideoStream]: EventHandlers.StopReceivingVideoStream;
    }

    export enum ClientEvents {
      ConnectionEstablished = "ConnectionEstablished",
      ConnectionFailed = "ConnectionFailed",
      ConnectionClosed = "ConnectionClosed",
      AuthResult = "AuthResult",
      RefreshTokenResult = "RefreshTokenResult",
      IncomingCall = "IncomingCall",
      Reconnecting = "Reconnecting",
      Reconnected = "Reconnected",
    }
    export interface ClientEventHandlers {
      [ClientEvents.ConnectionEstablished]: EventHandlers.ConnectionEstablished;
      [ClientEvents.ConnectionFailed]: EventHandlers.ConnectionFailed;
      [ClientEvents.ConnectionClosed]: EventHandlers.ConnectionClosed;
      [ClientEvents.AuthResult]: EventHandlers.AuthResult;
      [ClientEvents.RefreshTokenResult]: EventHandlers.AuthTokenResult;
      [ClientEvents.IncomingCall]: EventHandlers.IncomingCall;
      [ClientEvents.Reconnecting]: EventHandlers.Reconnecting;
      [ClientEvents.Reconnected]: EventHandlers.Reconnected;
    }

    export enum ClientState {
      DISCONNECTED = "disconnected",
      CONNECTING = "connecting",
      CONNECTED = "connected",
      LOGGING_IN = "logging_in",
      LOGGED_IN = "logged_in",
      RECONNECTING = "reconnecting",
    }

    export enum RenderScaleType {
      SCALE_FILL = "fill",
      SCALE_FIT = "fit",
    }

    export enum CallError {
      ALREADY_IN_THIS_STATE = "ALREADY_IN_THIS_STATE",
      FUNCTIONALITY_IS_DISABLED = "FUNCTIONALITY_IS_DISABLED",
      INCORRECT_OPERATION = "INCORRECT_OPERATION",
      INTERNAL_ERROR = "INTERNAL_ERROR",
      MEDIA_IS_ON_HOLD = "MEDIA_IS_ON_HOLD",
      MISSING_PERMISSION = "MISSING_PERMISSION",
      NOT_LOGGED_IN = "NOT_LOGGED_IN",
      REJECTED = "REJECTED",
      TIMEOUT = "TIMEOUT",
      RECONNECTING = "RECONNECTING",
    }

    export enum LogLevel {
      ERROR = "error",
      WARNING = "warning",
      INFO = "info",
      DEBUG = "debug",
      VERBOSE = "verbose",
    }

    export enum VideoCodec {
      VP8 = "VP8",
      H264 = "H264",
      AUTO = "AUTO",
    }

    export enum RequestAudioFocusMode {
      REQUEST_ON_CALL_START = "REQUEST_ON_CALL_START",
      REQUEST_ON_CALL_CONNECTED = "REQUEST_ON_CALL_CONNECTED",
    }

    export enum VideoStreamType {
      VIDEO = "Video",
      SCREEN_SHARING = "ScreenSharing",
    }

    export enum VideoStreamReceiveStopReason {
      AUTOMATIC = "Automatic",
      MANUAL = "Manual",
    }

    export enum QualityEvents {
      PacketLoss = "PacketLoss",
      CodecMismatch = "CodecMismatch",
      LocalVideoDegradation = "LocalVideoDegradation",
      IceDisconnected = "IceDisconnected",
      HighMediaLatency = "HighMediaLatency",
      NoAudioSignal = "NoAudioSignal",
      NoAudioReceive = "NoAudioReceive",
      NoVideoReceive = "NoVideoReceive",
    }
    export interface QualityEventHandlers {
      [QualityEvents.PacketLoss]: EventHandlers.PacketLossEvent;
      [QualityEvents.CodecMismatch]: EventHandlers.CodecMismatchEvent;
      [QualityEvents.LocalVideoDegradation]: EventHandlers.LocalVideoDegradationEvent;
      [QualityEvents.IceDisconnected]: EventHandlers.IceDisconnectedEvent;
      [QualityEvents.HighMediaLatency]: EventHandlers.HighMediaLatencyEvent;
      [QualityEvents.NoAudioSignal]: EventHandlers.NoAudioSignalEvent;
      [QualityEvents.NoAudioReceive]: EventHandlers.NoAudioReceiveEvent;
      [QualityEvents.NoVideoReceive]: EventHandlers.NoVideoReceiveEvent;
    }

    // -- Structures
    // Client Config
    export interface ClientConfig {
      enableVideo?: boolean;
      enableCameraMirroring?: boolean;
      enableLogcatLogging?: boolean;
      preferredVideoCodec?: VideoCodec;
      enableDebugLogging?: boolean;
      logLevel?: LogLevel;
      bundleId?: string | null;
      requestAudioFocusMode?: boolean;
      forceRelayTraffic?: boolean;
    }
    // Connect Options
    export interface ConnectOptions {
      connectivityCheck?: boolean;
      servers?: string[];
    }
    // Login Tokens
    export interface LoginTokens {
      accessExpire: number;
      accessToken: string;
      refreshExpire: number;
      refreshToken: string;
    }
    // Video Flags
    export interface VideoFlags {
      receiveVideo?: boolean;
      sendVideo?: boolean;
    }
    // Call Settings
    export interface CallSettings {
      preferredVideoCodec?: VideoCodec;
      customData?: string | null;
      extraHeaders?: Record<string, string>;
      video: VideoFlags;
      setupCallKit?: boolean;
      enableSimulcast?: boolean;
    }

    // -- Enums
    // Quality Issue Level
    export enum QualityIssueLevel {
      NONE = "None",
      MINOR = "Minor",
      MAJOR = "Major",
      CRITICAL = "Critical",
    }
  }

  namespace Voximplant.Hardware {
    export class AudioDeviceManager {
      public static getInstance(): AudioDeviceManager;

      public on<K extends AudioDeviceEvents>(
        event: K,
        handler: (event: AudioDeviceEventHandlers[K]) => void,
      ): void;

      public off<K extends AudioDeviceEvents>(
        event: K,
        handler?: (event: AudioDeviceEventHandlers[K]) => void,
      ): void;

      public getActiveDevice(): Promise<AudioDevice>;

      public getAudioDevices(): Promise<AudioDevice[]>;

      public selectAudioDevice(audioDevice: AudioDevice): void;

      public callKitConfigureAudioSession(): void;

      public callKitReleaseAudioSession(): void;

      public callKitStartAudio(): void;

      public callKitStopAudio(): void;
    }

    export enum AudioDeviceEvents {
      DeviceChanged = "DeviceChanged",
      DeviceListChanged = "DeviceListChanged",
    }
    export interface AudioDeviceEventHandlers {
      [AudioDeviceEvents.DeviceChanged]: EventHandlers.DeviceChanged;
      [AudioDeviceEvents.DeviceListChanged]: EventHandlers.DeviceListChanged;
    }

    export class CameraManager {
      public static getInstance(): CameraManager;

      public switchCamera(cameraType: CameraType): void;

      public setCameraResolution(width: number, height: number): void;

      public useOrientationEventListener(use: boolean): void;

      public on<K extends CameraEvents>(
        event: K,
        handler: (event: CameraEventHandlers[K]) => void,
      ): void;

      public off<K extends CameraEvents>(
        event: K,
        handler?: (event: CameraEventHandlers[K]) => void,
      ): void;
    }

    export enum CameraEvents {
      CameraDisconnected = "CameraDisconnected",
      CameraError = "CameraError",
      CameraSwitchDone = "CameraSwitchDone",
      CameraSwitchError = "CameraSwitchError",
    }
    export interface CameraEventHandlers {
      [CameraEvents.CameraDisconnected]: EventHandlers.CameraDisconnected;
      [CameraEvents.CameraError]: EventHandlers.CameraError;
      [CameraEvents.CameraSwitchDone]: EventHandlers.CameraSwitchDone;
      [CameraEvents.CameraSwitchError]: EventHandlers.CameraSwitchError;
    }

    export class AudioFile {
      public url: string;
      public looped: boolean;
      public name: string;

      public initWithLocalFile(
        name: string,
        type: string,
        usage: AudioFileUsage,
      ): Promise<void>;

      public loadFile(url: string, usage: AudioFileUsage): Promise<void>;

      public play(looped: boolean): Promise<AudioFileEventHandlers["Started"]>;

      public stop(): Promise<AudioFileEventHandlers["Stopped"]>;

      public releaseResources(): void;

      public on<K extends AudioFileEventTypes>(
        event: K,
        handler: (event: AudioFileEventHandlers[K]) => void,
      ): void;

      public off<K extends AudioFileEventTypes>(
        event: K,
        handler?: (event: AudioFileEventHandlers[K]) => void,
      ): void;
    }

    export enum AudioFileEventTypes {
      Started = "Started",
      Stopped = "Stopped",
    }
    export interface AudioFileEventHandlers {
      [AudioFileEventTypes.Started]: EventHandlers.AudioFileStarted;
      [AudioFileEventTypes.Stopped]: EventHandlers.AudioFileStopped;
    }

    export enum AudioDevice {
      BLUETOOTH = "Bluetooth",
      EARPIECE = "Earpiece",
      NONE = "None",
      SPEAKER = "Speaker",
      WIRED_HEADSET = "WiredHeadset",
    }

    export enum CameraType {
      FRONT = "front",
      BACK = "back",
    }

    export enum AudioFileUsage {
      IN_CALL = "incall",
      NOTIFICATION = "notification",
      RINGTONE = "ringtone",
      UNKNOWN = "unknown",
    }
  }

  namespace Voximplant.Messaging {
    export class Messenger {
      public on<K extends MessengerEventTypes>(
        eventType: K,
        event: (event: MessengerEventHandlers[K]) => void,
      ): void;

      public off<K extends MessengerEventTypes>(
        eventType: K,
        event?: (event: MessengerEventHandlers[K]) => void,
      ): void;

      public getMe(): string | null;

      public getUserByName(
        username: string,
      ): Promise<
        MessengerEventHandlers["GetUser"] | MessengerEventHandlers["Error"]
      >;

      public getUserByIMId(
        userId: number,
      ): Promise<
        MessengerEventHandlers["GetUser"] | MessengerEventHandlers["Error"]
      >;

      public getUsersByName(
        users: string[],
      ): Promise<
        MessengerEventHandlers["GetUser"][] | MessengerEventHandlers["Error"]
      >;

      public getUsersByIMId(
        users: number[],
      ): Promise<
        MessengerEventHandlers["GetUser"][] | MessengerEventHandlers["Error"]
      >;

      public editUser(
        customData: object | null,
        privateCustomData: object | null,
      ): Promise<
        MessengerEventHandlers["EditUser"] | MessengerEventHandlers["Error"]
      >;

      public setStatus(
        online: boolean,
      ): Promise<
        MessengerEventHandlers["SetStatus"] | MessengerEventHandlers["Error"]
      >;

      public subscribe(
        users: number[],
      ): Promise<
        MessengerEventHandlers["Subscribe"] | MessengerEventHandlers["Error"]
      >;

      public unsubscribe(
        users: number[],
      ): Promise<
        MessengerEventHandlers["Unsubscribe"] | MessengerEventHandlers["Error"]
      >;

      public unsubscribeFromAll(): Promise<
        MessengerEventHandlers["Unsubscribe"] | MessengerEventHandlers["Error"]
      >;

      public getSubscriptions(): Promise<
        | MessengerEventHandlers["GetSubscriptions"]
        | MessengerEventHandlers["Error"]
      >;

      public managePushNotifications(
        notifications: MessengerNotification[],
      ): Promise<
        MessengerEventHandlers["EditUser"] | MessengerEventHandlers["Error"]
      >;

      public createConversation(
        conversationConfig?: ConversationConfig,
      ): Promise<
        | MessengerEventHandlers["CreateConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public getConversation(
        uuid: string,
      ): Promise<
        | MessengerEventHandlers["GetConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public getConversations(
        uuids: string[],
      ): Promise<
        | MessengerEventHandlers["GetConversation"][]
        | MessengerEventHandlers["Error"]
      >;

      public getPublicConversations(): Promise<
        | MessengerEventHandlers["GetPublicConversations"]
        | MessengerEventHandlers["Error"]
      >;

      public joinConversation(
        uuid: string,
      ): Promise<
        | MessengerEventHandlers["GetPublicConversations"]
        | MessengerEventHandlers["Error"]
      >;

      public leaveConversation(
        uuid: string,
      ): Promise<
        | MessengerEventHandlers["GetPublicConversations"]
        | MessengerEventHandlers["Error"]
      >;
    }

    export class Conversation {
      public createdTime: number;
      public customData: object;
      public direct: boolean;
      public lastSequence: number;
      public lastUpdateTime: number;
      public participants: ConversationParticipant[];
      public publicJoin: boolean;
      public title: string;
      public uuid: string;
      public uber: boolean;

      public setCustomData(customData: object): void;

      public setPublicJoin(publicJoin: boolean): void;

      public setTitle(title: string): void;

      public addParticipants(
        participants: ConversationParticipant[],
      ): Promise<
        | MessengerEventHandlers["EditConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public editParticipants(
        participants: ConversationParticipant[],
      ): Promise<
        | MessengerEventHandlers["EditConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public removeParticipants(
        participants: ConversationParticipant[],
      ): Promise<
        | MessengerEventHandlers["EditConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public update(): Promise<
        | MessengerEventHandlers["EditConversation"]
        | MessengerEventHandlers["Error"]
      >;

      public typing(): Promise<
        MessengerEventHandlers["Typing"] | MessengerEventHandlers["Error"]
      >;

      public sendMessage(
        text: string,
        payload?: object[],
      ): Promise<
        MessengerEventHandlers["SendMessage"] | MessengerEventHandlers["Error"]
      >;

      public markAsRead(
        sequence: number,
      ): Promise<
        MessengerEventHandlers["Read"] | MessengerEventHandlers["Error"]
      >;

      public retransmitEvents(
        from: number,
        to: number,
      ): Promise<
        | MessengerEventHandlers["RetransmitEvents"]
        | MessengerEventHandlers["Error"]
      >;

      public retransmitEventsFrom(
        from: number,
        count: number,
      ): Promise<
        | MessengerEventHandlers["RetransmitEvents"]
        | MessengerEventHandlers["Error"]
      >;

      public retransmitEventsTo(
        to: number,
        count: number,
      ): Promise<
        | MessengerEventHandlers["RetransmitEvents"]
        | MessengerEventHandlers["Error"]
      >;
    }

    export class Message {
      public conversation: string;
      public payload: { [key: string]: any }[];
      public sequence: number;
      public text: string;
      public uuid: string;

      public update(
        text: string | null,
        payload: { [key: string]: any }[] | null,
      ): Promise<
        MessengerEventHandlers["EditMessage"] | MessengerEventHandlers["Error"]
      >;

      public remove(): Promise<
        | MessengerEventHandlers["RemoveMessage"]
        | MessengerEventHandlers["Error"]
      >;
    }

    export enum MessengerEventTypes {
      CreateConversation = "CreateConversation",
      EditConversation = "EditConversation",
      EditMessage = "EditMessage",
      EditUser = "EditUser",
      Error = "Error",
      GetConversation = "GetConversation",
      GetPublicConversations = "GetPublicConversations",
      GetSubscriptions = "GetSubscriptions",
      GetUser = "GetUser",
      Read = "Read",
      RemoveConversation = "RemoveConversation",
      RemoveMessage = "RemoveMessage",
      RetransmitEvents = "RetransmitEvents",
      SendMessage = "SendMessage",
      SetStatus = "SetStatus",
      Subscribe = "Subscribe",
      Typing = "Typing",
      Unsubscribe = "Unsubscribe",
    }
    export interface MessengerEventHandlers {
      [MessengerEventTypes.CreateConversation]: EventHandlers.ConversationEvent;
      [MessengerEventTypes.EditConversation]: EventHandlers.ConversationEvent;
      [MessengerEventTypes.EditMessage]: EventHandlers.MessageEvent;
      [MessengerEventTypes.EditUser]: EventHandlers.UserEvent;
      [MessengerEventTypes.Error]: EventHandlers.ErrorEvent;
      [MessengerEventTypes.GetConversation]: EventHandlers.ConversationEvent;
      [MessengerEventTypes.GetPublicConversations]: EventHandlers.ConversationListEvent;
      [MessengerEventTypes.GetSubscriptions]: EventHandlers.SubscriptionEvent;
      [MessengerEventTypes.GetUser]: EventHandlers.UserEvent;
      [MessengerEventTypes.Read]: EventHandlers.ConversationServiceEvent;
      [MessengerEventTypes.RemoveConversation]: EventHandlers.ConversationEvent;
      [MessengerEventTypes.RemoveMessage]: EventHandlers.MessageEvent;
      [MessengerEventTypes.RetransmitEvents]: EventHandlers.RetransmitEvent;
      [MessengerEventTypes.SendMessage]: EventHandlers.MessageEvent;
      [MessengerEventTypes.SetStatus]: EventHandlers.StatusEvent;
      [MessengerEventTypes.Subscribe]: EventHandlers.SubscriptionEvent;
      [MessengerEventTypes.Typing]: EventHandlers.TypingEvent;
      [MessengerEventTypes.Unsubscribe]: EventHandlers.SubscriptionEvent;
    }

    export enum MessengerAction {
      addParticipants = "addParticipants",
      createConversation = "createConversation",
      editConversation = "editConversation",
      editMessage = "editMessage",
      editParticipants = "editParticipants",
      editUser = "editUser",
      getConversation = "getConversation",
      getConversations = "getConversations",
      getPublicConversations = "getPublicConversations",
      getSubscriptions = "getSubscriptions",
      getUser = "getUser",
      getUsers = "getUsers",
      joinConversation = "joinConversation",
      leaveConversation = "leaveConversation",
      manageNotifications = "manageNotifications",
      read = "read",
      removeConversation = "removeConversation",
      removeMessage = "removeMessage",
      removeParticipants = "removeParticipants",
      retransmitEvents = "retransmitEvents",
      sendMessage = "sendMessage",
      setStatus = "setStatus",
      subscribe = "subscribe",
      typing = "typing",
      unsubscribe = "unsubscribe",
    }

    export enum MessengerNotification {
      EditMessage = "EditMessage",
      SendMessage = "SendMessage",
    }

    // -- Structures
    // User
    export interface User {
      name: string;
      imId: number;
      displayName: string;
      customData: object;
      privateCustomData: object;
      conversationList: string[];
      leaveConversationList: string[];
      notifications: object[];
      isDeleted: boolean;
    }
    // Conversation Participant
    export interface ConversationParticipant {
      imUserId: number;
      canWrite?: boolean;
      canManageParticipants?: boolean;
      canEditMessages?: boolean;
      canEditAllMessages?: boolean;
      canRemoveMessages?: boolean;
      canRemoveAllMessages?: boolean;
      owner?: boolean;
      lastReadEventSequence?: number;
    }
    // Conversation Config
    export interface ConversationConfig {
      customData?: object;
      direct?: boolean;
      publicJoin?: boolean;
      participants: ConversationParticipant[];
      title?: string;
      uber?: boolean;
    }
  }

  namespace Voximplant.EventHandlers {
    // -- Call Events
    // Connected, Progress Tone Start
    export interface CallEventWithHeaders {
      name: CallEvents.Connected | CallEvents.ProgressToneStart;
      call: Call;
      headers?: object;
    }
    // Disconnected
    export interface Disconnected extends Omit<CallEventWithHeaders, "name"> {
      name: CallEvents.Disconnected;
      answeredElsewhere: boolean;
    }
    // Endpoint Added
    export interface EndpointAdded {
      name: CallEvents.EndpointAdded;
      call: Call;
      endpoint: Endpoint;
    }
    // Failed
    export interface Failed extends Omit<CallEventWithHeaders, "name"> {
      name: CallEvents.Failed;
      code: number;
      reason: string;
    }
    /* ICECompleted, ICETimeout, Progress Tone Stop, Call Reconnecting,
     Call Reconnected */
    export interface CallEvent {
      name:
        | CallEvents.ICECompleted
        | CallEvents.ICETimeout
        | CallEvents.ProgressToneStop
        | CallEvents.CallReconnecting
        | CallEvents.CallReconnected;
      call: Call;
    }
    // Info Received
    export interface InfoReceived extends Omit<CallEventWithHeaders, "name"> {
      name: CallEvents.InfoReceived;
      mimeType: string;
      body: string;
    }
    // Local Video Stream Added
    interface VideoStreamEvent {
      call: Call;
      videoStream: VideoStream;
    }
    export interface LocalVideoStreamAdded extends VideoStreamEvent {
      name: CallEvents.LocalVideoStreamAdded;
    }
    // Local Video Stream Removed
    export interface LocalVideoStreamRemoved extends VideoStreamEvent {
      name: CallEvents.LocalVideoStreamRemoved;
    }
    // Message Received
    export interface MessageReceived {
      name: CallEvents.MessageReceived;
      call: Call;
      text: string;
    }
    // Call Operation Failed
    export interface CallOperationFailed {
      name: string;
      code: CallError;
      message: string;
    }

    // -- Endpoint Events
    interface EndpointEvent {
      endpoint: Endpoint;
      call: Call;
    }
    // Info Updated
    export interface InfoUpdated extends EndpointEvent {
      name: EndpointEvents.InfoUpdated;
    }
    // Remote Video Stream Added
    export interface RemoteVideoStreamAdded
      extends EndpointEvent,
        VideoStreamEvent {
      name: EndpointEvents.RemoteVideoStreamAdded;
    }
    // Remote Video Stream Removed
    export interface RemoteVideoStreamRemoved
      extends EndpointEvent,
        VideoStreamEvent {
      name: EndpointEvents.RemoteVideoStreamRemoved;
    }
    // Removed
    export interface Removed extends EndpointEvent {
      name: EndpointEvents.Removed;
    }
    // Voice Activity Started, Voice Activity Stopped
    export interface EndpointDefaultEvent extends EndpointEvent {
      name:
        | EndpointEvents.VoiceActivityStarted
        | EndpointEvents.VoiceActivityStopped;
    }
    // Start Receiving Video Stream
    export interface StartReceivingVideoStream
      extends EndpointEvent,
        VideoStreamEvent {
      name: EndpointEvents.StartReceivingVideoStream;
    }
    // Stop Receiving Video Stream
    export interface StopReceivingVideoStream
      extends EndpointEvent,
        VideoStreamEvent {
      name: EndpointEvents.StopReceivingVideoStream;
      reason: VideoStreamReceiveStopReason;
    }

    // -- Quality Events
    interface QualityEvent {
      callId: string;
      issueLevel: QualityIssueLevel;
    }
    // Packet Loss
    export interface PacketLossEvent extends QualityEvent {
      name: QualityEvents.PacketLoss;
      packetLoss: number;
    }
    // Codec Mismatch
    export interface CodecMismatchEvent extends QualityEvent {
      name: QualityEvents.CodecMismatch;
      codec: string | null;
    }
    // Local Video Degradation
    export interface LocalVideoDegradationEvent extends QualityEvent {
      name: QualityEvents.LocalVideoDegradation;
      actualSize: object;
      targetSize: object;
    }
    // Ice Disconnected
    export interface IceDisconnectedEvent extends QualityEvent {
      name: QualityEvents.IceDisconnected;
    }
    // High Media Latency
    export interface HighMediaLatencyEvent extends QualityEvent {
      name: QualityEvents.HighMediaLatency;
      latency: number;
    }
    // No Audio Signal
    export interface NoAudioSignalEvent extends QualityEvent {
      name: QualityEvents.NoAudioSignal;
    }
    // No Audio Receive
    export interface NoAudioReceiveEvent extends QualityEvent {
      name: QualityEvents.NoAudioReceive;
      audioStreamId: string;
      endpointId: string;
    }
    // No Video Receive
    export interface NoVideoReceiveEvent extends QualityEvent {
      name: QualityEvents.NoVideoReceive;
      videoStreamId: string;
      endpointId: string;
    }

    // -- Client Events
    // Connection Established
    export interface ConnectionEstablished {
      name: ClientEvents.ConnectionEstablished;
    }
    // Connection Failed
    export interface ConnectionFailed {
      name: ClientEvents.ConnectionFailed;
      message: string;
    }
    // Connection Closed
    export interface ConnectionClosed {
      name: ClientEvents.ConnectionClosed;
    }
    // Auth Result
    export interface AuthResult {
      name: ClientEvents.AuthResult;
      result: boolean;
      code: number;
      displayName: string;
      key: string;
      tokens: LoginTokens;
    }
    // Refresh Token Result
    export interface AuthTokenResult {
      name: ClientEvents.RefreshTokenResult;
      result: boolean;
      code: number;
      tokens: LoginTokens;
    }
    // Incoming Call
    export interface IncomingCall {
      name: ClientEvents.IncomingCall;
      call: Call;
      headers?: object;
      video: boolean;
    }
    // Reconnecting
    export interface Reconnecting {
      name: ClientEvents.Reconnecting;
    }
    // Reconnected
    export interface Reconnected {
      name: ClientEvents.Reconnected;
    }

    // -- Audio Device Events
    // Device Changed
    export interface DeviceChanged {
      name: Hardware.AudioDeviceEvents.DeviceChanged;
      currentDevice: Hardware.AudioDevice;
    }
    // Device List Changed
    export interface DeviceListChanged {
      name: Hardware.AudioDeviceEvents.DeviceListChanged;
      newDeviceList: Hardware.AudioDevice[];
    }

    // -- Camera Events
    // Camera Disconnected
    export interface CameraDisconnected {
      name: Hardware.CameraEvents.CameraDisconnected;
    }
    // Camera Error
    export interface CameraError {
      name: Hardware.CameraEvents.CameraError;
      error: string;
    }
    // Camera Switch Done
    export interface CameraSwitchDone {
      name: Hardware.CameraEvents.CameraSwitchDone;
      isFrontCamera: boolean;
    }
    // Camera Switch Error
    export interface CameraSwitchError {
      name: Hardware.CameraEvents.CameraSwitchError;
      error: string;
    }

    // -- Audio File Events
    // Audio File Started
    interface AudioFileEvent {
      audioFile: Hardware.AudioFile;
      result: boolean;
      error: string;
    }
    export interface AudioFileStarted extends AudioFileEvent {
      name: Hardware.AudioFileEventTypes.Started;
    }
    // Audio File Stopped
    export interface AudioFileStopped extends AudioFileEvent {
      name: Hardware.AudioFileEventTypes.Stopped;
    }

    // -- Messenger Events
    interface MessengerEvent {
      action: Messaging.MessengerAction;
    }
    // Create Conversation, Edit Conversation, Get Conversation, Remove Conversation
    export interface ConversationEvent extends MessengerEvent {
      eventType:
        | Messaging.MessengerEventTypes.CreateConversation
        | Messaging.MessengerEventTypes.EditConversation
        | Messaging.MessengerEventTypes.GetConversation
        | Messaging.MessengerEventTypes.RemoveConversation;
      conversation: Messaging.Conversation;
      sequence: number;
      timestamp: number;
      imUserId: number;
    }
    // Edit Message, Remove Message, Send Message
    export interface MessageEvent extends MessengerEvent {
      eventType:
        | Messaging.MessengerEventTypes.EditMessage
        | Messaging.MessengerEventTypes.RemoveMessage
        | Messaging.MessengerEventTypes.SendMessage;
      message: Messaging.Message;
      sequence: number;
      timestamp: number;
      imUserId: number;
    }
    // Edit User, Get User
    export interface UserEvent extends MessengerEvent {
      eventType:
        | Messaging.MessengerEventTypes.EditUser
        | Messaging.MessengerEventTypes.GetUser
        | Messaging.MessengerEventTypes.SetStatus;
      user: Messaging.User;
      imUserId: number;
    }
    // Error
    export interface ErrorEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.Error;
      code: number;
      description: string;
    }
    // Get Public Conversations
    export interface ConversationListEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.GetPublicConversations;
      conversationList: string[];
      imUserId: number;
    }
    // Get Subscriptions, Subscribe, Unsubscribe
    export interface SubscriptionEvent extends MessengerEvent {
      eventType:
        | Messaging.MessengerEventTypes.GetSubscriptions
        | Messaging.MessengerEventTypes.Subscribe
        | Messaging.MessengerEventTypes.Unsubscribe;
      imUserId: number;
      users: number[];
    }
    // Read
    export interface ConversationServiceEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.Read;
      imUserId: number;
      conversationUUID: string;
      sequence: number;
    }
    // Retransmit Events
    export interface RetransmitEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.RetransmitEvents;
      imUserId: number;
      from: number;
      to: number;
      events: object[];
    }
    // Set Status
    export interface StatusEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.SetStatus;
      imUserId: number;
      online: boolean;
    }
    // Typing
    export interface TypingEvent extends MessengerEvent {
      eventType: Messaging.MessengerEventTypes.Typing;
      imUserId: number;
      conversationUUID: string;
    }
  }
}
