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

var {
  NativeModules,
  requireNativeComponent,
  View
} = ReactNative;

var VoxImplantView = React.createClass({
  propTypes: {
    preview: PropTypes.bool,
    callId:PropTypes.string,
    ...View.propTypes,
  },

  render: function() {
    return;
  }
})

function VoxImplantPreview(props) {
  var { style, ...otherProps} = props;
    return (
      <View style={style}>
        <RCTVoxImplantRendererView
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          preview={true}
          callId={''} />
      </View>
    );
}

function VoxImplantRemoteView(props) {
  var { style, callId, ...otherProps} = props;
  if(typeof callId === 'undefined')
    callId = '';
  return (
      <View style={style}>
        <RCTVoxImplantRendererView
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          preview={false}
          callId={callId} />
      </View>
  );
}

var RCTVoxImplantRendererView = requireNativeComponent('RCTVoxImplantRendererView', VoxImplantView);
var VoxImplantModule = NativeModules.VoxImplantModule;

function VoxImplantSDK () {

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

  this.login = function(user, password) {
    VoxImplantModule.login(user, password);
  };

  this.loginUsingOneTimeKey = function(user, hash) {
    VoxImplantModule.loginUsingOneTimeKey(user, hash);
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
