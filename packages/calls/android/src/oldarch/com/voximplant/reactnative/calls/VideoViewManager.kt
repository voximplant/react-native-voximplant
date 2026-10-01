package com.voximplant.reactnative.calls

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = VideoViewManagerImpl.REACT_CLASS)
class VideoViewManager : SimpleViewManager<VideoView>() {

    private val impl: VideoViewManagerImpl = VideoViewManagerImpl()

    override fun getName(): String = VideoViewManagerImpl.REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): VideoView =
        impl.createView(reactContext)

    override fun onDropViewInstance(view: VideoView) {
        impl.dropView(view)
        super.onDropViewInstance(view)
    }

    @ReactProp(name = "streamId")
    fun setStreamId(view: VideoView, streamId: String?) =
        impl.applyStreamId(view, streamId)

    @ReactProp(name = "scaleType")
    fun setScaleType(view: VideoView, scaleType: String?) =
        impl.applyScaleType(view, scaleType)
}
