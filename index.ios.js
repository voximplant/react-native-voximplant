/**
 * Sample React Native App
 */
'use strict';

import React from 'react';
import ReactNative from 'react-native';

const {
  Component,
  PropTypes
} = React;

const {
  NativeModules,
  requireNativeComponent
} = ReactNative;
const VoxImplantModule = NativeModules.VoxImplantModule;



var VoxImplantPreview = React.createClass({
  render() {
  	return <VoxImplantRendererView style={this.props.style} previewProperty={true} />
  },
});

var VoxImplantRemoteView = React.createClass({
  render() {
  	return <VoxImplantRendererView style={this.props.style} previewProperty={false} />
  },
});

const VoxImplantRendererView = requireNativeComponent('VoxImplantRendererView', VoxImplantRendererView, {
  nativeOnly: {
    previewProperty: true
  }
});

function VoxImplantSDK () {

  this.init = function(options) {
    if (!options) options = {};
    if (options.logLevel === undefined) options.logLevel = 'info';
    VoxImplantModule.initialize(options.logLevel);
  }
  
  this.connect = function() {
    VoxImplantModule.connect();
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

  this.login = function(username, password) {
    VoxImplantModule.login(username, password);
  };

  this.loginWithOneTimeKey = function(username, hash) {
    VoxImplantModule.loginWithOneTimeKey(username, hash);
  };

  this.loginWithToken = function(username, token) {
    VoxImplantModule.loginWithToken(username, token);
  }

  this.refreshToken = function(username, token) {
    VoxImplantModule.refreshToken(username, token);
  }

  this.requestOneTimeLoginKey = function(username) {
    VoxImplantModule.requestOneTimeLoginKey(username);
  };

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

  this.answerCall = function(callId, headers) {
    VoxImplantModule.answerCall(callId, headers == undefined ? {} :  headers);
  };

  this.sendMessage = function(callId, text, headers) {
    VoxImplantModule.sendMessage(callId, text, headers == undefined ? {} : headers);
  };

  this.sendInfo = function(callId, mimeType, content, headers) {
    VoxImplantModule.sendInfo(callId, mimeType, content, headers == undefined ? {} : headers);
  };

  this.setMute = function(b) {
    VoxImplantModule.setMute(b);
  };

  this.setUseLoudspeaker = function(b) {
    VoxImplantModule.setUseLoudspeaker(b);
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
}

module.exports = {
	Preview : VoxImplantPreview,
	RemoteView : VoxImplantRemoteView,
	SDK : new VoxImplantSDK()
};
