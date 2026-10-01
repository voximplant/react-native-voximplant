package com.voximplant.reactnative.calls

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class CallsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val impl: CallsModuleImpl = CallsModuleImpl(
        reactContext = reactContext,
        emitOnCallConnected = { payload -> emit("onCallConnected", payload) },
        emitOnCallDisconnected = { payload -> emit("onCallDisconnected", payload) },
        emitOnCallFailed = { payload -> emit("onCallFailed", payload) },
        emitOnCallReconnecting = { payload -> emit("onCallReconnecting", payload) },
        emitOnCallReconnected = { payload -> emit("onCallReconnected", payload) },
        emitOnCallStartRinging = { payload -> emit("onCallStartRinging", payload) },
        emitOnCallStopRinging = { payload -> emit("onCallStopRinging", payload) },
        emitOnCallMessageReceived = { payload -> emit("onCallMessageReceived", payload) },
        emitOnCallInfoReceived = { payload -> emit("onCallInfoReceived", payload) },
        emitOnCallStatsReceived = { payload -> emit("onCallStatsReceived", payload) },
        emitOnCallRemoteVideoStreamAdded = { payload -> emit("onCallRemoteVideoStreamAdded", payload) },
        emitOnCallRemoteVideoStreamRemoved = { payload -> emit("onCallRemoteVideoStreamRemoved", payload) },
        emitOnIncomingCall = { payload -> emit("onIncomingCall", payload) },

        emitOnConferenceConnected = { payload -> emit("onConferenceConnected", payload) },
        emitOnConferenceDisconnected = { payload -> emit("onConferenceDisconnected", payload) },
        emitOnConferenceFailed = { payload -> emit("onConferenceFailed", payload) },
        emitOnConferenceReconnecting = { payload -> emit("onConferenceReconnecting", payload) },
        emitOnConferenceReconnected = { payload -> emit("onConferenceReconnected", payload) },
        emitOnConferenceStatsReceived = { payload -> emit("onConferenceStatsReceived", payload) },
        emitOnConferenceEndpointAdded = { payload -> emit("onConferenceEndpointAdded", payload) },
        emitOnConferenceEndpointRemoved = { payload -> emit("onConferenceEndpointRemoved", payload) },
        emitOnConferenceMessageReceived = { payload -> emit("onConferenceMessageReceived", payload) },
        emitOnConferenceInfoReceived = { payload -> emit("onConferenceInfoReceived", payload) },
        emitOnConferenceLocalVoiceActivityChanged = { payload -> emit("onConferenceLocalVoiceActivityChanged", payload) },
        emitOnEndpointMuteStateChanged = { payload -> emit("onEndpointMuteStateChanged", payload) },
        emitOnEndpointVoiceActivityChanged = { payload -> emit("onEndpointVoiceActivityChanged", payload) },
        emitOnEndpointRemoteVideoStreamAdded = { payload -> emit("onEndpointRemoteVideoStreamAdded", payload) },
        emitOnEndpointRemoteVideoStreamRemoved = { payload -> emit("onEndpointRemoteVideoStreamRemoved", payload) },
        emitOnEndpointStartReceivingVideoStream = { payload -> emit("onEndpointStartReceivingVideoStream", payload) },
        emitOnEndpointStopReceivingVideoStream = { payload -> emit("onEndpointStopReceivingVideoStream", payload) },
    )

    override fun getName(): String = NAME

    override fun initialize() =
        impl.initialize()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun createCall(destination: String, settings: ReadableMap?): String? =
        impl.createCall(destination, settings)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getCalls(): WritableArray = impl.getCalls()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasCall(id: String): Boolean = impl.hasCall(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getCallState(id: String): String = impl.getCallState(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getCallDirection(id: String): String = impl.getCallDirection(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDuration(id: String): Double = impl.getDuration(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getIsMuted(id: String): Boolean = impl.getIsMuted(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getIsOnHold(id: String): Boolean = impl.getIsOnHold(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getRemoteDisplayName(id: String): String? = impl.getRemoteDisplayName(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getRemoteUsername(id: String): String? = impl.getRemoteUsername(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getLocalVideoStreams(id: String): WritableArray = impl.getLocalVideoStreams(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getLocalVideoStream(id: String, streamId: String): WritableMap? =
        impl.getLocalVideoStream(id, streamId)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getRemoteVideoStreams(id: String): WritableArray = impl.getRemoteVideoStreams(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasRemoteVideoStreamForCall(id: String, streamId: String): Boolean =
        impl.hasRemoteVideoStreamForCall(id, streamId)

    @ReactMethod
    fun start(id: String) = impl.start(id)

    @ReactMethod
    fun answer(id: String, settings: ReadableMap?) = impl.answer(id, settings)

    @ReactMethod
    fun hangup(id: String, headers: ReadableMap?) = impl.hangup(id, headers)

    @ReactMethod
    fun reject(id: String, mode: String, headers: ReadableMap?) =
        impl.reject(id, mode, headers)

    @ReactMethod
    fun mute(id: String, value: Boolean) = impl.mute(id, value)

    @ReactMethod
    fun sendDTMF(id: String, tones: String) = impl.sendDTMF(id, tones)

    @ReactMethod
    fun sendMessage(id: String, text: String) = impl.sendMessage(id, text)

    @ReactMethod
    fun sendInfo(id: String, params: ReadableMap) = impl.sendInfo(id, params)

    @ReactMethod
    fun hold(id: String, enable: Boolean, promise: Promise) =
        impl.hold(id, enable, promise)

    @ReactMethod
    fun startSendingVideo(id: String, streamId: String, promise: Promise) =
        impl.startSendingVideo(id, streamId, promise)

    @ReactMethod
    fun stopSendingVideo(id: String, promise: Promise) =
        impl.stopSendingVideo(id, promise)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun createConference(conferenceName: String, settings: ReadableMap?): String? =
        impl.createConference(conferenceName, settings)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getConferences(): WritableArray =
        impl.getConferences()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasConference(id: String): Boolean = impl.hasConference(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStateForConference(id: String): String =
        impl.getStateForConference(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getEndpointIdForConference(id: String): String? =
        impl.getEndpointIdForConference(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getEndpointsForConference(id: String): WritableArray =
        impl.getEndpointsForConference(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasEndpointForConference(id: String, endpointId: String): Boolean =
        impl.hasEndpointForConference(id, endpointId)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasAudioStreamForEndpoint(id: String, streamId: String): Boolean =
        impl.hasAudioStreamForEndpoint(id, streamId)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun hasVideoStreamForEndpoint(id: String, streamId: String): Boolean =
        impl.hasVideoStreamForEndpoint(id, streamId)

    @ReactMethod
    fun joinForConference(id: String) =
        impl.joinForConference(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDisplayNameForEndpoint(id: String): String? =
        impl.getDisplayNameForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getUsernameForEndpoint(id: String): String? =
        impl.getUsernameForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getSipUriForEndpoint(id: String): String? =
        impl.getSipUriForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getIsMutedForEndpoint(id: String): Boolean =
        impl.getIsMutedForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getIsVoiceActivityDetectedForEndpoint(id: String): Boolean =
        impl.getIsVoiceActivityDetectedForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getAudioStreamsForEndpoint(id: String): WritableArray =
        impl.getAudioStreamsForEndpoint(id)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getVideoStreamsForEndpoint(id: String): WritableArray =
        impl.getVideoStreamsForEndpoint(id)

    @ReactMethod
    fun startReceivingVideoForEndpoint(id: String, streamId: String) =
        impl.startReceivingVideoForEndpoint(id, streamId)

    @ReactMethod
    fun stopReceivingVideoForEndpoint(id: String, streamId: String) =
        impl.stopReceivingVideoForEndpoint(id, streamId)

    @ReactMethod
    fun requestVideoSizeForEndpoint(id: String, streamId: String, size: ReadableMap, promise: Promise) =
        impl.requestVideoSizeForEndpoint(id, streamId, size, promise)

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
        const val NAME = "RNVICalls"
    }
}
