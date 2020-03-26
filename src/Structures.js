/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';


/**
 * @memberOf Voximplant
 * @property {boolean} [enableVideo] - Enable video functionality. Set to true by default. ANDROID ONLY
 * @property {boolean} [enableCameraMirroring] - Enable/disable front facing camera mirroring. True by default. ANDROID ONLY.
 * @property {boolean} [enableLogcatLogging] - Enable log output to logcat. True by default. ANDROID ONLY
 * @property {Voximplant.VideoCodec} [preferredVideoCodec] - Preferred video codec for all video calls.
 *                                  {@link Voximplant.VideoCodec.VP8} by default.
 *                                  Can be overridden for a particular call via {@link Voximplant.CallSettings.preferredVideoCodec}. ANDROID ONLY
 * @property {boolean} [enableDebugLogging] - Enable debug logging. Set to false by default. ANDROID ONLY
 * @property {Voximplant.LogLevel} [logLevel] - Log levels. IOS ONLY
 * @property {string} [bundleId] - Application bundle id/package name for iOS/Android respectively.
 *                                 You need to set this only if you are going to send push notifications across several mobile apps on a specific platform (Android or iOS)
 *                                 using a single Voximplant application.
 * @property {Voximplant.RequestAudioFocusMode} [requestAudioFocusMode] - Specifies when the audio focus request is performed: when a call is started or established.
 * {@link Voximplant.RequestAudioFocusMode.REQUEST_ON_CALL_START} by default.
 *
 * In case of {@link Voximplant.RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED}, SDK requests audio focus and sets audio mode to
 * [MODE_IN_COMMUNICATION](https://developer.android.com/reference/android/media/AudioManager#MODE_IN_COMMUNICATION),
 * when a call is established, i.e. {@link Voximplant.CallEvents.Connected} is invoked.
 *
 * In case of {@link Voximplant.RequestAudioFocusMode.REQUEST_ON_CALL_START}, SDK requests audio focus when the call is started,
 * i.e. {@link Voximplant.Client.call()} or {@link Voximplant.Call.answer()} are called.
 *
 * If the application plays some audio, it may result in audio interruptions. To avoid this behaviour,
 * this option should be set to {@link Voximplant.RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED}
 * and application's audio should be stopped/paused on {@link Voximplant.CallEvents.ProgressToneStop}.
 *
 * ANDROID ONLY
 *
 * @property {boolean} [h264RecoveryMode] - Enable experimental packet recovery mode to decode broken h264 streams. iOS ONLY
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
 * @property {Voximplant.VideoCodec} [preferredVideoCodec] - Preferred video codec for a particular call that this CallSettings are applied to.
 *                                      {@link Voximplant.VideoCodec.AUTO} by default.
 *                                      For android, overrides {@link Voximplant.ClientConfig.preferredVideoCodec} global configuration.
 * @property {string} [customData] - Custom string associated with the call session. It can be passed to the cloud to be obtained from the [CallAlerting](https://voximplant.com/docs/references/voxengine/appevents#callalerting) event or [Call History](https://voximplant.com/docs/references/httpapi/managing_history#getcallhistory) using HTTP API. Maximum size is 200 bytes. Use the {@link Voximplant.Call#sendMessage} method to pass a string over the limit; in order to pass a large data use [media_session_access_url](https://voximplant.com/docs/references/httpapi/managing_scenarios#startscenarios) on your backend.
 * @property {object} [extraHeaders] - Optional custom parameter (SIP headers) that should be passes with call (INVITE) message. Parameter names must start with "X-" to be processed. Headers size limit is 200  bytes
 * @property {Voximplant.VideoFlags} [video] - Tells if video should be supported for the call
 * @property {boolean} [setupCallKit] - Specify if the outgoing call on iOS will be made with CallKit. Applicable only for outgoing calls. IOS ONLY.
 */
const CallSettings = {

};
