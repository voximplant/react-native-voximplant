package com.voximplant.reactnative.calls

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.voximplant.android.sdk.calls.LocalVideoStream
import com.voximplant.android.sdk.calls.VideoStream
import com.voximplant.android.sdk.calls.video.CameraDevice
import com.voximplant.android.sdk.calls.video.CameraDeviceType
import com.voximplant.android.sdk.calls.video.CameraResolution
import com.voximplant.android.sdk.calls.video.CameraVideoSource
import com.voximplant.android.sdk.calls.video.CustomVideoSource
import com.voximplant.android.sdk.calls.video.ScreenCaptureVideoSource
import com.voximplant.android.sdk.calls.video.VideoSource
import java.util.concurrent.ConcurrentHashMap

class VideoModuleImpl(
    private val reactContext: ReactApplicationContext,
    emitOnStarted: () -> Unit,
    emitOnStopped: (String) -> Unit,
    emitOnFailed: (WritableMap) -> Unit,
) {
    private var isVideoSourceListenerRegistered = false

    private val videoSourceListener = object : VideoSource.EventsListener {
        override fun onStart() {
            emitOnStarted()
        }

        override fun onStop(reason: VideoSource.StopReason) {
            emitOnStopped(reason.asReactNativeStopReason())
        }

        override fun onError(error: VideoSource.Error) {
            emitOnFailed(
                Arguments.createMap().apply {
                    putString("code", error.asReactNativeErrorCode())
                    putString("message", error.message)
                },
            )
        }
    }

    fun getDevices(): WritableArray {
        if (!ensureCallsInitialized()) return Arguments.createArray()
        ensureVideoSourceListenerRegistered()

        return Arguments.createArray().apply {
            CameraVideoSource.cameraDevices.forEach { pushMap(it.asWritableMap()) }
        }
    }

    fun getDevice(id: String): WritableMap? {
        if (!ensureCallsInitialized()) return null
        ensureVideoSourceListenerRegistered()
        return CameraVideoSource.cameraDevices.find { it.id == id }?.asWritableMap()
    }

    fun hasDevice(id: String): Boolean {
        if (!ensureCallsInitialized()) return false
        ensureVideoSourceListenerRegistered()
        return CameraVideoSource.cameraDevices.any { it.id == id }
    }

    fun getSelectedDevice(): WritableMap? {
        if (!ensureCallsInitialized()) return null
        ensureVideoSourceListenerRegistered()

        return CameraVideoSource.currentCameraDevice?.asWritableMap()
    }

    fun getPreferredResolution(): WritableMap? {
        if (!ensureCallsInitialized()) return null
        ensureVideoSourceListenerRegistered()

        return CameraVideoSource.currentCameraDevice?.resolution?.asWritableMap()
    }

    fun selectDevice(device: ReadableMap, promise: Promise) {
        if (!ensureCallsInitialized()) {
            promise.reject(
                code = "CAMERA_NOT_FOUND",
                message = "The camera device could not be found because the Voximplant SDK is not initialized",
            )
            return
        }
        ensureVideoSourceListenerRegistered()

        val deviceId = device.getString("id")

        val cameraDevice = CameraVideoSource.cameraDevices.find { it.id == deviceId } ?: run {
            promise.reject(code = "CAMERA_NOT_FOUND", message = "Camera device with id $deviceId not found in the device list")
            return
        }

        CameraVideoSource.selectCameraDevice(cameraDevice)
        promise.resolve(null)
    }

    fun setPreferredResolution(preference: ReadableMap) {
        val cameraVideoSource = getCameraVideoSourceOrNull() ?: return
        ensureVideoSourceListenerRegistered()

        val resolution = preference.toCameraResolutionOrNull() ?: return
        cameraVideoSource.setPreferredResolution(resolution)
    }

    fun createLocalStream(source: String): String? {
        return LocalVideoStream(videoSource = getVideoSource(source) ?: return null).also { videoStream ->
            addVideoStream(videoStream)
        }.id
    }

    fun removeLocalStream(streamId: String) {
        if (videoStreams[streamId] is LocalVideoStream) {
            videoStreams.remove(streamId)
        }
    }

    fun removeAllLocalStreams() {
        clearLocalVideoStreams()
    }

    fun getLocalStreams(): WritableArray = Arguments.createArray().apply {
        videoStreams.values.forEach { stream ->
            if (stream is LocalVideoStream) {
                pushMap(stream.asLocalVideoStreamDto())
            }
        }
    }

    fun getLocalStream(streamId: String): WritableMap? {
        val stream = videoStreams[streamId] as? LocalVideoStream ?: return null
        return stream.asLocalVideoStreamDto()
    }

    private fun LocalVideoStream.asLocalVideoStreamDto(): WritableMap = Arguments.createMap().apply {
        putString("id", id)
        putString("source", videoSource.asReactNativeSource())
    }

    private fun getVideoSource(source: String): VideoSource? = when (source) {
        "CAMERA" -> getCameraVideoSourceOrNull()
        else -> null
    }

    fun initialize() {
        ensureVideoSourceListenerRegistered()
    }

    fun invalidate() {
        if (CallsModuleImpl.isInitialized() && isVideoSourceListenerRegistered) {
            CameraVideoSource.removeListener(videoSourceListener)
            isVideoSourceListenerRegistered = false
        }
        clearLocalVideoStreams()
    }

    private fun clearLocalVideoStreams() {
        videoStreams.entries.removeAll { it.value is LocalVideoStream }
    }

    private fun ensureVideoSourceListenerRegistered() {
        if (!ensureCallsInitialized() || isVideoSourceListenerRegistered) return
        CameraVideoSource.addListener(videoSourceListener)
        isVideoSourceListenerRegistered = true
    }

    private fun getCameraVideoSourceOrNull(): CameraVideoSource? {
        if (!ensureCallsInitialized()) return null
        return CameraVideoSource
    }

    private fun ensureCallsInitialized(): Boolean = CallsModuleImpl.ensureInitialized(reactContext)

    companion object {
        private val videoStreams = ConcurrentHashMap<String, VideoStream>()

        fun getVideoStreamById(streamId: String): VideoStream? = videoStreams[streamId]

        internal fun addVideoStream(stream: VideoStream) {
            videoStreams[stream.id] = stream
        }

        internal fun removeVideoStream(stream: VideoStream) {
            videoStreams.remove(stream.id, stream)
        }
    }
}

private fun CameraDevice.asWritableMap(): WritableMap = Arguments.createMap().apply {
    putString("id", id)
    putString("type", type.asReactNativeType())
    putArray(
        "supportedResolutions",
        Arguments.createArray().apply {
            supportedResolutions.forEach { pushMap(it.asWritableMap()) }
        },
    )
}

private fun CameraResolution.asWritableMap(): WritableMap = Arguments.createMap().apply {
    putInt("width", width)
    putInt("height", height)
}

private fun ReadableMap.toCameraResolutionOrNull(): CameraResolution? {
    val width = if (hasKey("width") && !isNull("width")) getInt("width") else null
    val height = if (hasKey("height") && !isNull("height")) getInt("height") else null

    if (width != null && height != null && width > 0 && height > 0) {
        return CameraResolution(width, height)
    }

    return when (getString("preset") ?: getString("quality") ?: getString("name") ?: getString("value")) {
        "HIGH" -> CameraResolution.High
        "MEDIUM" -> CameraResolution.Medium
        "LOW" -> CameraResolution.Low
        else -> null
    }
}

private fun CameraDeviceType.asReactNativeType(): String = when (this) {
    CameraDeviceType.Back -> "BACK"
    CameraDeviceType.Front -> "FRONT"
    CameraDeviceType.Unknown -> "UNKNOWN"
}

private fun VideoSource.StopReason.asReactNativeStopReason(): String = when (this) {
    VideoSource.StopReason.BySystem -> "BY_SYSTEM"
    VideoSource.StopReason.Normal -> "NORMAL"
    VideoSource.StopReason.InternalError -> "INTERNAL_ERROR"
}

private fun VideoSource.asReactNativeSource(): String? = when (this) {
    is CameraVideoSource -> "CAMERA"
    is CustomVideoSource -> null
    is ScreenCaptureVideoSource -> null
    else -> null
}

private fun VideoSource.Error.asReactNativeErrorCode(): String = when (this) {
    is VideoSource.Error.CameraNotFound -> "CAMERA_NOT_FOUND"
    is VideoSource.Error.CameraPermissionRequired -> "PERMISSION_REQUIRED"
    is VideoSource.Error.Interrupted -> "INTERRUPTED"
    else -> "CAMERA_ERROR"
}
