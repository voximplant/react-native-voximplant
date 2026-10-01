package com.voximplant.reactnative.calls

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.voximplant.android.sdk.calls.Call
import com.voximplant.android.sdk.calls.CallCallback
import com.voximplant.android.sdk.calls.CallDirection
import com.voximplant.android.sdk.calls.CallDisconnectReason
import com.voximplant.android.sdk.calls.CallError
import com.voximplant.android.sdk.calls.CallException as SdkCallException
import com.voximplant.android.sdk.calls.CallListener
import com.voximplant.android.sdk.calls.CallSettings
import com.voximplant.android.sdk.calls.CallState
import com.voximplant.android.sdk.calls.Conference
import com.voximplant.android.sdk.calls.ConferenceDisconnectReason
import com.voximplant.android.sdk.calls.ConferenceListener
import com.voximplant.android.sdk.calls.ConferenceSettings
import com.voximplant.android.sdk.calls.Endpoint
import com.voximplant.android.sdk.calls.EndpointListener
import com.voximplant.android.sdk.calls.IncomingCallListener
import com.voximplant.android.sdk.calls.LocalVideoStream
import com.voximplant.android.sdk.calls.RejectMode
import com.voximplant.android.sdk.calls.RemoteVideoStream
import com.voximplant.android.sdk.calls.VICalls
import com.voximplant.android.sdk.calls.VideoCodec
import com.voximplant.android.sdk.calls.VideoStreamReceiveStopReason
import com.voximplant.android.sdk.calls.stats.CallStats
import com.voximplant.android.sdk.calls.stats.ConferenceStats
import com.voximplant.android.sdk.core.VICore
import com.voximplant.reactnative.calls.bridge.asMapOf
import com.voximplant.reactnative.calls.bridge.asWritableMap

class CallsModuleImpl(
    private val reactContext: ReactApplicationContext,
    emitOnCallConnected: (WritableMap) -> Unit,
    emitOnCallDisconnected: (WritableMap) -> Unit,
    emitOnCallFailed: (WritableMap) -> Unit,
    emitOnCallReconnecting: (WritableMap) -> Unit,
    emitOnCallReconnected: (WritableMap) -> Unit,
    emitOnCallStartRinging: (WritableMap) -> Unit,
    emitOnCallStopRinging: (WritableMap) -> Unit,
    emitOnCallMessageReceived: (WritableMap) -> Unit,
    emitOnCallInfoReceived: (WritableMap) -> Unit,
    emitOnCallStatsReceived: (WritableMap) -> Unit,
    emitOnCallRemoteVideoStreamAdded: (WritableMap) -> Unit,
    emitOnCallRemoteVideoStreamRemoved: (WritableMap) -> Unit,
    emitOnIncomingCall: (WritableMap) -> Unit,

    emitOnConferenceConnected: (WritableMap) -> Unit,
    emitOnConferenceDisconnected: (WritableMap) -> Unit,
    emitOnConferenceFailed: (WritableMap) -> Unit,
    emitOnConferenceReconnecting: (WritableMap) -> Unit,
    emitOnConferenceReconnected: (WritableMap) -> Unit,
    emitOnConferenceStatsReceived: (WritableMap) -> Unit,
    emitOnConferenceEndpointAdded: (WritableMap) -> Unit,
    emitOnConferenceEndpointRemoved: (WritableMap) -> Unit,
    emitOnConferenceMessageReceived: (WritableMap) -> Unit,
    emitOnConferenceInfoReceived: (WritableMap) -> Unit,
    emitOnConferenceLocalVoiceActivityChanged: (WritableMap) -> Unit,

    emitOnEndpointMuteStateChanged: (WritableMap) -> Unit,
    emitOnEndpointVoiceActivityChanged: (WritableMap) -> Unit,
    emitOnEndpointRemoteVideoStreamAdded: (WritableMap) -> Unit,
    emitOnEndpointRemoteVideoStreamRemoved: (WritableMap) -> Unit,
    emitOnEndpointStartReceivingVideoStream: (WritableMap) -> Unit,
    emitOnEndpointStopReceivingVideoStream: (WritableMap) -> Unit,

) {

    private val callListener: CallListener = object : CallListener {
        override fun onCallConnected(
            call: Call,
            withVideo: Boolean,
            headers: Map<String, String>?,
        ) {
            emitOnCallConnected(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putMap("headers", headers?.asWritableMap())
                    // putBoolean("withVideo", withVideo)
                },
            )
        }

        override fun onCallDisconnected(
            call: Call,
            headers: Map<String, String>?,
            disconnectReason: CallDisconnectReason,
        ) {
            emitOnCallDisconnected(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putString("reason", disconnectReason.asReactNative())
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onCallFailed(
            call: Call,
            code: Int,
            description: String?,
            headers: Map<String, String>?,
        ) {
            emitOnCallFailed(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putInt("code", code)
                    putString("reason", description)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onCallReconnecting(call: Call) {
            emitOnCallReconnecting(callIdPayload(call.id))
        }

        override fun onCallReconnected(call: Call) {
            emitOnCallReconnected(callIdPayload(call.id))
        }

        override fun onStartRinging(call: Call, headers: Map<String, String>?) {
            emitOnCallStartRinging(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onStopRinging(call: Call) {
            emitOnCallStopRinging(callIdPayload(call.id))
        }

        override fun onMessageReceived(call: Call, text: String) {
            emitOnCallMessageReceived(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putString("text", text)
                },
            )
        }

        override fun onInfoReceived(
            call: Call,
            type: String,
            content: String,
            headers: Map<String, String>?,
        ) {
            emitOnCallInfoReceived(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putString("mimeType", type)
                    putString("body", content)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onCallStatsReceived(call: Call, callStats: CallStats) {
            emitOnCallStatsReceived(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putDouble("timestamp", callStats.timestamp)
                },
            )
        }

        override fun onRemoteVideoStreamAdded(call: Call, videoStream: RemoteVideoStream) {
            VideoModuleImpl.addVideoStream(videoStream)
            emitOnCallRemoteVideoStreamAdded(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putString("streamId", videoStream.id)
                },
            )
        }

        override fun onRemoteVideoStreamRemoved(call: Call, videoStream: RemoteVideoStream) {
            VideoModuleImpl.removeVideoStream(videoStream)
            emitOnCallRemoteVideoStreamRemoved(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putString("streamId", videoStream.id)
                },
            )
        }
    }

    private val conferenceListener: ConferenceListener = object : ConferenceListener {
        override fun onConferenceConnected(
            conference: Conference,
            headers: Map<String, String>?,
        ) {
            emitOnConferenceConnected(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onConferenceDisconnected(
            conference: Conference,
            headers: Map<String, String>?,
            disconnectReason: ConferenceDisconnectReason,
        ) {
            emitOnConferenceDisconnected(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putString("reason", disconnectReason.asReactNative())
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onConferenceFailed(
            conference: Conference,
            code: Int,
            description: String?,
            headers: Map<String, String>?,
        ) {
            emitOnConferenceFailed(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putInt("code", code)
                    putString("reason", description)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onConferenceReconnecting(conference: Conference) {
            emitOnConferenceReconnecting(conferenceIdPayload(conference.id))
        }

        override fun onConferenceReconnected(conference: Conference) {
            emitOnConferenceReconnected(conferenceIdPayload(conference.id))
        }

        override fun onConferenceStatsReceived(
            conference: Conference,
            conferenceStats: ConferenceStats,
        ) {
            emitOnConferenceStatsReceived(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putDouble("timestamp", conferenceStats.timestamp)
                },
            )
        }

        override fun onEndpointAdded(conference: Conference, endpoint: Endpoint) {
            endpoint.setEndpointListener(endpointListener)
            emitOnConferenceEndpointAdded(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putString("endpointId", endpoint.id)
                },
            )
        }

        override fun onEndpointRemoved(conference: Conference, endpoint: Endpoint) {
            emitOnConferenceEndpointRemoved(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putString("endpointId", endpoint.id)
                },
            )
        }

        override fun onMessageReceived(conference: Conference, text: String) {
            emitOnConferenceMessageReceived(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putString("text", text)
                },
            )
        }

        override fun onInfoReceived(
            conference: Conference,
            type: String,
            content: String,
            headers: Map<String, String>?,
        ) {
            emitOnConferenceInfoReceived(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putString("mimeType", type)
                    putString("body", content)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }

        override fun onLocalVoiceActivityChanged(
            conference: Conference,
            voiceDetected: Boolean,
        ) {
            emitOnConferenceLocalVoiceActivityChanged(
                Arguments.createMap().apply {
                    putString("conferenceId", conference.id)
                    putBoolean("isVoiceActivityDetected", voiceDetected)
                },
            )
        }
    }

    private val endpointListener: EndpointListener = object : EndpointListener {
        override fun onEndpointMuteStateChanged(endpoint: Endpoint, muted: Boolean) {
            emitOnEndpointMuteStateChanged(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putBoolean("isMuted", muted)
                },
            )
        }

        override fun onEndpointVoiceActivityChanged(
            endpoint: Endpoint,
            voiceDetected: Boolean,
        ) {
            emitOnEndpointVoiceActivityChanged(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putBoolean("isVoiceActivityDetected", voiceDetected)
                },
            )
        }

        override fun onRemoteVideoStreamAdded(
            endpoint: Endpoint,
            videoStream: RemoteVideoStream,
        ) {
            VideoModuleImpl.addVideoStream(videoStream)
            emitOnEndpointRemoteVideoStreamAdded(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putString("streamId", videoStream.id)
                },
            )
        }

        override fun onRemoteVideoStreamRemoved(
            endpoint: Endpoint,
            videoStream: RemoteVideoStream,
        ) {
            VideoModuleImpl.removeVideoStream(videoStream)
            emitOnEndpointRemoteVideoStreamRemoved(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putString("streamId", videoStream.id)
                },
            )
        }

        override fun onStartReceivingVideoStream(
            endpoint: Endpoint,
            videoStream: RemoteVideoStream,
        ) {
            emitOnEndpointStartReceivingVideoStream(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putString("streamId", videoStream.id)
                },
            )
        }

        override fun onStopReceivingVideoStream(
            endpoint: Endpoint,
            videoStream: RemoteVideoStream,
            reason: VideoStreamReceiveStopReason,
        ) {
            emitOnEndpointStopReceivingVideoStream(
                Arguments.createMap().apply {
                    putString("endpointId", endpoint.id)
                    putString("streamId", videoStream.id)
                    putString("reason", reason.asReactNative())
                },
            )
        }
    }

    private val incomingCallListener = object : IncomingCallListener {
        override fun onIncomingCall(
            call: Call,
            hasIncomingVideo: Boolean,
            headers: Map<String, String>?,
        ) {
            call.setCallListener(callListener)
            emitOnIncomingCall(
                Arguments.createMap().apply {
                    putString("callId", call.id)
                    putBoolean("withVideo", hasIncomingVideo)
                    putMap("headers", headers?.asWritableMap())
                },
            )
        }
    }

    fun initialize() {
        ensureInitialized(reactContext)
        VICalls.setIncomingCallListener(incomingCallListener)
        VICalls.calls.values.forEach { it.setCallListener(callListener) }
        VICalls.conferences.values.forEach { conference ->
            conference.setConferenceListener(conferenceListener)
            conference.endpoints.forEach { it.setEndpointListener(endpointListener) }
        }
    }

    fun createCall(destination: String, settings: ReadableMap?): String? {
        ensureInitialized(reactContext)

        val call: Call = VICalls.createCall(destination, settings.toCallSettings()) ?: return null

        call.setCallListener(callListener)
        return call.id
    }

    fun getCalls(): WritableArray {
        ensureInitialized(reactContext)

        return Arguments.createArray().apply {
            VICalls.calls.keys.forEach { pushString(it) }
        }
    }

    fun hasCall(id: String): Boolean {
        ensureInitialized(reactContext)
        return getCallById(id) != null
    }

    fun createConference(conferenceName: String, settings: ReadableMap?): String? {
        ensureInitialized(reactContext)
        val conference: Conference =
            VICalls.createConference(conferenceName, settings.toConferenceSettings()) ?: return null
        conference.setConferenceListener(conferenceListener)
        return conference.id
    }

    fun getConferences(): WritableArray {
        ensureInitialized(reactContext)

        return Arguments.createArray().apply {
            VICalls.conferences.keys.forEach { pushString(it) }
        }
    }

    fun hasConference(id: String): Boolean {
        ensureInitialized(reactContext)
        return getConferenceById(id) != null
    }

    fun getStateForConference(id: String): String =
        getConferenceById(id)?.state?.asReactNative() ?: "DISCONNECTED"

    fun getEndpointIdForConference(id: String): String? =
        getConferenceById(id)?.endpointId

    fun getEndpointsForConference(id: String): WritableArray {
        val array = Arguments.createArray()
        getConferenceById(id)?.endpoints?.forEach { endpoint ->
            array.pushString(endpoint.id)
        }
        return array
    }

    fun hasEndpointForConference(id: String, endpointId: String): Boolean =
        getConferenceById(id)?.endpoints?.any { it.id == endpointId } ?: false

    fun joinForConference(id: String) {
        val conference = getConferenceById(id) ?: return
        try {
            conference.join()
        } catch (e: SdkCallException) {
            Log.e("CallsModule", "Failed to join a conference", e)
        }
    }

    fun getDisplayNameForEndpoint(id: String): String? =
        getEndpointById(id)?.displayName

    fun getUsernameForEndpoint(id: String): String? =
        getEndpointById(id)?.username

    fun getSipUriForEndpoint(id: String): String? =
        getEndpointById(id)?.sipUri

    fun getIsMutedForEndpoint(id: String): Boolean =
        getEndpointById(id)?.isMuted ?: false

    fun getIsVoiceActivityDetectedForEndpoint(id: String): Boolean =
        getEndpointById(id)?.isVoiceActivityDetected ?: false

    fun getAudioStreamsForEndpoint(id: String): WritableArray {
        val array = Arguments.createArray()
        getEndpointById(id)?.audioStreams?.forEach { stream ->
            array.pushString(stream.id)
        }
        return array
    }

    fun hasAudioStreamForEndpoint(id: String, streamId: String): Boolean =
        getEndpointById(id)?.audioStreams?.any { it.id == streamId } ?: false

    fun getVideoStreamsForEndpoint(id: String): WritableArray {
        val array = Arguments.createArray()
        getEndpointById(id)?.videoStreams?.forEach { stream ->
            array.pushString(stream.id)
        }
        return array
    }

    fun hasVideoStreamForEndpoint(id: String, streamId: String): Boolean =
        getEndpointById(id)?.videoStreams?.any { it.id == streamId } ?: false

    fun startReceivingVideoForEndpoint(id: String, streamId: String) {
        getEndpointById(id)?.startReceiveVideo(streamId)
    }

    fun stopReceivingVideoForEndpoint(id: String, streamId: String) {
        getEndpointById(id)?.stopReceiveVideo(streamId)
    }

    fun requestVideoSizeForEndpoint(
        id: String,
        streamId: String,
        size: ReadableMap,
        promise: Promise,
    ) {
        val endpoint = getEndpointById(id) ?: run {
            promise.reject("INTERNAL_ERROR", "Endpoint not found")
            return
        }
        val width = if (size.hasKey("width") && !size.isNull("width")) size.getInt("width") else 0
        val height = if (size.hasKey("height") && !size.isNull("height")) size.getInt("height") else 0
        endpoint.requestVideoSize(streamId, width, height)
        promise.resolve(null)
    }

    fun getCallState(id: String): String = getCallById(id)?.state?.asReactNative() ?: "DISCONNECTED"

    fun getCallDirection(id: String): String =
        getCallById(id)?.direction?.asReactNative() ?: "OUTGOING"

    fun getDuration(id: String): Double =
        getCallById(id)?.duration?.toDouble()
            ?: getConferenceById(id)?.duration?.toDouble()
            ?: 0.0

    fun getIsMuted(id: String): Boolean =
        getCallById(id)?.isMuted
            ?: getConferenceById(id)?.isMuted
            ?: false

    fun getIsOnHold(id: String): Boolean = getCallById(id)?.isOnHold ?: false

    fun getRemoteDisplayName(id: String): String? = getCallById(id)?.remoteDisplayName

    fun getRemoteUsername(id: String): String? = getCallById(id)?.remoteSipUri

    fun getLocalVideoStreams(id: String): WritableArray {
        val array = Arguments.createArray()
        getCallById(id)?.localVideoStream?.let { stream ->
            array.pushMap(
                Arguments.createMap().apply {
                    putString("id", stream.id)
                    putString("source", "CAMERA")
                },
            )
            return array
        }
        getConferenceById(id)?.localVideoStreams?.forEach { stream ->
            array.pushMap(
                Arguments.createMap().apply {
                    putString("id", stream.id)
                    putString("source", "CAMERA")
                },
            )
            return array
        }
        return array
    }

    fun getLocalVideoStream(id: String, streamId: String): WritableMap? {
        getCallById(id)?.localVideoStream?.takeIf { it.id == streamId }?.let { stream ->
            return Arguments.createMap().apply {
                putString("id", stream.id)
                putString("source", "CAMERA")
            }
        }

        getConferenceById(id)?.localVideoStreams?.firstOrNull { it.id == streamId }?.let { stream ->
            return Arguments.createMap().apply {
                putString("id", stream.id)
                putString("source", "CAMERA")
            }
        }

        return null
    }

    fun getRemoteVideoStreams(id: String): WritableArray {
        val array = Arguments.createArray()
        getCallById(id)?.remoteVideoStreams?.forEach { stream ->
            array.pushString(stream.id)
        }
        return array
    }

    fun hasRemoteVideoStreamForCall(id: String, streamId: String): Boolean =
        getCallById(id)?.remoteVideoStreams?.any { it.id == streamId } ?: false

    fun start(id: String) {
        val call: Call = getCallById(id) ?: return
        try {
            call.start()
        } catch (e: SdkCallException) {
            Log.e("CallsModule", "Failed to start a call", e)
        }
    }

    fun answer(id: String, settings: ReadableMap?) {
        val call = getCallById(id) ?: return
        try {
            call.answer(settings.toCallSettings())
        } catch (e: SdkCallException) {
            Log.e("CallsModule", "Failed to answer a call", e)
        }
    }

    fun hangup(id: String, headers: ReadableMap?) {
        getCallById(id)?.hangup(headers?.asMapOf<String>())
        getConferenceById(id)?.hangup(headers?.asMapOf<String>())
    }

    fun reject(id: String, mode: String, headers: ReadableMap?) {
        val call = getCallById(id) ?: return
        val rejectMode = when (mode) {
            "BUSY" -> RejectMode.Busy
            "DECLINE" -> RejectMode.Decline
            else -> RejectMode.Decline
        }
        try {
            call.reject(rejectMode, headers?.asMapOf())
        } catch (e: SdkCallException) {
            Log.e("CallsModule", "Failed to reject a call", e)
        }
    }

    fun mute(id: String, value: Boolean) {
        getCallById(id)?.muteAudio(value)
        getConferenceById(id)?.muteAudio(value)
    }

    fun sendDTMF(id: String, tones: String) {
        getCallById(id)?.sendDTMF(tones)
    }

    fun sendMessage(id: String, text: String) {
        getCallById(id)?.sendMessage(text)
        getConferenceById(id)?.sendMessage(text)
    }

    fun sendInfo(id: String, params: ReadableMap) {
        val mimeType = params.getString("mimeType") ?: return
        val body = params.getString("body") ?: return
        val headers = if (params.hasKey("headers") && !params.isNull("headers")) {
            params.getMap("headers")?.asMapOf<String>()
        } else {
            null
        }
        getCallById(id)?.sendInfo(mimeType, body, headers)
        getConferenceById(id)?.sendInfo(mimeType, body, headers)
    }

    fun hold(id: String, enable: Boolean, promise: Promise) {
        val call = getCallById(id) ?: run {
            promise.reject("INTERNAL_ERROR", "Call not found")
            return
        }
        call.hold(enable, promise.asCallCallback())
    }

    fun startSendingVideo(id: String, streamId: String, promise: Promise) {
        val stream = VideoModuleImpl.getVideoStreamById(streamId) as? LocalVideoStream ?: run {
            promise.reject("INTERNAL_ERROR", "Local video stream not found: $streamId")
            return
        }
        getCallById(id)?.let {
            it.startSendingVideo(stream, promise.asCallCallback())
            return
        }
        getConferenceById(id)?.let {
            it.addVideoStream(stream, promise.asCallCallback())
            return
        }
        promise.reject("INTERNAL_ERROR", "Call or conference not found")
    }

    fun stopSendingVideo(id: String, promise: Promise) {
        getCallById(id)?.let {
            it.stopSendingVideo(promise.asCallCallback())
            return
        }
        getConferenceById(id)?.let {
            val stream = it.localVideoStreams?.firstOrNull() ?: run {
                promise.resolve(null)
                return
            }
            it.removeVideoStream(stream, promise.asCallCallback())
        } ?: run {
            promise.reject("INTERNAL_ERROR", "Call or conference not found")
            return
        }
    }

    private fun getCallById(id: String): Call? = VICalls.calls[id]

    private fun getConferenceById(id: String): Conference? = VICalls.conferences[id]

    private fun getEndpointById(id: String): Endpoint? =
        VICalls.conferences.values
            .asSequence()
            .flatMap { it.endpoints.asSequence() }
            .firstOrNull { it.id == id }

    private fun callIdPayload(id: String): WritableMap =
        Arguments.createMap().apply { putString("callId", id) }

    private fun conferenceIdPayload(id: String): WritableMap =
        Arguments.createMap().apply { putString("conferenceId", id) }

    private fun ReadableMap?.toCallSettings(): CallSettings {
        val settings = CallSettings()
        if (this == null) return settings

        if (hasKey("customData") && !isNull("customData")) {
            settings.customData = getString("customData")
        }
        if (hasKey("extraHeaders") && !isNull("extraHeaders")) {
            getMap("extraHeaders")?.asMapOf<String>()?.let { settings.extraHeaders = it }
        }
        if (hasKey("receiveVideo") && !isNull("receiveVideo")) {
            settings.receiveVideo = getBoolean("receiveVideo")
        }
        if (hasKey("statsCollectionInterval") && !isNull("statsCollectionInterval")) {
            settings.statsCollectionInterval = getInt("statsCollectionInterval")
        }
        if (hasKey("preferredVideoCodec") && !isNull("preferredVideoCodec")) {
            settings.preferredVideoCodec = when (getString("preferredVideoCodec")) {
                "H264" -> VideoCodec.H264
                "VP8" -> VideoCodec.VP8
                else -> VideoCodec.Auto
            }
        }
        readLocalVideoStreamId()?.let { streamId ->
            settings.localVideoStream = VideoModuleImpl.getVideoStreamById(streamId) as? LocalVideoStream
        }
        return settings
    }

    private fun ReadableMap?.toConferenceSettings(): ConferenceSettings {
        val settings = ConferenceSettings()
        if (this == null) return settings

        if (hasKey("customData") && !isNull("customData")) {
            settings.customData = getString("customData")
        }
        if (hasKey("extraHeaders") && !isNull("extraHeaders")) {
            getMap("extraHeaders")?.asMapOf<String>()?.let { settings.extraHeaders = it }
        }
        if (hasKey("muteAudio") && !isNull("muteAudio")) {
            settings.muteAudio = getBoolean("muteAudio")
        }
        if (hasKey("statsCollectionInterval") && !isNull("statsCollectionInterval")) {
            settings.statsCollectionInterval = getInt("statsCollectionInterval")
        }
        if (hasKey("preferredVideoCodec") && !isNull("preferredVideoCodec")) {
            settings.preferredVideoCodec = when (getString("preferredVideoCodec")) {
                "H264" -> VideoCodec.H264
                "VP8" -> VideoCodec.VP8
                else -> VideoCodec.Auto
            }
        }
        readLocalVideoStreamId()?.let { streamId ->
            settings.localVideoStream = VideoModuleImpl.getVideoStreamById(streamId) as? LocalVideoStream
        }
        return settings
    }

    private fun ReadableMap.readLocalVideoStreamId(): String? {
        if (!hasKey("localVideoStream") || isNull("localVideoStream")) return null
        return when (getType("localVideoStream")) {
            ReadableType.String -> getString("localVideoStream")
            ReadableType.Map -> getMap("localVideoStream")?.getString("id")
            else -> null
        }
    }

    private fun Promise.asCallCallback(): CallCallback = object : CallCallback {
        override fun onSuccess() = resolve(null)
        override fun onFailure(exception: SdkCallException) = reject(
            exception.error.asErrorCode(),
            exception.description,
        )
    }

    companion object {
        @Volatile
        private var isVICallsInitialized: Boolean = false

        @Synchronized
        fun ensureInitialized(reactContext: ReactApplicationContext): Boolean {
            if (!VICore.isInitialized) {
                VICore.initialize(reactContext)
            }
            if (!isVICallsInitialized) {
                VICalls.initialize()
                isVICallsInitialized = true
            }
            return isVICallsInitialized
        }

        fun isInitialized(): Boolean = isVICallsInitialized
    }
}

private fun CallState.asReactNative(): String = when (this) {
    CallState.Created -> "CREATED"
    CallState.Connecting -> "CONNECTING"
    CallState.Connected -> "CONNECTED"
    CallState.Reconnecting -> "RECONNECTING"
    CallState.Disconnecting -> "DISCONNECTING"
    CallState.Disconnected -> "DISCONNECTED"
    CallState.Failed -> "FAILED"
}

private fun CallDirection.asReactNative(): String = when (this) {
    CallDirection.Outgoing -> "OUTGOING"
    CallDirection.Incoming -> "INCOMING"
}

private fun CallDisconnectReason.asReactNative(): String = when (this) {
    CallDisconnectReason.LocalEnded -> "LOCAL_ENDED"
    CallDisconnectReason.RemoteEnded -> "REMOTE_ENDED"
    CallDisconnectReason.AnsweredElsewhere -> "ANSWERED_ELSEWHERE"
    CallDisconnectReason.ConnectionLost -> "CONNECTION_LOST"
}

private fun ConferenceDisconnectReason.asReactNative(): String = when (this) {
    ConferenceDisconnectReason.LocalEnded -> "LOCAL_ENDED"
    ConferenceDisconnectReason.RemoteEnded -> "REMOTE_ENDED"
    ConferenceDisconnectReason.ConnectionLost -> "CONNECTION_LOST"
}

private fun VideoStreamReceiveStopReason.asReactNative(): String = when (this) {
    VideoStreamReceiveStopReason.Manual -> "MANUAL"
    VideoStreamReceiveStopReason.Automatic -> "AUTOMATIC"
}

internal fun CallError.asErrorCode(): String = when (this) {
    CallError.AlreadyInThisState -> "ALREADY_IN_THIS_STATE"
    CallError.CameraNotFound -> "CAMERA_NOT_FOUND"
    CallError.IncorrectOperation -> "INCORRECT_OPERATION"
    CallError.InternalError -> "INTERNAL_ERROR"
    CallError.InvalidCallState -> "INVALID_CALL_STATE"
    CallError.MediaIsOnHold -> "MEDIA_IS_ON_HOLD"
    CallError.MissingPermission -> "PERMISSION_REQUIRED"
    CallError.Rejected -> "REJECTED"
    CallError.RejectedByUser -> "REJECTED"
    CallError.Timeout -> "TIMEOUT"
}
