/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.RNVIVideoViewManagerInterface;
import com.facebook.react.viewmanagers.RNVIVideoViewManagerDelegate;

@ReactModule(name = "RNVIVideoView")
public class VideoViewManager extends SimpleViewManager<VideoViewImpl>
        implements RNVIVideoViewManagerInterface<VideoViewImpl> {

    private final ViewManagerDelegate<VideoViewImpl> mDelegate;

    public VideoViewManager(ReactApplicationContext context) {
        mDelegate = new RNVIVideoViewManagerDelegate<>(this);
    }

    @Nullable
    @Override
    protected ViewManagerDelegate<VideoViewImpl> getDelegate() {
        return mDelegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNVIVideoView";
    }

    @NonNull
    @Override
    protected VideoViewImpl createViewInstance(@NonNull ThemedReactContext context) {
        return new VideoViewImpl(context);
    }

    @Override
    @ReactProp(name = "videoStreamId")
    public void setVideoStreamId(VideoViewImpl view, @Nullable String videoStreamId) {
        view.setVideoStreamId(videoStreamId);
    }

    @Override
    @ReactProp(name = "scaleType")
    public void setScaleType(VideoViewImpl view, String scaleType) {
        view.setScaleType(scaleType);
    }

    @Override
    @ReactProp(name = "showOnTop")
    public void setShowOnTop(VideoViewImpl view, boolean showOnTop) {
        view.setShowOnTop(showOnTop);
    }
}
