/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "Constants.h"

NSString *const kEventConnectionEstablished = @"VIConnectionEstablished";
NSString *const kEventConnectionClosed = @"VIConnectionClosed";
NSString *const kEventConnectionFailed = @"VIConnectionFailed";
NSString *const kEventAuthResult = @"VIAuthResult";
NSString *const kEventAuthTokenResult = @"VIAuthTokenResult";
NSString *const kEventIncomingCall = @"VIIncomingCall";
NSString *const kEventLogMessage = @"VILogMessage";

NSString *const kEventCallConnected = @"VICallConnected";
NSString *const kEventCallDisconnected = @"VICallDisconnected";
NSString *const kEventCallEndpointAdded = @"VICallEndpointAdded";
NSString *const kEventCallFailed = @"VICallFailed";
NSString *const kEventCallICECompleted = @"VICallICECompleted";
NSString *const kEventCallICETimeout = @"VICallICETimeout";
NSString *const kEventCallInfoReceived = @"VICallInfoReceived";
NSString *const kEventCallLocalVideoStreamAdded = @"VICallLocalVideoStreamAdded";
NSString *const kEventCallLocalVideoStreamRemoved = @"VICallLocalVideoStreamRemoved";
NSString *const kEventCallMessageReceived = @"VICallMessageReceived";
NSString *const kEventCallProgressToneStart = @"VICallProgressToneStart";
NSString *const kEventCallProgressToneStop = @"VICallProgressToneStop";
NSString *const kEventEndpointInfoUpdate = @"VIEndpointInfoUpdated";
NSString *const kEventEndpointRemoteStreamAdded = @"VIEndpointRemoteVideoStreamAdded";
NSString *const kEventEndpointRemoteStreamRemoved = @"VIEndpointRemoteVideoStreamRemoved";
NSString *const kEventEndpointRemoved = @"VIEndpointRemoved";

NSString *const kEventAudioDeviceChanged = @"VIAudioDeviceChanged";
NSString *const kEventAudioDeviceListChanged = @"VIAudioDeviceListChanged";

NSString *const kEventAudioFileStarted = @"VIAudioFileStarted";
NSString *const kEventAudioFileStopped = @"VIAudioFileStopped";


NSString *const kEventNameConnectionEstablished = @"ConnectionEstablished";
NSString *const kEventNameConnectionFailed = @"ConnectionFailed";
NSString *const kEventNameConnectionClosed = @"ConnectionClosed";
NSString *const kEventNameAuthResult = @"AuthResult";
NSString *const kEventNameAuthTokenResult = @"AuthTokenResult";
NSString *const kEventNameIncomingCall = @"IncomingCall";

NSString *const kEventNameCallConnected = @"Connected";
NSString *const kEventNameCallDisconnected = @"Disconnected";
NSString *const kEventNameCallEndpointAdded = @"EndpointAdded";
NSString *const kEventNameCallFailed = @"Failed";
NSString *const kEventNameCallICECompleted = @"ICECompleted";
NSString *const kEventNameCallICETimeout = @"ICETimeout";
NSString *const kEventNameCallInfoReceived = @"InfoReceived";
NSString *const kEventNameCallLocalVideoStreamAdded = @"LocalVideoStreamAdded";
NSString *const kEventNameCallLocalVideoStreamRemoved = @"LocalVideoStreamRemoved";
NSString *const kEventNameCallMessageReceived = @"MessageReceived";
NSString *const kEventNameCallProgressToneStart = @"ProgressToneStart";
NSString *const kEventNameCallProgressToneStop = @"ProgressToneStop";

NSString *const kEventNameEndpointInfoUpdate = @"InfoUpdated";
NSString *const kEventNameEndpointRemoteStreamAdded = @"RemoteVideoStreamAdded";
NSString *const kEventNameEndpointRemoteStreanRemoved = @"RemoteVideoStreamRemoved";
NSString *const kEventNameEndpointRemoved = @"Removed";

NSString *const kEventNameAudioDeviceChanged = @"DeviceChanged";
NSString *const kEventNameAudioDeviceListChanged = @"DeviceListChanged";

NSString *const kEventNameAudioFileStarted = @"Started";
NSString *const kEventNameAudioFileStopped = @"Stopped";

NSString *const kEventParamName = @"name";
NSString *const kEventParamResult = @"result";
NSString *const kEventParamDisplayName = @"displayName";
NSString *const kEventParamTokens = @"tokens";
NSString *const kEventParamAccessToken = @"accessToken";
NSString *const kEventParamAccessExpire = @"accessExpire";
NSString *const kEventParamRefreshToken = @"refreshToken";
NSString *const kEventParamRefreshExpire = @"refreshExpire";
NSString *const kEventParamKey = @"key";
NSString *const kEventParamCode = @"code";
NSString *const kEventParamMessage = @"message";
NSString *const kEventParamIncomingVideo = @"video";
NSString *const kEventParamCallKitUUID = @"callKitUUID";

NSString *const kEventParamLogLevel = @"level";
NSString *const kEventParamLogMessage = @"message";
NSString *const kEventParamLogLevelError = @"error";
NSString *const kEventParamLogLevelWarning = @"warning";
NSString *const kEventParamLogLevelInfo = @"info";
NSString *const kEventParamLogLevelDebug = @"debug";
NSString *const kEventParamLogLevelVerbose = @"verbose";

NSString *const kEventParamCallId = @"callId";
NSString *const kEventParamHeaders = @"headers";
NSString *const kEventParamAnsweredElsewhere = @"answeredElsewhere";
NSString *const kEventParamReason = @"reason";
NSString *const kEventParamBody = @"body";
NSString *const kEventParamMimeType = @"mimeType";
NSString *const kEventParamText = @"text";
NSString *const kEventParamEndpointId = @"endpointId";
NSString *const kEventParamEndpointName = @"endpointName";
NSString *const kEventParamEndpointSipUri = @"sipUri";
NSString *const kEventParamVideoStreamId = @"videoStreamId";
NSString *const kEventParamCurrentAudioDevice = @"currentDevice";
NSString *const kEventParamDeviceList = @"newDeviceList";
NSString *const kEventParamVideoStreamType = @"videoStreamType";

NSString *const kEventParamAudioFileId = @"fileId";
NSString *const kEventParamError = @"error";

NSString *const kVideoStreamTypeVideo = @"Video";
NSString *const kVideoStreamTypeScreenSharing = @"ScreenSharing";

NSString *const kScaleTypeFit = @"fit";
NSString *const kScaleTypeFill = @"fill";

NSString *const kCallErrorRejected = @"REJECTED";
NSString *const kCallErrorTimeout = @"TIMEOUT";
NSString *const kCallErrorAlreadyInThisState = @"ALREADY_IN_THIS_STATE";
NSString *const kCallErrorMediaIsOnHold = @"MEDIA_IS_ON_HOLD";
NSString *const kCallErrorInternal = @"INTERNAL_ERROR";

NSString *const kAudioFileErrorInternal = @"INTERNAL_ERROR";
NSString *const kAudioFileErrorInterrupted = @"INTERRUPTED";
NSString *const kAudioFileErrorDestroyed = @"DESTROYED";
NSString *const kAudioFileErrorAlreadyPlaying = @"ALREADY_PLAYING";
NSString *const kAudioFileErrorCallKitActivated = @"CALLKIT_ACTIVATED";
NSString *const kAudioFileErrorCallKitDeactivated = @"CALLKIT_DEACTIVATED";
NSString *const kAudioFileErrorFailedToConfigureAudioSession = @"FAILED_TO_CONFIGURE_AUDIO_SESSION";

NSString *const kAudioDeviceEarpiece = @"Earpiece";
NSString *const kAudioDeviceSpeaker = @"Speaker";
NSString *const kAudioDeviceWired = @"WiredHeadset";
NSString *const kAudioDeviceBluetooth = @"Bluetooth";
NSString *const kAudioDeviceNone = @"None";

NSString *const kCameraTypeBack = @"back";
NSString *const kCameraTypeFront = @"front";

NSString *const kEventMesEditUser = @"VIEditUser";
NSString *const kEventMesSetStatus = @"VISetStatus";
NSString *const kEventMesSubscribe = @"VISubscribe";
NSString *const kEventMesUnsubscribe = @"VIUnsubscribe";
NSString *const kEventMesCreateConversation = @"VICreateConversation";
NSString *const kEventMesRemoveConversation = @"VIRemoveConversation";
NSString *const kEventMesEditConversation = @"VIEditConversation";
NSString *const kEventMesTyping = @"VITyping";
NSString *const kEventMesSendMessage = @"VISendMessage";
NSString *const kEventMesEditMessage = @"VIEditMessage";
NSString *const kEventMesRemoveMessage = @"VIRemoveMessage";
NSString *const kEventMesRead = @"VIRead";

NSString *const kEventNameMesGetUser = @"GetUser";
NSString *const kEventNameMesEditUser = @"EditUser";
NSString *const kEventNameMesSetStatus = @"SetStatus";
NSString *const kEventNameMesSubscribe = @"Subscribe";
NSString *const kEventNameMesUnsubscribe = @"Unsubscribe";
NSString *const kEventNameMesCreateConversation = @"CreateConversation";
NSString *const kEventNameMesGetConversation = @"GetConversation";
NSString *const kEventNameMesRemoveConversation = @"RemoveConversation";
NSString *const kEventNameMesEditConversation = @"EditConversation";
NSString *const kEventNameMesTyping = @"Typing";
NSString *const kEventNameMesSendMessage = @"SendMessage";
NSString *const kEventNameMesEditMessage = @"EditMessage";
NSString *const kEventNameMesRemoveMessage = @"RemoveMessage";
NSString *const kEventNameMesDelivered = @"Delivered";
NSString *const kEventNameMesRead = @"Read";
NSString *const kEventNameMesRetransmitEvents = @"RetransmitEvents";
NSString *const kEventNameMesError = @"Error";
NSString *const kEventNameMesUnknown = @"Unknown";
NSString *const kEventNameMesGetSubscriptionList = @"GetSubscriptions";
NSString *const kEventNameMesGetPublicConversations = @"GetPublicConversations";

NSString *const kEventMesActionGetUser = @"getUser";
NSString *const kEventMesActionGetUsers = @"getUsers";
NSString *const kEventMesActionEditUser = @"editUser";
NSString *const kEventMesActionSetStatus = @"setStatus";
NSString *const kEventMesActionSubscribe = @"subscribe";
NSString *const kEventMesActionUnsubscribe = @"unsubscribe";
NSString *const kEventMesActionManageNotifications = @"manageNotifications";
NSString *const kEventMesActionCreateConversation = @"createConversation";
NSString *const kEventMesActionGetConversation = @"getConversation";
NSString *const kEventMesActionGetConversations = @"getConversations";
NSString *const kEventMesActionRemoveConversation = @"removeConversation";
NSString *const kEventMesActionEditConversation = @"editConversation";
NSString *const kEventMesActionJoinConversation = @"joinConversation";
NSString *const kEventMesActionLeaveConversation = @"leaveConversation";
NSString *const kEventMesActionAddParticipants = @"addParticipants";
NSString *const kEventMesActionEditParticipants = @"editParticipants";
NSString *const kEventMesActionRemoveParticipants = @"removeParticipants";
NSString *const kEventMesActionTyping = @"typing";
NSString *const kEventMesActionSendMessage = @"sendMessage";
NSString *const kEventMesActionEditMessage = @"editMessage";
NSString *const kEventMesActionRemoveMessage = @"removeMessage";
NSString *const kEventMesActionDelivered = @"delivered";
NSString *const kEventMesActionRead = @"read";
NSString *const kEventMesActionRetransmitEvents = @"retransmitEvents";
NSString *const kEventMesActionUnknown = @"unknown";
NSString *const kEventMesActionGetSubscriptionList = @"getSubscriptions";
NSString *const kEventMesActionGetPublicConversations = @"getPublicConversations";

//Base event
NSString *const kEventMesParamEventType = @"eventType";
NSString *const kEventMesParamAction = @"action";
NSString *const kEventMesParamEventIMUserId = @"imUserId";

//User
NSString *const kEventMesParamUser = @"user";
NSString *const kEventMesParamIMId = @"imId";
NSString *const kEventMesParamName = @"name";
NSString *const kEventMesParamDisplayName = @"displayName";
NSString *const kEventMesParamConversationList = @"conversationList";
NSString *const kEventMesParamCustomData = @"customData";
NSString *const kEventMesParamPrivateCustomData = @"privateCustomData";
NSString *const kEventMesParamUserNotifications = @"notifications";
NSString *const kEventMesParamLeaveConversationList = @"leaveConversationList";
NSString *const kEventMesParamIsDeleted = @"isDeleted";

// Status
NSString *const kEventMesParamOnline = @"online";

//????
NSString *const kEventMesParamTimestamp = @"timestamp";

// Subscription
NSString *const kEventMesParamUsers = @"users";


// Conversation Participant
NSString *const kEventMesParamCanWrite = @"canWrite";
NSString *const kEventMesParamCanManageParticipants = @"canManageParticipants";
NSString *const kEventMesParamCanEditMessages = @"canEditMessages";
NSString *const kEventMesParamCanEditAllMessages = @"canEditAllMessages";
NSString *const kEventMesParamCanRemoveMessages = @"canRemoveMessages";
NSString *const kEventMesParamCanRemoveAllMessages = @"canRemoveAllMessages";
NSString *const kEventMesParamOwner = @"owner";
NSString *const kEventMesParamLastRead = @"lastReadEventSequence";

// Conversation
NSString *const kEventMesParamSequence = @"sequence";
NSString *const kEventMesParamUuid = @"uuid";
NSString *const kEventMesParamTitle = @"title";
NSString *const kEventMesParamCreatedTime = @"createdTime";
NSString *const kEventMesParamDirect = @"direct";
NSString *const kEventMesParamLastSequence = @"lastSequence";
NSString *const kEventMesParamLastUpdateTime = @"lastUpdateTime";
NSString *const kEventMesParamParticipants = @"participants";
NSString *const kEventMesParamPublicJoin = @"publicJoin";
NSString *const kEventMesParamUber = @"uber";
NSString *const kEventMesParamConversation = @"conversation";



NSString *const kEventMesParamConversationUuid = @"conversationUUID";
NSString *const kEventMesParamSender = @"sender";
NSString *const kEventMesParamText = @"text";
NSString *const kEventMesParamType = @"type";
NSString *const kEventMesParamData = @"data";
NSString *const kEventMesParamPayload = @"payload";
NSString *const kEventMesParamMessage = @"message";
NSString *const kEventMesParamFromSequence = @"from";
NSString *const kEventMesParamToSequence = @"to";
NSString *const kEventMesParamEvents = @"events";
NSString *const kEventMesParamDescription = @"description";
NSString *const kEventMesParamCode = @"code";

NSString *const kEditMessage = @"EditMessage";
NSString *const kSendMessage = @"SendMessage";

NSString *const kInvalidArguments = @"Invalid argument(s).";
