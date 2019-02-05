/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

import React from 'react'
import {
  requireNativeComponent,
  View
} from 'react-native'
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');
var VoxImplantView = createReactClass({
  propTypes: {
    preview: PropTypes.bool,
    callId: PropTypes.string,
    ...View.propTypes,
  },

  render: function() {
  }
});

/**
 * @class VoxImplantPreview
 * @classdesc Create and setup local preview for video calls
 * 
 * @param {string} callId - The call id
 * @deprecated Use {@link Voximplant.VideoView} instead
 * @memberOf Legacy
 */
const VoxImplantPreview = createReactClass({
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
 * @class VoxImplantRemoteView
 * @classdesc Create and setup remote video view
 * 
 * @param {string} callId - The call id
 * @deprecated Use {@link Voximplant.VideoView} instead
 * @memberOf Legacy
 */
const VoxImplantRemoteView = createReactClass({
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
