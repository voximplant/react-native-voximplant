package com.voximplant.reactnative.calls

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class CallsModule(reactContext: ReactApplicationContext) : NativeCallsSpec(reactContext) {
    private val impl: CallsModuleImpl = CallsModuleImpl(
        reactContext = reactContext,
        emitOnCallConnected = ::emitOnCallConnected,
        emitOnCallDisconnected = ::emitOnCallDisconnected,
        emitOnCallFailed = ::emitOnCallFailed,
        emitOnCallReconnecting = ::emitOnCallReconnecting,
        emitOnCallReconnected = ::emitOnCallReconnected,
        emitOnCallStartRinging = ::emitOnCallStartRinging,
        emitOnCallStopRinging = ::emitOnCallStopRinging,
        emitOnCallMessageReceived = ::emitOnCallMessageReceived,
        emitOnCallInfoReceived = ::emitOnCallInfoReceived,
        emitOnCallStatsReceived = ::emitOnCallStatsReceived,
        emitOnCallRemoteVideoStreamAdded = ::emitOnCallRemoteVideoStreamAdded,
        emitOnCallRemoteVideoStreamRemoved = ::emitOnCallRemoteVideoStreamRemoved,
        emitOnIncomingCall = ::emitOnIncomingCall,
        emitOnConferenceConnected = ::emitOnConferenceConnected,
        emitOnConferenceDisconnected = ::emitOnConferenceDisconnected,
        emitOnConferenceFailed = ::emitOnConferenceFailed,
        emitOnConferenceReconnecting = ::emitOnConferenceReconnecting,
        emitOnConferenceReconnected = ::emitOnConferenceReconnected,
        emitOnConferenceStatsReceived = ::emitOnConferenceStatsReceived,
        emitOnConferenceEndpointAdded = ::emitOnConferenceEndpointAdded,
        emitOnConferenceEndpointRemoved = ::emitOnConferenceEndpointRemoved,
        emitOnConferenceMessageReceived = ::emitOnConferenceMessageReceived,
        emitOnConferenceInfoReceived = ::emitOnConferenceInfoReceived,
        emitOnConferenceLocalVoiceActivityChanged = ::emitOnConferenceLocalVoiceActivityChanged,
        emitOnEndpointMuteStateChanged = ::emitOnEndpointMuteStateChanged,
        emitOnEndpointVoiceActivityChanged = ::emitOnEndpointVoiceActivityChanged,
        emitOnEndpointRemoteVideoStreamAdded = ::emitOnEndpointRemoteVideoStreamAdded,
        emitOnEndpointRemoteVideoStreamRemoved = ::emitOnEndpointRemoteVideoStreamRemoved,
        emitOnEndpointStartReceivingVideoStream = ::emitOnEndpointStartReceivingVideoStream,
        emitOnEndpointStopReceivingVideoStream = ::emitOnEndpointStopReceivingVideoStream,
    )

    override fun initialize() = impl.initialize()

    override fun createCall(destination: String, settings: ReadableMap?): String? =
        impl.createCall(destination, settings)

    override fun getCalls(): WritableArray =
        impl.getCalls()

    override fun hasCall(id: String): Boolean =
        impl.hasCall(id)

    override fun getCallState(id: String): String =
        impl.getCallState(id)

    override fun getCallDirection(id: String): String =
        impl.getCallDirection(id)

    override fun getDuration(id: String): Double =
        impl.getDuration(id)

    override fun getIsMuted(id: String): Boolean =
        impl.getIsMuted(id)

    override fun getIsOnHold(id: String): Boolean =
        impl.getIsOnHold(id)

    override fun getRemoteDisplayName(id: String): String? =
        impl.getRemoteDisplayName(id)

    override fun getRemoteUsername(id: String): String? =
        impl.getRemoteUsername(id)

    override fun getLocalVideoStreams(id: String): WritableArray =
        impl.getLocalVideoStreams(id)

    override fun getLocalVideoStream(id: String, streamId: String): WritableMap? =
        impl.getLocalVideoStream(id, streamId)

    override fun getRemoteVideoStreams(id: String): WritableArray =
        impl.getRemoteVideoStreams(id)

    override fun hasRemoteVideoStreamForCall(id: String, streamId: String): Boolean =
        impl.hasRemoteVideoStreamForCall(id, streamId)

    override fun start(id: String) =
        impl.start(id)

    override fun answer(id: String, settings: ReadableMap?) =
        impl.answer(id, settings)

    override fun hangup(id: String, headers: ReadableMap?) =
        impl.hangup(id, headers)

    override fun reject(id: String, mode: String, headers: ReadableMap?) =
        impl.reject(id, mode, headers)

    override fun mute(id: String, value: Boolean) =
        impl.mute(id, value)

    override fun sendDTMF(id: String, tones: String) =
        impl.sendDTMF(id, tones)

    override fun sendMessage(id: String, text: String) =
        impl.sendMessage(id, text)

    override fun sendInfo(id: String, params: ReadableMap) =
        impl.sendInfo(id, params)

    override fun hold(id: String, enable: Boolean, promise: Promise) =
        impl.hold(id, enable, promise)

    override fun startSendingVideo(id: String, streamId: String, promise: Promise) =
        impl.startSendingVideo(id, streamId, promise)

    override fun stopSendingVideo(id: String, promise: Promise) =
        impl.stopSendingVideo(id, promise)

    override fun createConference(conferenceName: String, settings: ReadableMap?): String? =
        impl.createConference(conferenceName, settings)

    override fun getConferences(): WritableArray =
        impl.getConferences()

    override fun hasConference(id: String): Boolean =
        impl.hasConference(id)

    override fun getStateForConference(id: String): String =
        impl.getStateForConference(id)

    override fun getEndpointIdForConference(id: String): String? =
        impl.getEndpointIdForConference(id)

    override fun getEndpointsForConference(id: String): WritableArray =
        impl.getEndpointsForConference(id)

    override fun hasEndpointForConference(id: String, endpointId: String): Boolean =
        impl.hasEndpointForConference(id, endpointId)

    override fun hasAudioStreamForEndpoint(id: String, streamId: String): Boolean =
        impl.hasAudioStreamForEndpoint(id, streamId)

    override fun hasVideoStreamForEndpoint(id: String, streamId: String): Boolean =
        impl.hasVideoStreamForEndpoint(id, streamId)

    override fun joinForConference(id: String) =
        impl.joinForConference(id)

    override fun getDisplayNameForEndpoint(id: String): String? =
        impl.getDisplayNameForEndpoint(id)

    override fun getUsernameForEndpoint(id: String): String? =
        impl.getUsernameForEndpoint(id)

    override fun getSipUriForEndpoint(id: String): String? =
        impl.getSipUriForEndpoint(id)

    override fun getIsMutedForEndpoint(id: String): Boolean =
        impl.getIsMutedForEndpoint(id)

    override fun getIsVoiceActivityDetectedForEndpoint(id: String): Boolean =
        impl.getIsVoiceActivityDetectedForEndpoint(id)

    override fun getAudioStreamsForEndpoint(id: String): WritableArray =
        impl.getAudioStreamsForEndpoint(id)

    override fun getVideoStreamsForEndpoint(id: String): WritableArray =
        impl.getVideoStreamsForEndpoint(id)

    override fun startReceivingVideoForEndpoint(id: String, streamId: String) =
        impl.startReceivingVideoForEndpoint(id, streamId)

    override fun stopReceivingVideoForEndpoint(id: String, streamId: String) =
        impl.stopReceivingVideoForEndpoint(id, streamId)

    override fun requestVideoSizeForEndpoint(id: String, streamId: String, size: ReadableMap, promise: Promise) =
        impl.requestVideoSizeForEndpoint(id, streamId, size, promise)

    companion object {
        const val NAME = "RNVICalls"
    }
}
