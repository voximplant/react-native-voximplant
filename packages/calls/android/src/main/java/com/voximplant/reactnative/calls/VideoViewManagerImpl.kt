package com.voximplant.reactnative.calls

import com.facebook.react.uimanager.ThemedReactContext
import com.voximplant.android.sdk.calls.RenderScaleType

class VideoViewManagerImpl {
    fun createView(reactContext: ThemedReactContext): VideoView = VideoView(reactContext)

    fun dropView(view: VideoView) {
        view.disposeVideoStream()
    }

    fun applyStreamId(view: VideoView, streamId: String?) {
        view.streamId = streamId
    }

    fun applyScaleType(view: VideoView, scaleType: String?) {
        view.scaleType = when (scaleType) {
            "FIT" -> RenderScaleType.Fit
            "FILL" -> RenderScaleType.Fill
            else -> RenderScaleType.Fit
        }
    }

    companion object {
        const val REACT_CLASS = "RNVIVideoView"
    }
}
