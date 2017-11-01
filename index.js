/**
 * 
 * Copyright (c) 2011-present, Zingaya.
 * All rights reserved.
 * 
 */

 
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Platform,
  NativeModules
} from 'react-native';

import {Preview, RemoteView} from './src/VoxImplantView';

function VoxImplantSDK () {

  this.init = function(options) {
    if (!options) options = {};
    if (Platform.OS === 'android') {
      if (options.enableVideo === undefined) options.enableVideo = true;
      if (options.enableHWAcceleration === undefined) options.enableHWAcceleration = true;
      if (options.provideLocalFramesInByteBuffer === undefined) 
        options.provideLocalFramesInByteBuffer = false;
      if (options.enableDebugLogging === undefined) options.enableDebugLogging = false;
      VoxImplantModule.init(options.enableVideo,
        options.enableHWAcceleration,
        options.provideLocalFramesInByteBuffer,
        options.enableDebugLogging);
    }
    if (Platform.OS === 'ios') {
      if (options.logLevel === undefined) options.logLevel = 'info';
      VoxImplantModule.init(options.logLevel);
    }
  }

  this.connect = function(options) {
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

  this.createCall = function(to, video, customData, callback) {
    if (typeof(video) == 'function') {
      return VoxImplantModule.createCall(to,
             false,
             "",
             video);  
    }
    else
    if (typeof(customData) == 'function') {
      return VoxImplantModule.createCall(to,
             video,
             "",
             customData);  
    }
    else {
      return VoxImplantModule.createCall(to,
             video == undefined ? false : video,
             customData == undefined ? "" : customData,
             callback == undefined ? function(id) {} : callback);
    }
  };

  this.login = function(user, password) {
    VoxImplantModule.login(user, password);
  };

  this.loginUsingOneTimeKey = function(user, hash) {
    VoxImplantModule.loginUsingOneTimeKey(user, hash);
  }

  this.loginUsingAccessToken = function(user, accessToken) {
    VoxImplantModule.loginUsingAccessToken(user, accessToken);
  }

  this.refreshToken = function(user, refreshToken) {
    VoxImplantModule.refreshToken(user, refreshToken);
  }

  this.requestOneTimeKey = function(user) {
    VoxImplantModule.requestOneTimeKey(user);
  }

  this.closeConnection = function() {
    VoxImplantModule.closeConnection();
  };

  this.startCall = function(callId, headers) {
    VoxImplantModule.startCall(callId, headers == undefined ? {} :  headers);
  };

  this.sendDTMF = function(callId, digit) {
    VoxImplantModule.sendDTMF(callId, digit);
  };

  this.disconnectCall = function(callId, headers) {
    VoxImplantModule.disconnectCall(callId, headers == undefined ? {} :  headers);
  };

  this.declineCall = function(callId, headers) {
    VoxImplantModule.declineCall(callId, headers == undefined ? {} :  headers);
  };

  this.answerCall = function(callId, customData, headers) {
    VoxImplantModule.answerCall(callId, 
                                customData == undefined ? null : customData,
                                headers == undefined ? {} :  headers);
  };

  this.sendMessage = function(callId, text) {
    VoxImplantModule.sendMessage(callId, text);
  };

  this.sendInfo = function(callId, mimeType, content, headers) {
    VoxImplantModule.sendInfo(callId, mimeType, content, headers == undefined ? {} : headers);
  };

  this.setMute = function(doMute) {
    VoxImplantModule.setMute(doMute);
  };

  this.setUseLoudspeaker = function(enable) {
    VoxImplantModule.setUseLoudspeaker(enable);
  };

  this.setVideoResizeMode = function(mode) {
    VoxImplantModule.setVideoResizeMode(mode);
  };

  this.sendVideo = function (doSend) {
    VoxImplantModule.sendVideo(doSend);
  };

  this.setCameraResolution = function(width, height) {
    VoxImplantModule.setCameraResolution(width, height);
  };

  this.switchToCamera = function(cameraName) {
    VoxImplantModule.switchToCamera(cameraName);
  };

  this.registerForPushNotifications = function(pushRegistrationToken) {
    VoxImplantModule.registerForPushNotifications(pushRegistrationToken);
  }

  this.unregisterFromPushNotifications = function(pushRegistrationToken) {
    VoxImplantModule.unregisterFromPushNotifications(pushRegistrationToken);
  }

  this.handlePushNotification = function(notification) {
    VoxImplantModule.handlePushNotification(notification);
  }
}

var VoxImplantModule = NativeModules.VoxImplantModule;

export default {
    SDK : new VoxImplantSDK(),
    Preview : Preview,
    RemoteView : RemoteView
};


