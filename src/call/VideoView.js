/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

import {
    requireNativeComponent,
    View
} from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { RenderScaleType } from './../Enums';

const RCTVoximplantVideoView = requireNativeComponent(
    'VIVideoView', 
    VideoView
);

/**
 * @memberOf Voximplant
 * @class VideoView
 * @classdesc A React component to render video streams
 */
export default class VideoView extends Component {
    render() {
        return (
            <RCTVoximplantVideoView style={this.props.style} videoStreamId={this.props.videoStreamId}
                        scaleType={this.props.scaleType} showOnTop={this.props.showOnTop} />
        );
    }
}

/**
 * @memberOf Voximplant.VideoView
 * @property {string} videoStreamId - Id of the video stream that will be rendered to the video view
 * @property {Voximplant.RenderScaleType} scaleType - Type of video render scale
 * @property {boolean} showOnTop - Specify if the video view should be shown on top of other video views. ANDROID ONLY
 */
VideoView.propTypes = {
    videoStreamId: PropTypes.string,
    scaleType: PropTypes.oneOf([RenderScaleType.SCALE_FIT, RenderScaleType.SCALE_FILL]),
    showOnTop: PropTypes.bool,
    ...View.propTypes
};