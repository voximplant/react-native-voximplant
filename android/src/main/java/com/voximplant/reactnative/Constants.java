/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
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
    static final String EVENT_ENDPOINT_INFO_UPDATED = "VIEnpointInfoUpdated";
    static final String EVENT_ENDPOINT_REMOTE_STREAM_ADDED = "VIEnpointRemoteVideoStreamAdded";
    static final String EVENT_ENDPOINT_REMOTE_STREAM_REMOVED = "VIEnpointRemoteVideoStreamRemoved";
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
}