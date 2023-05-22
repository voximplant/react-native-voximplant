/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class VideoViewManager extends SimpleViewManager<VideoViewImpl> {
    public VideoViewManager(ReactApplicationContext context) {

    }

    @Override
    public String getName() {
        return "RNVIVideoView";
    }

    @Override
    public VideoViewImpl createViewInstance(ThemedReactContext context) {
        return new VideoViewImpl(context);
    }

    @ReactProp(name = "videoStreamId")
    public void setVideoStreamId(VideoViewImpl view, String videoStreamId) {
        view.setVideoStreamId(videoStreamId);
    }

    @ReactProp(name = "scaleType")
    public void setScaleType(VideoViewImpl view, String scaleType) {
        view.setScaleType(scaleType);
    }

    @ReactProp(name = "showOnTop")
    public void setShowOnTop(VideoViewImpl view, boolean showOnTop) {
        view.setShowOnTop(showOnTop);
    }
}
