/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';


/**
 * @property {boolean} enableVideo - Enable video functionality. Set to true by default. ANDROID ONLY
 * @property {boolean} enableHWAcceleration - Enable hardware video acceleration. Set to true by default. Should be set to false, if provideLocalFramesInByteBuffers is set to true. ANDROID ONLY
 * @property {boolean} provideLocalFramesInByteBuffers - Request video frames from camera in I420 format with byte buffers. Set to false by default. If set to false, video frames from camera will be provided in I420 format with textures. ANDROID ONLY
 * @property {boolean} enableDebugLogging - Enable debug logging. Set to false by default. ANDROID ONLY
 * @property {LogLevel} logLevel - Log levels. IOS ONLY
 */
var ClientConfig = {

};

/**
 * @property {boolean} connectivityCheck - Checks whether UDP traffic will flow correctly between device and the Voximplant cloud. This check reduces connection speed
 * @property {array} servers - Server name of particular media gateway for connection
 */
var ConnectOptions = {

};


/**
 * Enum of log levels. IOS ONLY
 * @enum {string}
 */
export const LogLevel = {
    /**
     * Log verbosity level, to include only error messages
     */
    ERROR: "error",
    /**
     * Log verbosity level to include warning messages
     */
    WARNING: "warning",
    /**
     * Default log verbosity level, to include informational messages
     */
    INFO: "info",
    /**
     * Log verbosity level to include debug messages
     */
    DEBUG: "debug",
    /**
     * Log verbosity level to include verbose messages
     */
    VERBOSE: "verbose",
    /**
     * Log verbosity level to include all types of messages
     */
    MAX: "max"
};

export const ClientState = {
    DISCONNECTED : "disconnected",
    CONNECTING   : "connecting",
    CONNECTED    : "connected",
    LOGGING_IN   : "logging_in",
    LOGGED_IN    : "logged_in"
};

export const RenderScaleType = {
    SCALE_FILL : 'fill',
    SCALE_FIT  : 'fit'
};

export const CallEroor = {
    ALREADY_IN_THIS_STATE     : 'ALREADY_IN_THIS_STATE',
    FUNCTIONALITY_IS_DISABLED : 'FUNCTIONALITY_IS_DISABLED',
    INCORRECT_OPERATION       : 'INCORRECT_OPERATION',
    INTERNAL_ERROR            : 'INTERNAL_ERROR',
    MEDIA_IS_ON_HOLD          : 'MEDIA_IS_ON_HOLD',
    MISSING_PERMISSION        : 'MISSING_PERMISSION',
    REJECTED                  : 'REJECTED',
    TIMEOUT                   : 'TIMEOUT'
};

export const AudioDevice = {
    BLUETOOTH     : 'Bluetooth',
    EARPIECE      : 'Earpiece',
    NONE          : 'None',
    SPEAKER       : 'Speaker',
    WIRED_HEADSET : 'WiredHeadset'
};

export const CameraType = {
    /**
     * The facing of the camera is the same as that of the screen
     */
    FRONT : 'front',
    /**
     * The facing of the camera is opposite to that of the screen
     */
    BACK  : 'back'
};

/**
 * @property {number} accessExpire - Seconds to access token expire
 * @property {string} accessToken - Access token that can be used to login before accessExpire
 * @property {number} refreshExpire - Seconds to refresh token expire
 * @property {string} refreshToken - Refresh token that can be used one time before refresh token expired
 */
var LoginTokens = {

};

/**
 * @property {boolean} receiveVideo - Set true if video receive is enabled for a call
 * @property {boolean} sendVideo - Set true if video send is enabled for a call
 */
var VideoFlags = {

};

/**
 * @property {boolean} H264First - Use H264 video codec, if exist (IOS ONLY)
 * @property {string} customData - Custom string associated with the call session. It can be later obtained from Call History using HTTP API. Maximum size is 200 bytes
 * @property {object} extraHeaders - Optional custom parameter (SIP headers) that should be passes with call (INVITE) message. Parameter names must start with "X-" to be processed. Headers size limit is 200  bytes
 * @property {VideoFlags} video - Tells if video should be supported for the call 
 */
var CallSettings = {

};