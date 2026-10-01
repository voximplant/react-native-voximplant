package com.voximplant.reactnative.calls

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class VideoModule(reactContext: ReactApplicationContext) : NativeVideoSpec(reactContext) {
    private val impl: VideoModuleImpl = VideoModuleImpl(
        reactContext = reactContext,
        emitOnStarted = ::emitOnStarted,
        emitOnStopped = ::emitOnStopped,
        emitOnFailed = ::emitOnFailed,
    )

    override fun initialize() = impl.initialize()

    override fun invalidate() = impl.invalidate()

    override fun getDevices(): WritableArray =
        impl.getDevices()

    override fun getDevice(id: String): WritableMap? =
        impl.getDevice(id)

    override fun hasDevice(id: String): Boolean =
        impl.hasDevice(id)

    override fun getSelectedDevice(): WritableMap? =
        impl.getSelectedDevice()

    override fun getPreferredResolution(): WritableMap? =
        impl.getPreferredResolution()

    override fun selectDevice(device: ReadableMap, promise: Promise) =
        impl.selectDevice(device, promise)

    override fun setPreferredResolution(preference: ReadableMap) =
        impl.setPreferredResolution(preference)

    override fun createLocalStream(source: String): String? =
        impl.createLocalStream(source)

    override fun removeLocalStream(streamId: String) =
        impl.removeLocalStream(streamId)

    override fun removeAllLocalStreams() =
        impl.removeAllLocalStreams()

    override fun getLocalStreams(): WritableArray =
        impl.getLocalStreams()

    override fun getLocalStream(streamId: String): WritableMap? =
        impl.getLocalStream(streamId)

    companion object {
        const val NAME = "RNVIVideo"
    }
}
