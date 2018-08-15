/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

/**
 * @module Legacy
 */

'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Platform,
  NativeModules
} from 'react-native';

/**
 * @memberOf Legacy
 * @class VoximplantLegacy
 * @deprecated Use {@link Voximplant.Client} instead
 */
class VoximplantLegacy {

  constructor() {}

  /**
   * Initialization of Voximplant SDK
   * @param {VoxImplantClientConfig} [options]
   * @deprecated Use {@link Voximplant#getInstance} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  init(options) {
    if (!options) options = {};
    if (Platform.OS === 'android') {
      if (options.enableVideo === undefined) options.enableVideo = true;
      if (options.enableHWAcceleration === undefined) options.enableHWAcceleration = true;
      if (options.provideLocalFramesInByteBuffer === undefined) 
        options.provideLocalFramesInByteBuffer = false;
      if (options.enableDebugLogging === undefined) options.enableDebugLogging = false;
      if (options.bundleId === undefined) options.bundleId = null;
      VoxImplantModule.init(options.enableVideo,
        options.enableHWAcceleration,
        options.provideLocalFramesInByteBuffer,
        options.enableDebugLogging,
        options.bundleId);
    }
    if (Platform.OS === 'ios') {
      if (options.logLevel === undefined) options.logLevel = 'info';
      if (options.bundleId === undefined) options.bundleId = null;
      VoxImplantModule.init(options.logLevel, options.bundleId);
    }
  }
  /**
   * Connect to the Voximplant cloud
   * @param {VoxImplantConnectOptions} [options] - Optional connection options
   * @deprecated Use {@link Voximplant.Client#connect} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  connect(options) {
    if (!options) options = {};
    if (options.connectivityCheck === undefined) options.connectivityCheck = true;
    if (Platform.OS === 'android') {
      if (options.servers === undefined) options.servers = [];
      VoxImplantModule.connect(options.connectivityCheck, options.servers);
    }
    if (Platform.OS === 'ios') {
      VoxImplantModule.connect(options.connectivityCheck);
    }
  };

  /**
   * Create new call
   * @param {string} to - SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario
   * @param {boolean} video - Enable video support in call
   * @param {string} customData - Optional custom data passed with call. Will be available in VoxEngine scenario
   * @param {object} callback - Callback object
   * @deprecated Use {@link Voximplant.Client#call} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  createCall(to, video, customData, callback) {
    if (typeof(video) === 'function') {
      return VoxImplantModule.createCall(to,
             false,
             "",
             video);  
    }
    else
    if (typeof(customData) === 'function') {
      return VoxImplantModule.createCall(to,
             video,
             "",
             customData);  
    }
    else {
      return VoxImplantModule.createCall(to,
             video === undefined ? false : video,
             customData === undefined ? "" : customData,
             callback === undefined ? function(id) {} : callback);
    }
  };

  /**
   * Login to specified Voximplant application
   * @param {string} user - Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
   * @param {string} password - User password
   * @deprecated Use {@link Voximplant.Client#login} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  login(user, password) {
    VoxImplantModule.login(user, password);
  };

  /**
   * Perform login using one time key that was generated before
   * @param {string} user - Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
   * @param {string} hash - Hash that was generated using following formula: MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)). <b>Please note that here user is just a user name, without app name, account name or anything else after "@"</b>. So if you pass <i>myuser@myapp.myacc.voximplant.com</i> as a<b>username</b>, you should only use <i>myuser</i>  while computing this hash
   * @deprecated Use {@link Voximplant.Client#loginWithOneTimeKey} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  loginUsingOneTimeKey(user, hash) {
    VoxImplantModule.loginUsingOneTimeKey(user, hash);
  }

  /**
   * Perform login using specified username and access token that was obtained in LoginSuccessful callback before
   * @param {string} user - Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
   * @param {string} accessToken - Access token that was obtained in LoginSuccessful callback
   * @deprecated Use {@link Voximplant.Client#loginWithToken} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  loginUsingAccessToken(user, accessToken) {
    VoxImplantModule.loginUsingAccessToken(user, accessToken);
  }

  /**
   * Perform refresh of login tokens required for login using access token
   * @param {string} user - Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
   * @param {string} refreshToken - Refresh token that was obtained in LoginSuccessful callback
   * @deprecated Use {@link Voximplant.Client#tokenRefresh} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  refreshToken(user, refreshToken) {
    VoxImplantModule.refreshToken(user, refreshToken);
  }

  /**
   * Generates one time login key to be used for automated login process
   * @param {string} user - Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
   * @deprecated Use {@link Voximplant.Client#requestOneTimeLoginKey} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  requestOneTimeKey(user) {
    VoxImplantModule.requestOneTimeKey(user);
  }

  /**
   * Closes connection with media server
   * @deprecated Use {@link Voximplant.Client#disconnect} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  closeConnection() {
    VoxImplantModule.closeConnection();
  };

  /**
   * Send start call request If call with specified id is not found - returns false
   * @param {string} callId - Id of previously created call
   * @param {object} [headers] - Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
   * @deprecated Use {@link Voximplant.Client#call} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  startCall(callId, headers) {
    VoxImplantModule.startCall(callId, headers === undefined ? {} :  headers);
  };

  /**
   * Sends DTMF digit in specified call
   * @param {string} callId - Id of previously created call
   * @param {number} digit - Digit can be 0-9 for 0-9, 10 for * and 11 for #
   * @deprecated Use {@link Voximplant.Call#sendTone} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  sendDTMF(callId, digit) {
    VoxImplantModule.sendDTMF(callId, digit);
  };

  /**
   * Terminate specified call. Call must be either established, or outgoing progressing
   * @param {string} callId - Id of previously created call
   * @param {object} [headers] - Optional set of headers to be sent with message. Names must begin with "X-" to be processed by Voximplant
   * @deprecated Use {@link Voximplant.Call#hangup} instead.
   * @memberOf Legacy.VoximplantLegacy
   */
  disconnectCall(callId, headers) {
    VoxImplantModule.disconnectCall(callId, headers === undefined ? {} :  headers);
  };

  /**
   * Reject incoming alerting call
   * @param {string} callId - Id of previously created call
   * @param {object} [headers] - Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
   * @deprecated Use {@link Voximplant.Call#decline} or {@link Voximplant.Call#reject} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  declineCall(callId, headers) {
    VoxImplantModule.declineCall(callId, headers === undefined ? {} :  headers);
  };

  /**
   * Answer incoming call
   * @param {string} callId - Id of previously created call
   * @param {object} [headers] - Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
   * @deprecated Use {@link Voximplant.Call#answer} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  answerCall(callId, customData, headers) {
    VoxImplantModule.answerCall(callId, 
                                customData === undefined ? null : customData,
                                headers === undefined ? {} :  headers);
  };

  /**
   * Sends instant message within established call
   * @param {string} callId - Id of previously created call
   * @param {string} text - Message text
   * @deprecated Use {@link Voximplant.Call#sendMessage} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  sendMessage(callId, text) {
    VoxImplantModule.sendMessage(callId, text);
  };

  /**
   * Sends info within established call
   * @param {string} callId - Id of previously created call
   * @param {string} mimeType - MIME type of info
   * @param {string} content - Custom string data
   * @param {object} [headers] - Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
   * @deprecated Use {@link Voximplant.Call#sendInfo} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  sendInfo(callId, mimeType, content, headers) {
    VoxImplantModule.sendInfo(callId, mimeType, content, headers === undefined ? {} : headers);
  };

  /**
   * Mute or unmute microphone. This is reset after audio interruption
   * @param {boolean} doMute - Enable/disable flag
   * @deprecated Use {@link Voximplant.Call#sendAudio} instead.
   * @memberOf Legacy.VoximplantLegacy
   */
  setMute(doMute) {
    VoxImplantModule.setMute(doMute);
  };

  /**
   * Enable/disable loudspeaker
   * @param {boolean} enable - Enable/disable loudspeaker
   * @deprecated Use {@link Voximplant.Hardware.AudioDeviceManager#selectAudioDevice} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  setUseLoudspeaker(enable) {
    VoxImplantModule.setUseLoudspeaker(enable);
  };

  /**
   * Set video display mode. Applies to both incoming and outgoing stream. IOS ONLY
   * @param {VideoResizeMode} mode - Resize mode
   * @deprecated
   * @memberOf Legacy.VoximplantLegacy
   */
  setVideoResizeMode(mode) {
    VoxImplantModule.setVideoResizeMode(mode);
  };

  /**
   * Start/stop sending video from local camera
   * @param {boolean} doSend - Specify if video should be sent
   * @deprecated Use {@link Voximplant.Call#sendVideo} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  sendVideo(doSend) {
    VoxImplantModule.sendVideo(doSend);
  };

  /**
   * Set local camera resolution
   * @param {number} width - Camera resolution width
   * @param {number} height - Camera resolution height
   * @deprecated Use {@link Voximplant.Hardware.CameraManager#setCameraResolution} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  setCameraResolution(width, height) {
    VoxImplantModule.setCameraResolution(width, height);
  };

  /**
   * Switch camera
   * @param {Legacy.CameraType} cameraName - Must be "front" or "back"
   * @deprecated Use {@link Voximplant.Hardware.CameraManager#switchCamera} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  switchToCamera(cameraName) {
    VoxImplantModule.switchToCamera(cameraName);
  };

  /**
   * Register for push notifications. Application will receive push notifications from the Voximplant Server after first log in
   * @param {string} pushRegistrationToken - Push registration token
   * @deprecated Use {@link Voximplant.Client#registerPushNotificationsToken} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  registerForPushNotifications(pushRegistrationToken) {
    VoxImplantModule.registerForPushNotifications(pushRegistrationToken);
  }

  /**
   * Unregister from push notifications. Application will no longer receive push notifications from the Voximplant server
   * @param {string} pushRegistrationToken - Push registration token that was used to register for push notifications
   * @deprecated Use {@link Voximplant.Client#unregisterPushNotificationsToken} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  unregisterFromPushNotifications(pushRegistrationToken) {
    VoxImplantModule.unregisterFromPushNotifications(pushRegistrationToken);
  }

  /**
   * Handle incoming push notification
   * @param {object} notification - Incoming push notification
   * @deprecated Use {@link Voximplant.Client#handlePushNotification} instead
   * @memberOf Legacy.VoximplantLegacy
   */
  handlePushNotification(notification) {
    VoxImplantModule.handlePushNotification(notification);
  }

  /**
   * List of events
   * @name Events
   * @enum {string}
   * @type {{LoginSuccessful: string, LoginFailed: string, OneTimeKeyGenerated: string, ConnectionSuccessful: string, ConnectionClosed: string, ConnectionFailed: string, CallConnected: string, CallDisconnected: string, CallRinging: string, CallFailed: string, CallAudioStarted: string, IncomingCall: string, SIPInfoReceivedInCall: string, MessageReceivedInCall: string, NetStatsReceived: string, RefreshTokenSuccess: string, RefreshTokenFailed: string}}
   * @deprecated Use {@link Voximplant.ClientEvents} instead
   * @memberOf Legacy
   */
  Events = {
    /**
     * Invoked when login process finished successfully.
     * @property {string} displayName - Display name of logged in user
     * @property {Legacy.LoginTokens} loginTokens - Login tokens that can be used to login using access token
     * @deprecated Use {@link Voximplant.ClientEvents.AuthResult} instead
     * @memberOf Legacy.Events
     */
    LoginSuccessful: "LoginSuccessful",
    /**
     * Invoked when login process failed
     * @property {number} errorCode - Login error code, possible values are: <table><thead><tr><th> code </th><th> description </th></tr></thead><tbody><tr><td> 401  </td><td> invalid password or token </td></tr><tr><td> 403  </td><td> account frozen </td></tr><tr><td> 404  </td><td> invalid username </td></tr><tr><td> 500  </td><td> internal error </td></tr><tr><td> 701  </td><td> token expired </td></tr></tbody></table>
     * @deprecated Use {@link Voximplant.ClientEvents.AuthResult} instead
     * @memberOf Legacy.Events
     */
    LoginFailed: "LoginFailed",
    /**
     * Returns one time key generated by the login server as a result of requestOneTimeLoginKey
     * @property {string} key - One time key
     * @deprecated Use {@link Voximplant.ClientEvents.AuthResult} instead
     * @memberOf Legacy.Events
     */
    OneTimeKeyGenerated: "OneTimeKeyGenerated",
    /**
     * Connection with cloud established
     * @deprecated Use {@link Voximplant.ClientEvents.ConnectionEstablished} instead
     * @memberOf Legacy.Events
     */
    ConnectionSuccessful: "ConnectionSuccessful",
    /**
     * Connection with cloud closed
     * @deprecated Use {@link Voximplant.ClientEvents.ConnectionClosed} instead
     * @memberOf Legacy.Events
     */
    ConnectionClosed: "ConnectionClosed",
    /**
     * Connection with cloud failed
     * @property {string} reason - Error message
     * @deprecated Use {@link Voximplant.ClientEvents.ConnectionFailed} instead
     * @memberOf Legacy.Events
     */
    ConnectionFailed: "ConnectionFailed",
    /**
     * Call established
     * @property {string} callId - Id of call
     * @property {object} headers - Optional headers passed with event
     * @deprecated Use {@link Voximplant.CallEvents.Connected}
     * @memberOf Legacy.Events
     */
    CallConnected: "CallConnected",
    /**
     * Call terminated
     * @property {string} callId - Id of call
     * @property {object} headers - Optional headers passed with event
     * @property {boolean} answeredElsewhere - Indicate if the call was answered on other peer
     * @deprecated Use {@link Voximplant.CallEvents.Disconnected}
     * @memberOf Legacy.Events
     */
    CallDisconnected: "CallDisconnected",
    /**
     * Call ringing. You should start playing call progress tone now
     * @property {string} callId - Id of call
     * @property {object} headers - Optional headers passed with event
     * @deprecated Use {@link Voximplant.CallEvents.ProgressToneStart}
     * @memberOf Legacy.Events
     */
    CallRinging: "CallRinging",
    /**
     * Outgoing call failed
     * @property {string} callId - Id of call
     * @property {number} code - Status code
     * @property {string} reason - Status message
     * @property {object} headers - Optional headers passed with event
     * @deprecated Use {@link Voximplant.CallEvents.Failed} instead
     * @memberOf Legacy.Events
     */
    CallFailed: "CallFailed",
    /**
     * Call audio started. You should stop playing progress tone when event is received
     * @property {string} callId - Id of call
     * @deprecated Use {@link Voximplant.CallEvents.ProgressToneStop} instead
     * @memberOf Legacy.Events
     */
    CallAudioStarted: "CallAudioStarted",
    /**
     * New incoming call received by SDK
     * @property {string} callId - Id of call
     * @property {string} from - SIP URI of caller
     * @property {string} displayName - Displayed name of caller
     * @property {boolean} videoCall - Video call flag
     * @property {object} headers - Optional headers passed with event
     * @deprecated Use {@link Voximplant.ClientEvents.IncomingCall} instead
     * @memberOf Legacy.Events
     */
    IncomingCall: "IncomingCall",
    /**
     * SIP INFO received during a call
     * @property {string} callId - Id of call
     * @property {string} type - MIME type of info
     * @property {string} content - Body of info message
     * @property {object} headers - Optional headers passed with event
     * @deprecated Use {@link Voximplant.CallEvents.InfoReceived} instead
     * @memberOf Legacy.Events
     */
    SIPInfoReceivedInCall: "SIPInfoReceivedInCall",
    /**
     * Instant message received during a call
     * @property {string} callId - Id of call
     * @property {string} text - Message text
     * @deprecated Use {@link Voximplant.CallEvents.MessageReceived} instead
     * @memberOf Legacy.Events
     */
    MessageReceivedInCall: "MessageReceivedInCall",
    /**
     * Event dispatched when packet loss data received from Voximplant servers
     * @property {string} callId - Id of call
     * @property {object} stats - NetworkInfo
     * @deprecated
     * @memberOf Legacy.Events
     */
    NetStatsReceived:"NetStatsReceived",
    /**
     * Invoked when refresh of login tokens finished successfully
     * @property {LoginTokens} loginTokens - Login tokens that can be used to login using access token
     * @deprecated Use {@link Voximplant.ClientEvents.RefreshTokenResult} instead
     * @memberOf Legacy.Events
     */
    RefreshTokenSuccess:"RefreshTokenSuccess",
    /**
     * Invoked when refresh of login tokens failed
     * @property {number} reason - Failure reason
     * @deprecated Use {@link Voximplant.ClientEvents.RefreshTokenResult} instead.
     * @memberOf Legacy.Events
     */
    RefreshTokenFailed: "RefreshTokenFailed"
  };

  /**
   * Enum of supported video resize modes
   * @name VideoResizeMode
   * @enum {string}
   * @deprecated Use {@link Voximplant.RenderScaleType} instead
   * @memberOf Legacy
   */
  VideoResizeMode = {
    /**
     * Video frame is scaled to be fit the size of the view by maintaining the aspect ratio (black borders may be displayed)
     * @memberOf Legacy.VideoResizeMode
     */
    VideoResizeModeFit: "fit",
    /**
     * Video frame is scaled to fill the size of the view by maintaining the aspect ratio. Some portion of the video frame may be clipped
     * @memberOf Legacy.VideoResizeMode
     */
    VideoResizeModeClip: "clip"
  };

  /**
   * Enum of supported camera type modes
   * @name CameraType
   * @enum {string}
   * @deprecated Use {@link Voximplant.Hardware.CameraType} instead.
   * @memberOf Legacy
   */
  CameraType = {
      /**
       * The facing of the camera is the same as that of the screen
       * @memberOf Legacy.CameraType
       */
      CameraTypeFront: "front",
      /**
       * The facing of the camera is opposite to that of the screen
       * @memberOf Legacy.CameraType
       */
      CameraTypeBack: "back"
  };

  /**
   * Enum of log levels. IOS ONLY
   * @name LogLevel
   * @enum {string}
   * @deprecated Use {@link Voximplant.LogLevel} instead.
   * @memberOf Legacy
   */
  LogLevel = {
    /**
     * Log verbosity level, to include only error messages
     * @memberOf Legacy.LogLevel
     */
    LogLevelError: "error",
    /**
     * Default log verbosity level, to include informational messages
     * @memberOf Legacy.LogLevel
     */
    LogLevelInfo: "info",
    /**
     * Log verbosity level to include debug messages
     * @memberOf Legacy.LogLevel
     */
    LogLevelDebug: "debug",
    /**
     * Log verbosity level to include trace messages
     * @memberOf Legacy.LogLevel
     */
    LogLevelTrace: "trace"
  };

  /**
   * @property {number} accessExpire - Seconds to access token expire
   * @property {string} accessToken - Access token that can be used to login before accessExpire
   * @property {number} refreshExpire - Seconds to refresh token expire
   * @property {string} refreshToken - Refresh token that can be used one time before refresh token expired
   * @deprecated Use {@link Voximplant.LoginTokens} instead
   * @memberOf Legacy
   */
  LoginTokens = {

  };

  /**
   * @property {boolean} [enableVideo] - Enable video functionality. Set to true by default. ANDROID ONLY
   * @property {boolean} [enableHWAcceleration] - Enable hardware video acceleration. Set to true by default. Should be set to false, if provideLocalFramesInByteBuffers is set to true. ANDROID ONLY
   * @property {boolean} [provideLocalFramesInByteBuffers] - Request video frames from camera in I420 format with byte buffers. Set to false by default. If set to false, video frames from camera will be provided in I420 format with textures. ANDROID ONLY
   * @property {boolean} [enableDebugLogging] - Enable debug logging. Set to false by default. ANDROID ONLY
   * @property {LogLevel} [logLevel] - Log levels. IOS ONLY
   * @property {string} [bundleId] - Application bundle id/package name for iOS/Android respectively.
   *                               You need to set this only if you are going to send push notifications across several mobile apps on a specific platform (Android or iOS)
   *                               using a single Voximplant application.
   * @deprecated Use {@link Voximplant.ClientConfig}
   * @memberOf Legacy
   */
  VoxImplantClientConfig = {

  };
  /**
   * @property {boolean} [connectivityCheck] - Checks whether UDP traffic will flow correctly between device and the Voximplant cloud. This check reduces connection speed
   * @property {array} [servers] - Server name of particular media gateway for connection
   * @deprecated Use {@link Voximplant.ConnectOptions} instead.
   * @memberOf Legacy
   */
  VoxImplantConnectOptions = {

  };
}

var VoxImplantModule = NativeModules.VoxImplantModule;

export default VoximplantLegacy = new VoximplantLegacy();


