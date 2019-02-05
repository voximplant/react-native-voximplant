/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class VideoViewManager extends SimpleViewManager<VideoView> {
    @Override 
    public String getName() {
        return "VIVideoView";
    }

    @Override 
    public VideoView createViewInstance(ThemedReactContext context) {
        return new VideoView(context);
    }

    @ReactProp(name = "videoStreamId")
    public void setVideoStreamId(VideoView view, String videoStreamId) {
        view.setVideoStreamId(videoStreamId);
    }

    @ReactProp(name = "scaleType")
    public void setScaleType(VideoView view, String scaleType) {
        view.setScaleType(scaleType);
    }

    @ReactProp(name = "showOnTop")
    public void setShowOnTop(VideoView view, boolean showOnTop) {
        view.setShowOnTop(showOnTop);
    }


}