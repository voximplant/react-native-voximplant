/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import {
  requireNativeComponent,
  View
} from 'react-native'
import React, { PropTypes } from 'react'


var VoxImplantView = React.createClass({
  propTypes: {
    preview: PropTypes.bool,
    callId: PropTypes.string,
    ...View.propTypes,
  },

  render: function() {
    return;
  }
});

/**
 * Create and setup local preview for video calls
 * 
 * @param {string} callId - The call id
 */
const VoxImplantPreview = React.createClass({
  propTypes: {
    callId: PropTypes.string,
    ...View.propTypes,
  },
  render() {
    var style = this.props.style;
    var callId = this.props.callId;
    return (
      <View style={style}>
        <RCTVoxImplantRendererView
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          preview={true}
          callId={''} />
      </View>
    );
  }
});

/**
 * Create and setup remote video view
 * 
 * @param {string} callId - The call id
 */
const VoxImplantRemoteView = React.createClass({
  propTypes: {
    callId: PropTypes.string,
    ...View.propTypes,
  },
  render() {
    var style = this.props.style;
    var callId = this.props.callId;
    return (
      <View style={style}>
        <RCTVoxImplantRendererView
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
          preview={false}
          callId={callId} />
      </View>
    );
  }
});

var RCTVoxImplantRendererView = requireNativeComponent('RCTVoxImplantRendererView', VoxImplantView);

export const Preview = VoxImplantPreview;
export const RemoteView = VoxImplantRemoteView;
