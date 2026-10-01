package com.voximplant.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class AudioModule(reactContext: ReactApplicationContext) : NativeAudioSpec(reactContext) {
    private val impl: AudioModuleImpl = AudioModuleImpl(
        emitOnAudioDeviceChanged = ::emitOnAudioDeviceChanged,
        emitOnAudioDeviceListChanged = ::emitOnAudioDeviceListChanged,
    )

    override fun initialize() {
        super.initialize()
        impl.initialize()
    }

    override fun invalidate() {
        impl.invalidate()
        super.invalidate()
    }

    override fun getDevices(): WritableArray =
        impl.getDevices()

    override fun getDevice(id: String): WritableMap? =
        impl.getDevice(id)

    override fun hasDevice(id: String): Boolean =
        impl.hasDevice(id)

    override fun getSelectedDevice(): WritableMap? =
        impl.getSelectedDevice()

    override fun selectDevice(device: ReadableMap, promise: Promise) =
        impl.selectDevice(device, promise)

    override fun setDefaultDeviceType(deviceType: String) =
        impl.setDefaultDeviceType(deviceType)

    override fun callKitProviderDidActivateAudioSession() =
        impl.callKitProviderDidActivateAudioSession()

    override fun callKitProviderDidDeactivateAudioSession() =
        impl.callKitProviderDidDeactivateAudioSession()

    companion object {
        const val NAME = NativeAudioSpec.NAME
    }
}
