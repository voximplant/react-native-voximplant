/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

FOUNDATION_EXPORT NSString *const kEventConnectionEstablished;
FOUNDATION_EXPORT NSString *const kEventConnectionClosed;
FOUNDATION_EXPORT NSString *const kEventConnectionFailed;
FOUNDATION_EXPORT NSString *const kEventAuthResult;
FOUNDATION_EXPORT NSString *const kEventAuthTokenResult;
FOUNDATION_EXPORT NSString *const kEventIncomingCall;
FOUNDATION_EXPORT NSString *const kEventLogMessage;

FOUNDATION_EXPORT NSString *const kEventCallConnected;
FOUNDATION_EXPORT NSString *const kEventCallDisconnected;
FOUNDATION_EXPORT NSString *const kEventCallEndpointAdded;
FOUNDATION_EXPORT NSString *const kEventCallFailed;
FOUNDATION_EXPORT NSString *const kEventCallICECompleted;
FOUNDATION_EXPORT NSString *const kEventCallICETimeout;
FOUNDATION_EXPORT NSString *const kEventCallInfoReceived;
FOUNDATION_EXPORT NSString *const kEventCallLocalVideoStreamAdded;
FOUNDATION_EXPORT NSString *const kEventCallLocalVideoStreamRemoved;
FOUNDATION_EXPORT NSString *const kEventCallMessageReceived;
FOUNDATION_EXPORT NSString *const kEventCallProgressToneStart;
FOUNDATION_EXPORT NSString *const kEventCallProgressToneStop;
FOUNDATION_EXPORT NSString *const kEventEndpointInfoUpdate;
FOUNDATION_EXPORT NSString *const kEventEndpointRemoteStreamAdded;
FOUNDATION_EXPORT NSString *const kEventEndpointRemoteStreamRemoved;
FOUNDATION_EXPORT NSString *const kEventEndpointRemoved;

FOUNDATION_EXPORT NSString *const kEventAudioDeviceChanged;
FOUNDATION_EXPORT NSString *const kEventAudioDeviceListChanged;

FOUNDATION_EXPORT NSString *const kEventAudioFileStarted;
FOUNDATION_EXPORT NSString *const kEventAudioFileStopped;

FOUNDATION_EXPORT NSString *const kEventNameConnectionEstablished;
FOUNDATION_EXPORT NSString *const kEventNameConnectionFailed;
FOUNDATION_EXPORT NSString *const kEventNameConnectionClosed;
FOUNDATION_EXPORT NSString *const kEventNameAuthResult;
FOUNDATION_EXPORT NSString *const kEventNameAuthTokenResult;
FOUNDATION_EXPORT NSString *const kEventNameIncomingCall;

FOUNDATION_EXPORT NSString *const kEventNameCallConnected;
FOUNDATION_EXPORT NSString *const kEventNameCallDisconnected;
FOUNDATION_EXPORT NSString *const kEventNameCallEndpointAdded;
FOUNDATION_EXPORT NSString *const kEventNameCallFailed;
FOUNDATION_EXPORT NSString *const kEventNameCallICECompleted;
FOUNDATION_EXPORT NSString *const kEventNameCallICETimeout;
FOUNDATION_EXPORT NSString *const kEventNameCallInfoReceived;
FOUNDATION_EXPORT NSString *const kEventNameCallLocalVideoStreamAdded;
FOUNDATION_EXPORT NSString *const kEventNameCallLocalVideoStreamRemoved;
FOUNDATION_EXPORT NSString *const kEventNameCallMessageReceived;
FOUNDATION_EXPORT NSString *const kEventNameCallProgressToneStart;
FOUNDATION_EXPORT NSString *const kEventNameCallProgressToneStop;
FOUNDATION_EXPORT NSString *const kEventNameEndpointInfoUpdate;
FOUNDATION_EXPORT NSString *const kEventNameEndpointRemoteStreamAdded;
FOUNDATION_EXPORT NSString *const kEventNameEndpointRemoteStreanRemoved;
FOUNDATION_EXPORT NSString *const kEventNameEndpointRemoved;

FOUNDATION_EXPORT NSString *const kEventNameAudioDeviceChanged;
FOUNDATION_EXPORT NSString *const kEventNameAudioDeviceListChanged;

FOUNDATION_EXPORT NSString *const kEventNameAudioFileStarted;
FOUNDATION_EXPORT NSString *const kEventNameAudioFileStopped;

FOUNDATION_EXPORT NSString *const kEventParamName;
FOUNDATION_EXPORT NSString *const kEventParamResult;
FOUNDATION_EXPORT NSString *const kEventParamDisplayName;
FOUNDATION_EXPORT NSString *const kEventParamTokens;
FOUNDATION_EXPORT NSString *const kEventParamAccessToken;
FOUNDATION_EXPORT NSString *const kEventParamAccessExpire;
FOUNDATION_EXPORT NSString *const kEventParamRefreshToken;
FOUNDATION_EXPORT NSString *const kEventParamRefreshExpire;
FOUNDATION_EXPORT NSString *const kEventParamKey;
FOUNDATION_EXPORT NSString *const kEventParamCode;
FOUNDATION_EXPORT NSString *const kEventParamMessage;
FOUNDATION_EXPORT NSString *const kEventParamIncomingVideo;
FOUNDATION_EXPORT NSString *const kEventParamCallKitUUID;

FOUNDATION_EXPORT NSString *const kEventParamLogLevel;
FOUNDATION_EXPORT NSString *const kEventParamLogMessage;
FOUNDATION_EXPORT NSString *const kEventParamLogLevelError;
FOUNDATION_EXPORT NSString *const kEventParamLogLevelWarning;
FOUNDATION_EXPORT NSString *const kEventParamLogLevelInfo;
FOUNDATION_EXPORT NSString *const kEventParamLogLevelDebug;
FOUNDATION_EXPORT NSString *const kEventParamLogLevelVerbose;

FOUNDATION_EXPORT NSString *const kEventParamCallId;
FOUNDATION_EXPORT NSString *const kEventParamHeaders;
FOUNDATION_EXPORT NSString *const kEventParamAnsweredElsewhere;
FOUNDATION_EXPORT NSString *const kEventParamReason;
FOUNDATION_EXPORT NSString *const kEventParamBody;
FOUNDATION_EXPORT NSString *const kEventParamMimeType;
FOUNDATION_EXPORT NSString *const kEventParamText;
FOUNDATION_EXPORT NSString *const kEventParamEndpointId;
FOUNDATION_EXPORT NSString *const kEventParamEndpointName;
FOUNDATION_EXPORT NSString *const kEventParamEndpointSipUri;
FOUNDATION_EXPORT NSString *const kEventParamVideoStreamId;
FOUNDATION_EXPORT NSString *const kEventParamCurrentAudioDevice;
FOUNDATION_EXPORT NSString *const kEventParamDeviceList;
FOUNDATION_EXPORT NSString *const kEventParamVideoStreamType;

FOUNDATION_EXPORT NSString *const kEventParamAudioFileId;
FOUNDATION_EXPORT NSString *const kEventParamError;

FOUNDATION_EXPORT NSString *const kVideoStreamTypeVideo;
FOUNDATION_EXPORT NSString *const kVideoStreamTypeScreenSharing;

FOUNDATION_EXPORT NSString *const kScaleTypeFit;
FOUNDATION_EXPORT NSString *const kScaleTypeFill;

FOUNDATION_EXPORT NSString *const kCallErrorRejected;
FOUNDATION_EXPORT NSString *const kCallErrorTimeout;
FOUNDATION_EXPORT NSString *const kCallErrorAlreadyInThisState;
FOUNDATION_EXPORT NSString *const kCallErrorMediaIsOnHold;
FOUNDATION_EXPORT NSString *const kCallErrorInternal;

FOUNDATION_EXPORT NSString *const kAudioFileErrorInternal;
FOUNDATION_EXPORT NSString *const kAudioFileErrorInterrupted;
FOUNDATION_EXPORT NSString *const kAudioFileErrorDestroyed;
FOUNDATION_EXPORT NSString *const kAudioFileErrorAlreadyPlaying;
FOUNDATION_EXPORT NSString *const kAudioFileErrorCallKitActivated;
FOUNDATION_EXPORT NSString *const kAudioFileErrorCallKitDeactivated;
FOUNDATION_EXPORT NSString *const kAudioFileErrorFailedToConfigureAudioSession;

FOUNDATION_EXPORT NSString *const kAudioDeviceEarpiece;
FOUNDATION_EXPORT NSString *const kAudioDeviceSpeaker;
FOUNDATION_EXPORT NSString *const kAudioDeviceWired;
FOUNDATION_EXPORT NSString *const kAudioDeviceBluetooth;
FOUNDATION_EXPORT NSString *const kAudioDeviceNone;

FOUNDATION_EXPORT NSString *const kCameraTypeBack;
FOUNDATION_EXPORT NSString *const kCameraTypeFront;


FOUNDATION_EXPORT NSString *const kEventMesEditUser;
FOUNDATION_EXPORT NSString *const kEventMesSetStatus;
FOUNDATION_EXPORT NSString *const kEventMesSubscribe;
FOUNDATION_EXPORT NSString *const kEventMesUnsubscribe;
FOUNDATION_EXPORT NSString *const kEventMesCreateConversation;
FOUNDATION_EXPORT NSString *const kEventMesRemoveConversation;
FOUNDATION_EXPORT NSString *const kEventMesEditConversation;
FOUNDATION_EXPORT NSString *const kEventMesTyping;
FOUNDATION_EXPORT NSString *const kEventMesSendMessage;
FOUNDATION_EXPORT NSString *const kEventMesEditMessage;
FOUNDATION_EXPORT NSString *const kEventMesRemoveMessage;
FOUNDATION_EXPORT NSString *const kEventMesRead;

FOUNDATION_EXPORT NSString *const kEventNameMesGetUser;
FOUNDATION_EXPORT NSString *const kEventNameMesEditUser;
FOUNDATION_EXPORT NSString *const kEventNameMesSetStatus;
FOUNDATION_EXPORT NSString *const kEventNameMesSubscribe;
FOUNDATION_EXPORT NSString *const kEventNameMesUnsubscribe;
FOUNDATION_EXPORT NSString *const kEventNameMesCreateConversation;
FOUNDATION_EXPORT NSString *const kEventNameMesGetConversation;
FOUNDATION_EXPORT NSString *const kEventNameMesRemoveConversation;
FOUNDATION_EXPORT NSString *const kEventNameMesEditConversation;
FOUNDATION_EXPORT NSString *const kEventNameMesTyping;
FOUNDATION_EXPORT NSString *const kEventNameMesSendMessage;
FOUNDATION_EXPORT NSString *const kEventNameMesEditMessage;
FOUNDATION_EXPORT NSString *const kEventNameMesRemoveMessage;
FOUNDATION_EXPORT NSString *const kEventNameMesDelivered;
FOUNDATION_EXPORT NSString *const kEventNameMesRead;
FOUNDATION_EXPORT NSString *const kEventNameMesRetransmitEvents;
FOUNDATION_EXPORT NSString *const kEventNameMesError;
FOUNDATION_EXPORT NSString *const kEventNameMesUnknown;
FOUNDATION_EXPORT NSString *const kEventNameMesGetSubscriptionList;
FOUNDATION_EXPORT NSString *const kEventNameMesGetPublicConversations;

FOUNDATION_EXPORT NSString *const kEventMesActionGetUser;
FOUNDATION_EXPORT NSString *const kEventMesActionGetUsers;
FOUNDATION_EXPORT NSString *const kEventMesActionEditUser;
FOUNDATION_EXPORT NSString *const kEventMesActionSetStatus;
FOUNDATION_EXPORT NSString *const kEventMesActionSubscribe;
FOUNDATION_EXPORT NSString *const kEventMesActionUnsubscribe;
FOUNDATION_EXPORT NSString *const kEventMesActionManageNotifications;
FOUNDATION_EXPORT NSString *const kEventMesActionCreateConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionGetConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionGetConversations;
FOUNDATION_EXPORT NSString *const kEventMesActionRemoveConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionEditConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionJoinConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionLeaveConversation;
FOUNDATION_EXPORT NSString *const kEventMesActionAddParticipants;
FOUNDATION_EXPORT NSString *const kEventMesActionEditParticipants;
FOUNDATION_EXPORT NSString *const kEventMesActionRemoveParticipants;
FOUNDATION_EXPORT NSString *const kEventMesActionTyping;
FOUNDATION_EXPORT NSString *const kEventMesActionSendMessage;
FOUNDATION_EXPORT NSString *const kEventMesActionEditMessage;
FOUNDATION_EXPORT NSString *const kEventMesActionRemoveMessage;
FOUNDATION_EXPORT NSString *const kEventMesActionDelivered;
FOUNDATION_EXPORT NSString *const kEventMesActionRead;
FOUNDATION_EXPORT NSString *const kEventMesActionRetransmitEvents;
FOUNDATION_EXPORT NSString *const kEventMesActionUnknown;
FOUNDATION_EXPORT NSString *const kEventMesActionGetSubscriptionList;
FOUNDATION_EXPORT NSString *const kEventMesActionGetPublicConversations;

// Base event
FOUNDATION_EXPORT NSString *const kEventMesParamEventType;
FOUNDATION_EXPORT NSString *const kEventMesParamAction;
FOUNDATION_EXPORT NSString *const kEventMesParamEventIMUserId;

// User
FOUNDATION_EXPORT NSString *const kEventMesParamUser;
FOUNDATION_EXPORT NSString *const kEventMesParamIMId;
FOUNDATION_EXPORT NSString *const kEventMesParamName;
FOUNDATION_EXPORT NSString *const kEventMesParamDisplayName;
FOUNDATION_EXPORT NSString *const kEventMesParamConversationList;
FOUNDATION_EXPORT NSString *const kEventMesParamCustomData;
FOUNDATION_EXPORT NSString *const kEventMesParamPrivateCustomData;
FOUNDATION_EXPORT NSString *const kEventMesParamUserNotifications;
FOUNDATION_EXPORT NSString *const kEventMesParamLeaveConversationList;
FOUNDATION_EXPORT NSString *const kEventMesParamIsDeleted;

// Status
FOUNDATION_EXPORT NSString *const kEventMesParamOnline;

//???
FOUNDATION_EXPORT NSString *const kEventMesParamTimestamp;

// Subscription
FOUNDATION_EXPORT NSString *const kEventMesParamUsers;

// Conversation Participant
FOUNDATION_EXPORT NSString *const kEventMesParamCanWrite;
FOUNDATION_EXPORT NSString *const kEventMesParamCanManageParticipants;
FOUNDATION_EXPORT NSString *const kEventMesParamCanEditMessages;
FOUNDATION_EXPORT NSString *const kEventMesParamCanEditAllMessages;
FOUNDATION_EXPORT NSString *const kEventMesParamCanRemoveMessages;
FOUNDATION_EXPORT NSString *const kEventMesParamCanRemoveAllMessages;
FOUNDATION_EXPORT NSString *const kEventMesParamOwner;
FOUNDATION_EXPORT NSString *const kEventMesParamLastRead;

// Conversation
FOUNDATION_EXPORT NSString *const kEventMesParamSequence;
FOUNDATION_EXPORT NSString *const kEventMesParamUuid;
FOUNDATION_EXPORT NSString *const kEventMesParamTitle;
FOUNDATION_EXPORT NSString *const kEventMesParamCreatedTime;
FOUNDATION_EXPORT NSString *const kEventMesParamDirect;
FOUNDATION_EXPORT NSString *const kEventMesParamLastSequence;
FOUNDATION_EXPORT NSString *const kEventMesParamLastUpdateTime;
FOUNDATION_EXPORT NSString *const kEventMesParamParticipants;
FOUNDATION_EXPORT NSString *const kEventMesParamPublicJoin;
FOUNDATION_EXPORT NSString *const kEventMesParamUber;
FOUNDATION_EXPORT NSString *const kEventMesParamConversation;


FOUNDATION_EXPORT NSString *const kEventMesParamConversationUuid;
FOUNDATION_EXPORT NSString *const kEventMesParamSender;
FOUNDATION_EXPORT NSString *const kEventMesParamText;
FOUNDATION_EXPORT NSString *const kEventMesParamType;
FOUNDATION_EXPORT NSString *const kEventMesParamData;
FOUNDATION_EXPORT NSString *const kEventMesParamPayload;
FOUNDATION_EXPORT NSString *const kEventMesParamMessage;
FOUNDATION_EXPORT NSString *const kEventMesParamFromSequence;
FOUNDATION_EXPORT NSString *const kEventMesParamToSequence;
FOUNDATION_EXPORT NSString *const kEventMesParamEvents;
FOUNDATION_EXPORT NSString *const kEventMesParamDescription;
FOUNDATION_EXPORT NSString *const kEventMesParamCode;

FOUNDATION_EXPORT NSString *const kEditMessage;
FOUNDATION_EXPORT NSString *const kSendMessage;

FOUNDATION_EXPORT NSString *const kInvalidArguments;
