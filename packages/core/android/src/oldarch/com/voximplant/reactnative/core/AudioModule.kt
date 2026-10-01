package com.voximplant.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class AudioModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val impl: AudioModuleImpl = AudioModuleImpl(
        emitOnAudioDeviceChanged = { device -> emit("onAudioDeviceChanged", device) },
        emitOnAudioDeviceListChanged = { devices -> emit("onAudioDeviceListChanged", devices) },
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

    @ReactMethod
    fun selectDevice(device: ReadableMap, promise: Promise) =
        impl.selectDevice(device, promise)

    @ReactMethod
    fun setDefaultDeviceType(deviceType: String) =
        impl.setDefaultDeviceType(deviceType)

    @ReactMethod
    fun callKitProviderDidActivateAudioSession() =
        impl.callKitProviderDidActivateAudioSession()

    @ReactMethod
    fun callKitProviderDidDeactivateAudioSession() =
        impl.callKitProviderDidDeactivateAudioSession()

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
        const val NAME = "RNVIAudio"
    }
}
