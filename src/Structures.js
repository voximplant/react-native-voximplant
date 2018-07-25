/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';


/**
 * @memberOf Voximplant
 * @property {boolean} [enableVideo] - Enable video functionality. Set to true by default. ANDROID ONLY
 * @property {boolean} [enableCameraMirroring] - Enable/disable front facing camera mirroring. True by default. ANDROID ONLY.
 * @property {boolean} [enableLogcatLogging] - Enable log output to logcat. True by default. ANDROID ONLY
 * @property {boolean} [H264first] - Use H264 video codec, if exist. ANDROID ONLY
 * @property {boolean} [enableHWAcceleration] - Enable hardware video acceleration. Set to true by default. Should be set to false, if provideLocalFramesInByteBuffers is set to true. ANDROID ONLY
 * @property {boolean} [provideLocalFramesInByteBuffers] - Request video frames from camera in I420 format with byte buffers. Set to false by default. If set to false, video frames from camera will be provided in I420 format with textures. ANDROID ONLY
 * @property {boolean} [enableDebugLogging] - Enable debug logging. Set to false by default. ANDROID ONLY
 * @property {Voximplant.LogLevel} [logLevel] - Log levels. IOS ONLY
 * @property {boolean} [saveLogsToFile] -  Enable saving of the logs to file. Log files are located at: Library/Caches/Logs. False by default. IOS ONLY
 * @property {string} [bundleId] - Application bundle id/package name for iOS/Android respectively.
 *                                 You need to set this only if you are going to send push notifications across several mobile apps on a specific platform (Android or iOS)
 *                                 using a single Voximplant application.
 */
const ClientConfig = {

};

/**
 * @memberOf Voximplant
 * @property {boolean} [connectivityCheck] - Checks whether UDP traffic will flow correctly between device and the Voximplant cloud. This check reduces connection speed
 * @property {array} [servers] - Server name of particular media gateway for connection
 */
const ConnectOptions = {

};

/**
 * @memberOf Voximplant
 * @property {number} accessExpire - Seconds to access token expire
 * @property {string} accessToken - Access token that can be used to login before accessExpire
 * @property {number} refreshExpire - Seconds to refresh token expire
 * @property {string} refreshToken - Refresh token that can be used one time before refresh token expired
 */
const LoginTokens = {

};

/**
 * @memberOf Voximplant
 * @property {boolean} [receiveVideo] - Set true if video receive is enabled for a call. True by default.
 * @property {boolean} [sendVideo] - Set true if video send is enabled for a call. False by default.
 */
const VideoFlags = {

};

/**
 * @memberOf Voximplant
 * @property {boolean} [H264First] - Use H264 video codec, if exist (IOS ONLY)
 * @property {string} [customData] - Custom string associated with the call session. It can be later obtained from Call History using HTTP API. Maximum size is 200 bytes
 * @property {object} [extraHeaders] - Optional custom parameter (SIP headers) that should be passes with call (INVITE) message. Parameter names must start with "X-" to be processed. Headers size limit is 200  bytes
 * @property {Voximplant.VideoFlags} [video] - Tells if video should be supported for the call
 */
const CallSettings = {

};