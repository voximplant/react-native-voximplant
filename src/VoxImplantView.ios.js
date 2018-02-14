/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import {
  requireNativeComponent,
  View
} from 'react-native'
import React, { PropTypes } from 'react'

/**
 * Create and setup local preview for video calls
 * 
 * @param {string} callId - The call id
 */
var VoxImplantPreview = React.createClass({
  propTypes: {
    callId: PropTypes.string,
    ...View.propTypes,
  },
  render() {
    var style = this.props.style;
  	return (
      <VoxImplantRendererView 
        style={this.props.style} 
        previewProperty={true} />
    );
  },
});

/**
 * Create and setup remote video view
 * 
 * @param {string} callId - The call id
 */
var VoxImplantRemoteView = React.createClass({
  propTypes: {
    callId: PropTypes.string,
    ...View.propTypes,
  },
  render() {
    var style = this.props.style;
  	return (
      <VoxImplantRendererView 
        style={this.props.style} 
        previewProperty={false}/>
    );
  },
});

const VoxImplantRendererView = requireNativeComponent('VoxImplantRendererView', VoxImplantRendererView, {
  nativeOnly: {
    previewProperty: true
  }
});

export const Preview = VoxImplantPreview;
export const RemoteView = VoxImplantRemoteView;