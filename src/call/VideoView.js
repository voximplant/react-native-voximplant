/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import {
    requireNativeComponent,
    View
} from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { RenderScaleType } from './../Structures';

const RCTVoximplantVideoView = requireNativeComponent(
    'VIVideoView', 
    VideoView
);

export default class VideoView extends Component {
    render() {
        return (
            
            <RCTVoximplantVideoView style={this.props.style} videoStreamId={this.props.videoStreamId} scaleType={this.props.scaleType} />
        );
    }
}

VideoView.propTypes = {
    videoStreamId: PropTypes.string,
    scaleType: PropTypes.oneOf([RenderScaleType.SCALE_FIT, RenderScaleType.SCALE_FILL]),
    ...View.propTypes
};