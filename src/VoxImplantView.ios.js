/**
 * 
 * Copyright (c) 2011-present, Zingaya.
 * All rights reserved.
 * 
 */

import {
  requireNativeComponent,
  View
} from 'react-native'
import React, { PropTypes } from 'react'


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