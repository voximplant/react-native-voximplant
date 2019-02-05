/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

class Constants {
    static final String DISCONNECTED = "disconnected";
    static final String CONNECTING = "connecting";
    static final String CONNECTED = "connected";
    static final String LOGGING_IN = "logging_in";
    static final String LOGGED_IN = "logged_in";

    static final String EVENT_CONNECTION_ESTABLISHED = "VIConnectionEstablished";
    static final String EVENT_CONNECTION_CLOSED = "VIConnectionClosed";
    static final String EVENT_CONNECTION_FAILED = "VIConnectionFailed";
    static final String EVENT_AUTH_RESULT = "VIAuthResult";
    static final String EVENT_AUTH_TOKEN_RESULT = "VIAuthTokenResult";
    static final String EVENT_INCOMING_CALL = "VIIncomingCall";

    static final String EVENT_CALL_CONNECTED = "VICallConnected";
    static final String EVENT_CALL_DISCONNECTED = "VICallDisconnected";
    static final String EVENT_CALL_ENDPOINT_ADDED = "VICallEndpointAdded";
    static final String EVENT_CALL_FAILED = "VICallFailed";
    static final String EVENT_CALL_ICECOMPLETED = "VICallICECompleted";
    static final String EVENT_CALL_ICETIMEOUT = "VICallICETimeout";
    static final String EVENT_CALL_INFO_RECEIVED = "VICallInfoReceived";
    static final String EVENT_CALL_LOCAL_VIDEO_STREAM_ADDED = "VICallLocalVideoStreamAdded";
    static final String EVENT_CALL_LOCAL_VIDEO_STREAM_REMOVED = "VICallLocalVideoStreamRemoved";
    static final String EVENT_CALL_MESSAGE_RECEIVED = "VICallMessageReceived";
    static final String EVENT_CALL_PROGRESS_TONE_START = "VICallProgressToneStart";
    static final String EVENT_CALL_PROGRESS_TONE_STOP = "VICallProgressToneStop";
    static final String EVENT_ENDPOINT_INFO_UPDATED = "VIEndpointInfoUpdated";
    static final String EVENT_ENDPOINT_REMOTE_STREAM_ADDED = "VIEndpointRemoteVideoStreamAdded";
    static final String EVENT_ENDPOINT_REMOTE_STREAM_REMOVED = "VIEndpointRemoteVideoStreamRemoved";
    static final String EVENT_ENDPOINT_REMOVED = "VIEndpointRemoved";

    static final String EVENT_AUDIO_DEVICE_CHANGED = "VIAudioDeviceChanged";
    static final String EVENT_AUDIO_DEVICE_LIST_CHANGED = "VIAudioDeviceListChanged";

    static final String EVENT_CAMERA_DISCONNECTED = "VICameraDisconnected";
    static final String EVENT_CAMERA_ERROR = "VICameraError";
    static final String EVENT_CAMERA_SWITCH_DONE = "VICameraSwitchDone";
    static final String EVENT_CAMERA_SWITCH_ERROR = "VICameraSwitchError";


    static final String EVENT_NAME_CONNECTION_ESTABLISHED = "ConnectionEstablished";
    static final String EVENT_NAME_CONNECTION_FAILED = "ConnectionFailed";
    static final String EVENT_NAME_CONNECTION_CLOSED = "ConnectionClosed";
    static final String EVENT_NAME_AUTH_RESULT = "AuthResult";
    static final String EVENT_NAME_AUTH_TOKEN_RESULT = "AuthTokenResult";
    static final String EVENT_NAME_INCOMING_CALL = "IncomingCall";

    static final String EVENT_NAME_CALL_CONNECTED = "Connected";
    static final String EVENT_NAME_CALL_DISCONNECTED = "Disconnected";
    static final String EVENT_NAME_CALL_ENDPOINT_ADDED = "EndpointAdded";
    static final String EVENT_NAME_CALL_FAILED = "Failed";
    static final String EVENT_NAME_CALL_ICECOMPLETED = "ICECompleted";
    static final String EVENT_NAME_CALL_ICETIMEOUT = "ICETimeout";
    static final String EVENT_NAME_CALL_INFO_RECEIVED = "InfoReceived";
    static final String EVENT_NAME_CALL_LOCAL_VIDEO_STREAM_ADDED = "LocalVideoStreamAdded";
    static final String EVENT_NAME_CALL_LOCAL_VIDEO_STREAM_REMOVED = "LocalVideoStreamRemoved";
    static final String EVENT_NAME_CALL_MESSAGE_RECEIVED = "MessageReceived";
    static final String EVENT_NAME_CALL_PROGRESS_TONE_START = "ProgressToneStart";
    static final String EVENT_NAME_CALL_PROGRESS_TONE_STOP = "ProgressToneStop";
    static final String EVENT_NAME_ENDPOINT_INFO_UPDATED = "InfoUpdated";
    static final String EVENT_NAME_ENDPOINT_REMOTE_STREAM_ADDED = "RemoteVideoStreamAdded";
    static final String EVENT_NAME_ENDPOINT_REMOTE_STREAM_REMOVED = "RemoteVideoStreamRemoved";
    static final String EVENT_NAME_ENDPOINT_REMOVED = "Removed";

    static final String EVENT_NAME_AUDIO_DEVICE_CHANGED = "DeviceChanged";
    static final String EVENT_NAME_AUDIO_DEVICE_LIST_CHANGED = "DeviceListChanged";

    static final String EVENT_NAME_CAMERA_DISCONNECTED = "CameraDisconnected";
    static final String EVENT_NAME_CAMERA_ERROR = "CameraError";
    static final String EVENT_NAME_CAMERA_SWITCH_DONE = "CameraSwitchDone";
    static final String EVENT_NAME_CAMERA_SWITCH_ERROR = "CameraSwitchError";


    static final String EVENT_PARAM_NAME = "name";
    static final String EVENT_PARAM_RESULT = "result";
    static final String EVENT_PARAM_DISPLAY_NAME = "displayName";
    static final String EVENT_PARAM_TOKENS = "tokens";
    static final String EVENT_PARAM_ACCESS_TOKEN = "accessToken";
    static final String EVENT_PARAM_ACCESS_EXPIRE = "accessExpire";
    static final String EVENT_PARAM_REFRESH_TOKEN = "refreshToken";
    static final String EVENT_PARAM_REFRESH_EXPIRE = "refreshExpire";
    static final String EVENT_PARAM_KEY = "key";
    static final String EVENT_PARAM_CODE = "code";
    static final String EVENT_PARAM_MESSAGE = "message";
    static final String EVENT_PARAM_INCOMING_VIDEO = "video";

    static final String EVENT_PARAM_CALLID = "callId";
    static final String EVENT_PARAM_HEADERS = "headers";
    static final String EVENT_PARAM_ANSWERED_ELSEWHERE = "answeredElsewhere";
    static final String EVENT_PARAM_REASON = "reason";
    static final String EVENT_PARAM_BODY = "body";
    static final String EVENT_PARAM_MIMETYPE = "mimeType";
    static final String EVENT_PARAM_TEXT = "text";
    static final String EVENT_PARAM_ENDPOINTID = "endpointId";
    static final String EVENT_PARAM_ENDPOINT_NAME = "endpointName";
    static final String EVENT_PARAM_ENDPOINT_SIP_URI = "sipUri";
    static final String EVENT_PARAM_VIDEO_STREAM_ID = "videoStreamId";
    static final String EVENT_PARAM_IS_LOCAL = "isLocal";

    static final String EVENT_PARAM_CURRENT_AUDIO_DEVICE = "currentDevice";
    static final String EVENT_PARAM_AUDIO_DEVICE_LIST = "newDeviceList";

    static final String EVENT_PARAM_CAMERA_ERROR = "error";
    static final String EVENT_PARAM_IS_FRONT_CAMERA = "isFrontCamera";

    static final String CAMERA_TYPE_BACK = "back";
    static final String CAMERA_TYPE_FRONT = "front";
    static final int DEFAULT_CAMERA_RESOLUTION_WITDTH = 640;
    static final int DEFAULT_CAMERA_RESOLUTION_HEIGHT = 480;
    static final int DEFAULT_CAMERA_INDEX = 1;

    static final String SCALE_TYPE_FIT = "fit";
    static final String SCALE_TYPE_FILL = "fill";

    static final String BLUETOOTH = "Bluetooth";
    static final String EARPIECE = "Earpiece";
    static final String NONE = "None";
    static final String SPEAKER = "Speaker";
    static final String WIRED_HEADSET = "WiredHeadset";

    static final String REQUEST_ON_CALL_START = "REQUEST_ON_CALL_START";
    static final String REQUEST_ON_CALL_CONNECTED = "REQUEST_ON_CALL_CONNECTED";

    //Messenger
    static final String EVENT_MES_GET_USER = "VIGetUser";
    static final String EVENT_MES_EDIT_USER = "VIEditUser";
    static final String EVENT_MES_SET_STATUS = "VISetStatus";
    static final String EVENT_MES_SUBSCRIBE = "VISubscribe";
    static final String EVENT_MES_UNSUBSCRIBE = "VIUnsubscribe";
    static final String EVENT_MES_CREATE_CONVERSATION = "VICreateConversation";
    static final String EVENT_MES_GET_CONVERSATION = "VIGetConversation";
    static final String EVENT_MES_REMOVE_CONVERSATION = "VIRemoveConversation";
    static final String EVENT_MES_EDIT_CONVERSATION = "VIEditConversation";
    static final String EVENT_MES_TYPING = "VITyping";
    static final String EVENT_MES_SEND_MESSAGE = "VISendMessage";
    static final String EVENT_MES_EDIT_MESSAGE = "VIEditMessage";
    static final String EVENT_MES_REMOVE_MESSAGE = "VIRemoveMessage";
    static final String EVENT_MES_DELIVERED = "VIDelivered";
    static final String EVENT_MES_READ = "VIRead";
    static final String EVENT_MES_RETRANSMIT_EVENTS = "VIRetransmitEvents";
    static final String EVENT_MES_ERROR = "VIError";

    static final String EVENT_NAME_MES_GET_USER = "GetUser";
    static final String EVENT_NAME_MES_EDIT_USER = "EditUser";
    static final String EVENT_NAME_MES_SET_STATUS = "SetStatus";
    static final String EVENT_NAME_MES_SUBSCRIBE = "Subscribe";
    static final String EVENT_NAME_MES_UNSUBSCRIBE = "Unsubscribe";
    static final String EVENT_NAME_MES_CREATE_CONVERSATION = "CreateConversation";
    static final String EVENT_NAME_MES_GET_CONVERSATION = "GetConversation";
    static final String EVENT_NAME_MES_REMOVE_CONVERSATION = "RemoveConversation";
    static final String EVENT_NAME_MES_EDIT_CONVERSATION = "EditConversation";
    static final String EVENT_NAME_MES_TYPING = "Typing";
    static final String EVENT_NAME_MES_SEND_MESSAGE = "SendMessage";
    static final String EVENT_NAME_MES_EDIT_MESSAGE = "EditMessage";
    static final String EVENT_NAME_MES_REMOVE_MESSAGE = "RemoveMessage";
    static final String EVENT_NAME_MES_DELIVERED = "Delivered";
    static final String EVENT_NAME_MES_READ = "Read";
    static final String EVENT_NAME_MES_RETRANSMIT_EVENTS = "RetransmitEvents";
    static final String EVENT_NAME_MES_ERROR = "Error";
    static final String EVENT_NAME_MES_UNKNOWN = "Unknown";

    static final String EVENT_MES_ACTION_GET_USER = "getUser";
    static final String EVENT_MES_ACTION_GET_USERS = "getUsers";
    static final String EVENT_MES_ACTION_EDIT_USER = "editUser";
    static final String EVENT_MES_ACTION_SET_STATUS = "setStatus";
    static final String EVENT_MES_ACTION_SUBSCRIBE = "subscribe";
    static final String EVENT_MES_ACTION_UNSUBSCRIBE = "unsubscribe";
    static final String EVENT_MES_ACTION_MANAGE_NOTIFICATIONS = "manageNotifications";
    static final String EVENT_MES_ACTION_CREATE_CONVERSATION = "createConversation";
    static final String EVENT_MES_ACTION_GET_CONVERSATION = "getConversation";
    static final String EVENT_MES_ACTION_GET_CONVERSATIONS = "getConversations";
    static final String EVENT_MES_ACTION_REMOVE_CONVERSATION = "removeConversation";
    static final String EVENT_MES_ACTION_LEAVE_CONVERSATION = "leaveConversation";
    static final String EVENT_MES_ACTION_JOIN_CONVERSATION = "joinConversation";
    static final String EVENT_MES_ACTION_ADD_PARTICIPANTS = "addParticipants";
    static final String EVENT_MES_ACTION_EDIT_PARTICIPANTS = "editParticipants";
    static final String EVENT_MES_ACTION_REMOVE_PARTICIPANTS = "removeParticipants";
    static final String EVENT_MES_ACTION_EDIT_CONVERSATION = "editConversation";
    static final String EVENT_MES_ACTION_TYPING = "typing";
    static final String EVENT_MES_ACTION_SEND_MESSAGE = "sendMessage";
    static final String EVENT_MES_ACTION_EDIT_MESSAGE = "editMessage";
    static final String EVENT_MES_ACTION_REMOVE_MESSAGE = "removeMessage";
    static final String EVENT_MES_ACTION_DELIVERED = "delivered";
    static final String EVENT_MES_ACTION_READ = "read";
    static final String EVENT_MES_ACTION_RETRANSMIT_EVENTS = "retransmitEvents";
    static final String EVENT_MES_ACTION_UNKNOWN = "unknown";

    static final String EVENT_MES_PARAM_EVENT_TYPE = "messengerEventType";
    static final String EVENT_MES_PARAM_ACTION = "messengerAction";
    static final String EVENT_MES_PARAM_USER_ID = "userId";
    static final String EVENT_MES_PARAM_CONVERSATIONS_LIST = "conversationsList";
    static final String EVENT_MES_PARAM_CUSTOM_DATA = "customData";
    static final String EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA = "privateCustomData";
    static final String EVENT_MES_PARAM_USER = "user";
    static final String EVENT_MES_PARAM_USER_STATUS = "userStatus";
    static final String EVENT_MES_PARAM_ONLINE = "online";
    static final String EVENT_MES_PARAM_TIMESTAMP = "timestamp";
    static final String EVENT_MES_PARAM_USERS = "users";
    static final String EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS = "messengerNotifications";
    static final String EVENT_MES_PARAM_CAN_WRITE = "canWrite";
    static final String EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS = "canManageParticipants";
    static final String EVENT_MES_PARAM_SEQUENCE = "sequence";
    static final String EVENT_MES_PARAM_UUID = "uuid";
    static final String EVENT_MES_PARAM_TITLE = "title";
    static final String EVENT_MES_PARAM_CREATED_AT = "createdAt";
    static final String EVENT_MES_PARAM_DISTINCT = "distinct";
    static final String EVENT_MES_PARAM_LAST_READ = "lastRead";
    static final String EVENT_MES_PARAM_LAST_SEQ = "lastSeq";
    static final String EVENT_MES_PARAM_LAST_UPDATE = "lastUpdate";
    static final String EVENT_MES_PARAM_PARTICIPANTS = "participants";
    static final String EVENT_MES_PARAM_PUBLIC_JOIN = "publicJoin";
    static final String EVENT_MES_PARAM_IS_UBER = "isUber";
    static final String EVENT_MES_PARAM_CONVERSATION = "conversation";
    static final String EVENT_MES_PARAM_CONVERSATION_UUID = "conversationUUID";
    static final String EVENT_MES_PARAM_SENDER = "sender";
    static final String EVENT_MES_PARAM_TEXT = "text";
    static final String EVENT_MES_PARAM_TYPE = "type";
    static final String EVENT_MES_PARAM_DATA = "data";
    static final String EVENT_MES_PARAM_PAYLOAD = "payload";
    static final String EVENT_MES_PARAM_MESSAGE = "message";
    static final String EVENT_MES_PARAM_FROM_SEQUENCE = "fromSequence";
    static final String EVENT_MES_PARAM_TO_SEQUENCE = "toSequence";
    static final String EVENT_MES_PARAM_EVENTS = "events";
    static final String EVENT_MES_PARAM_DESCRIPTION = "description";
    static final String EVENT_MES_PARAM_CODE = "code";

    static final String EDIT_MESSAGE = "EditMessage";
    static final String SEND_MESSAGE = "SendMessage";
}