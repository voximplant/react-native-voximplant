package com.voximplant.reactnative.calls

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class VideoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val impl: VideoModuleImpl = VideoModuleImpl(
        reactContext = reactContext,
        emitOnStarted = { emit("onStarted", null) },
        emitOnStopped = { reason -> emit("onStopped", reason) },
        emitOnFailed = { payload -> emit("onFailed", payload) },
    )

    override fun getName(): String = NAME

    override fun initialize() = impl.initialize()

    override fun invalidate() = impl.invalidate()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDevices(): WritableArray = impl.getDevices()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDevice(id: String): WritableMap? = impl.getDevice(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasDevice(id: String): Boolean = impl.hasDevice(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getSelectedDevice(): WritableMap? = impl.getSelectedDevice()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getPreferredResolution(): WritableMap? = impl.getPreferredResolution()

    @ReactMethod
    fun selectDevice(device: ReadableMap, promise: Promise) =
        impl.selectDevice(device, promise)

    @ReactMethod
    fun setPreferredResolution(preference: ReadableMap) =
        impl.setPreferredResolution(preference)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun createLocalStream(source: String): String? =
        impl.createLocalStream(source)

    @ReactMethod
    fun removeLocalStream(streamId: String) =
        impl.removeLocalStream(streamId)

    @ReactMethod
    fun removeAllLocalStreams() =
        impl.removeAllLocalStreams()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getLocalStreams(): WritableArray =
        impl.getLocalStreams()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getLocalStream(streamId: String): WritableMap? =
        impl.getLocalStream(streamId)

    @ReactMethod
    fun addListener(eventName: String) = Unit

    @ReactMethod
    fun removeListeners(count: Double) = Unit
    private fun emit(eventName: String, payload: Any?) {
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, payload)
    }

    companion object {
        const val NAME = "RNVIVideo"
    }
}
