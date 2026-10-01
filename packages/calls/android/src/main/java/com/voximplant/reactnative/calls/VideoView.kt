package com.voximplant.reactnative.calls

import android.content.Context
import android.view.Gravity
import android.widget.FrameLayout
import com.voximplant.android.sdk.calls.RenderScaleType
import com.voximplant.android.sdk.calls.VideoStream
import com.voximplant.webrtc.RendererCommon
import com.voximplant.webrtc.SurfaceViewRenderer

class VideoView(context: Context) : FrameLayout(context) {
    private val renderer = SurfaceViewRenderer(context)

    var streamId: String? = null
        set(value) {
            field = value
            if (!isAttachedToWindow || windowVisibility != VISIBLE) return
            when {
                !value.isNullOrBlank() -> bindVideoStream(value)
                else -> {
                    renderer.visibility = INVISIBLE
                    disposeVideoStream()
                }
            }
        }

    var scaleType: RenderScaleType = RenderScaleType.Fit
        set(value) {
            field = value
            renderer.setScalingType(value.toScalingType())
        }

    private var videoStream: VideoStream? = null

    init {
        renderer.visibility = INVISIBLE
        addView(renderer, LayoutParams(
            LayoutParams.WRAP_CONTENT,
            LayoutParams.WRAP_CONTENT,
            Gravity.CENTER
        ))
    }

    fun bindVideoStream(id: String) {
        val currentVideoStream: VideoStream = VideoModuleImpl.getVideoStreamById(id) ?: run {
            renderer.visibility = INVISIBLE
            disposeVideoStream()
            return
        }

        if (videoStream == currentVideoStream) return

        disposeVideoStream()

        currentVideoStream.addVideoRenderer(
            renderer,
            scaleType = scaleType,
            callback = object : VideoStream.RendererCallback {
                override fun onStarted() {
                    post {
                        renderer.visibility = VISIBLE
                    }
                }

                override fun onError(error: VideoStream.Error) {}
            }
        )
        videoStream = currentVideoStream
    }

    fun disposeVideoStream() {
        videoStream?.removeVideoRenderer(renderer)
        videoStream = null
    }

    override fun onWindowVisibilityChanged(visibility: Int) {
        super.onWindowVisibilityChanged(visibility)
        if (visibility == VISIBLE) {
            streamId?.let { bindVideoStream(it) } ?: disposeVideoStream()
        } else {
            renderer.visibility = INVISIBLE
            disposeVideoStream()
        }
    }

    private val layoutRunnable = Runnable {
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        )
        layout(left, top, right, bottom)
    }

    override fun requestLayout() {
        super.requestLayout()

        // React Native does not re-measure native views after initial mount.
        // Without this manual pass the inner SurfaceViewRenderer keeps stale bounds,
        // which breaks the Fit scaling and makes the video look like Fill.
        // See: https://github.com/facebook/react-native/blob/d19afc73f5048f81656d0b4424232ce6d69a6368/ReactAndroid/src/main/java/com/facebook/react/views/toolbar/ReactToolbar.java#L166
        post(layoutRunnable)
    }
}

private fun RenderScaleType.toScalingType(): RendererCommon.ScalingType = when (this) {
    RenderScaleType.Fit -> RendererCommon.ScalingType.SCALE_ASPECT_FIT
    RenderScaleType.Fill -> RendererCommon.ScalingType.SCALE_ASPECT_FILL
    RenderScaleType.Balanced -> RendererCommon.ScalingType.SCALE_ASPECT_BALANCED
}
