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
    LogLevelError: "error",
    /**
     * Log verbosity level to include warning messages
     */
    LogLevelWarning: "warning",
    /**
     * Default log verbosity level, to include informational messages
     */
    LogLevelInfo: "info",
    /**
     * Log verbosity level to include debug messages
     */
    LogLevelDebug: "debug",
    /**
     * Log verbosity level to include verbose messages
     */
    LogLevelTrace: "verbose",
    /**
     * Log verbosity level to include all types of messages
     */
    LogLevelMax: "max"
};

/**
 * @property {number} accessExpire - Seconds to access token expire
 * @property {string} accessToken - Access token that can be used to login before accessExpire
 * @property {number} refreshExpire - Seconds to refresh token expire
 * @property {string} refreshToken - Refresh token that can be used one time before refresh token expired
 */
var LoginTokens = {

};