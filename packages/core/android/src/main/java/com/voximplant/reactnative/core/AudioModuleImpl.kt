package com.voximplant.reactnative.core

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.voximplant.android.sdk.core.VICore
import com.voximplant.android.sdk.core.audio.AudioDevice
import com.voximplant.android.sdk.core.audio.AudioDeviceListener
import com.voximplant.android.sdk.core.audio.AudioDeviceManager
import com.voximplant.android.sdk.core.audio.AudioDeviceType
import com.voximplant.reactnative.bridge.asWritableMap

class AudioModuleImpl(
    emitOnAudioDeviceChanged: (WritableMap) -> Unit,
    emitOnAudioDeviceListChanged: (WritableArray) -> Unit,
) {
    private var isAudioDeviceListenerRegistered = false

    private val audioDeviceListener: AudioDeviceListener = object : AudioDeviceListener {
        override fun onAudioDeviceChanged(audioDevice: AudioDevice) {
            emitOnAudioDeviceChanged(audioDevice.asWritableMap())
        }

        override fun onAudioDeviceListChanged(audioDevices: List<AudioDevice>) {
            emitOnAudioDeviceListChanged(audioDevices.asWritableArray())
        }
    }

    fun getDevices(): WritableArray {
        if (!VICore.isInitialized) return Arguments.createArray()
        ensureAudioDeviceListenerRegistered()
        return AudioDeviceManager.audioDevices.asWritableArray()
    }

    fun getDevice(id: String): WritableMap? {
        if (!VICore.isInitialized) return null
        ensureAudioDeviceListenerRegistered()
        val deviceId = id.toIntOrNull() ?: return null
        return AudioDeviceManager.audioDevices.firstOrNull { it.id == deviceId }?.asWritableMap()
    }

    fun hasDevice(id: String): Boolean {
        if (!VICore.isInitialized) return false
        ensureAudioDeviceListenerRegistered()
        val deviceId = id.toIntOrNull() ?: return false
        return AudioDeviceManager.audioDevices.any { it.id == deviceId }
    }

    fun getSelectedDevice(): WritableMap? {
        if (!VICore.isInitialized) return null
        ensureAudioDeviceListenerRegistered()
        return AudioDeviceManager.selectedAudioDevice?.asWritableMap()
    }

    fun selectDevice(
        device: ReadableMap,
        promise: Promise,
    ) {
        if (!VICore.isInitialized) {
            promise.reject(
                code = "NOT_FOUND",
                message = "The audio device could not be found because the Voximplant SDK is not initialized",
            )
            return
        }
        ensureAudioDeviceListenerRegistered()

        val deviceId = device.getString("id")?.toIntOrNull()

        val audioDevice = AudioDeviceManager.audioDevices.firstOrNull { it.id == deviceId } ?: run {
            promise.reject(code = "NOT_FOUND", message = "Audio device with id $deviceId not found in the device list")
            return
        }

        AudioDeviceManager.selectAudioDevice(audioDevice)
        promise.resolve(null)
    }

    fun setDefaultDeviceType(deviceType: String) {
        if (!VICore.isInitialized) return
        ensureAudioDeviceListenerRegistered()

        val audioDeviceType = getAudioDeviceTypeOrNull(deviceType) ?: return
        AudioDeviceManager.setDefaultAudioDeviceType(audioDeviceType)
    }

    fun callKitProviderDidActivateAudioSession() {
    }

    fun callKitProviderDidDeactivateAudioSession() {
    }

    fun initialize() {
        ensureAudioDeviceListenerRegistered()
    }

    fun invalidate() {
        if (VICore.isInitialized && isAudioDeviceListenerRegistered) {
            AudioDeviceManager.removeAudioDeviceListener(audioDeviceListener)
            isAudioDeviceListenerRegistered = false
        }
    }

    private fun ensureAudioDeviceListenerRegistered() {
        if (!VICore.isInitialized || isAudioDeviceListenerRegistered) return
        AudioDeviceManager.addAudioDeviceListener(audioDeviceListener)
        isAudioDeviceListenerRegistered = true
    }

    private fun getAudioDeviceTypeOrNull(deviceType: String): AudioDeviceType? =
        when (deviceType) {
            "EARPIECE" -> AudioDeviceType.Earpiece
            "SPEAKER" -> AudioDeviceType.Speaker
            "BLUETOOTH" -> AudioDeviceType.Bluetooth
            "WIRED" -> AudioDeviceType.WiredHeadset
            "USB" -> AudioDeviceType.Usb
            else -> null
        }
}

private fun AudioDeviceType.asReactNativeType(): String = when (this) {
    AudioDeviceType.Earpiece -> "EARPIECE"
    AudioDeviceType.Speaker -> "SPEAKER"
    AudioDeviceType.Bluetooth -> "BLUETOOTH"
    AudioDeviceType.WiredHeadset -> "WIRED"
    AudioDeviceType.Usb -> "USB"
}

private fun AudioDevice.asWritableMap(): WritableMap = mapOf<String, Any>(
    "id" to id.toString(),
    "name" to name,
    "type" to type.asReactNativeType(),
    "hasMic" to hasMic,
).asWritableMap()

private fun List<AudioDevice>.asWritableArray(): WritableArray = Arguments.createArray().apply {
    forEach { pushMap(it.asWritableMap()) }
}
