package com.voximplant.reactnative.calls

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.RNVIVideoViewManagerDelegate
import com.facebook.react.viewmanagers.RNVIVideoViewManagerInterface

@ReactModule(name = VideoViewManagerImpl.REACT_CLASS)
class VideoViewManager :
    SimpleViewManager<VideoView>(),
    RNVIVideoViewManagerInterface<VideoView> {

    private val impl: VideoViewManagerImpl = VideoViewManagerImpl()

    private val delegate: RNVIVideoViewManagerDelegate<VideoView, VideoViewManager> =
        RNVIVideoViewManagerDelegate(this)

    override fun getName(): String = VideoViewManagerImpl.REACT_CLASS

    override fun getDelegate(): ViewManagerDelegate<VideoView> = delegate

    override fun createViewInstance(reactContext: ThemedReactContext): VideoView =
        impl.createView(reactContext)

    override fun onDropViewInstance(view: VideoView) {
        impl.dropView(view)
        super.onDropViewInstance(view)
    }

    override fun setStreamId(view: VideoView, streamId: String?) =
        impl.applyStreamId(view, streamId)

    override fun setScaleType(view: VideoView, scaleType: String?) =
        impl.applyScaleType(view, scaleType)
}
