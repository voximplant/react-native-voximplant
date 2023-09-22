/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.call.CallError;
import com.voximplant.sdk.call.CallException;
import com.voximplant.sdk.call.CallSettings;
import com.voximplant.sdk.call.CallStats;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.ICallCompletionHandler;
import com.voximplant.sdk.call.ICallListener;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.IEndpointListener;
import com.voximplant.sdk.call.ILocalVideoStream;
import com.voximplant.sdk.call.IQualityIssueListener;
import com.voximplant.sdk.call.IRemoteAudioStream;
import com.voximplant.sdk.call.IRemoteVideoStream;
import com.voximplant.sdk.call.QualityIssue;
import com.voximplant.sdk.call.QualityIssueLevel;
import com.voximplant.sdk.call.RejectMode;
import com.voximplant.sdk.call.VideoFlags;
import com.voximplant.sdk.call.VideoStreamReceiveStopReason;

import java.text.DecimalFormat;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import static com.voximplant.reactnative.Constants.*;

public class VICallModule extends ReactContextBaseJavaModule implements ICallListener, IEndpointListener, IQualityIssueListener {
    private ReactApplicationContext mReactContext;

    public VICallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @Override
    public String getName() {
        return "RNVICallModule";
    }

    @ReactMethod
    public void internalSetup(String callId) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.addCallListener(this);
            call.setQualityIssueListener(this);
        }
    }

    @ReactMethod
    public void answer(String callId, ReadableMap settings) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            CallSettings callSettings = Utils.convertCallSettingsFromMap(settings);
            try {
                call.answer(callSettings);
            } catch (CallException e) {

            }
        }
    }

    @ReactMethod
    public void decline(String callId, ReadableMap headers) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            try {
                call.reject(RejectMode.DECLINE, Utils.createHashMap(headers));
            } catch (CallException e) {

            }
        }
    }

    @ReactMethod
    public void reject(String callId, ReadableMap headers) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            try {
                call.reject(RejectMode.BUSY, Utils.createHashMap(headers));
            } catch (CallException e) {

            }
        }
    }

    @ReactMethod
    public void sendAudio(String callId, boolean enable) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.sendAudio(enable);
        }
    }

    @ReactMethod
    public void sendDTMF(String callId, String tone) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.sendDTMF(tone);
        }
    }

    @ReactMethod
    public void sendVideo(String callId, boolean enable, final Promise promise) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.sendVideo(enable, new ICallCompletionHandler() {
                @Override
                public void onComplete() {
                    promise.resolve(null);
                }

                @Override
                public void onFailure(CallException exception) {
                    promise.reject(exception.getErrorCode().toString(), exception.getMessage());
                }
            });
        }
    }

    @ReactMethod
    public void hold(String callId, boolean enable, final Promise promise) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.hold(enable, new ICallCompletionHandler() {
                @Override
                public void onComplete() {
                    promise.resolve(null);
                }

                @Override
                public void onFailure(CallException exception) {
                    promise.reject(exception.getErrorCode().toString(), exception.getMessage());
                }
            });
        }
    }

    @ReactMethod
    public void receiveVideo(String callId, final Promise promise) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.receiveVideo(new ICallCompletionHandler() {
                @Override
                public void onComplete() {
                    promise.resolve(null);
                }

                @Override
                public void onFailure(CallException exception) {
                    promise.reject(exception.getErrorCode().toString(), exception.getMessage());
                }
            });
        }
    }

    @ReactMethod
    public void sendMessage(String callId, String message) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.sendMessage(message);
        }
    }

    @ReactMethod
    public void sendInfo(String callId, String mimeType, String body, ReadableMap headers) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.sendInfo(mimeType, body, Utils.createHashMap(headers));
        }
    }

    @ReactMethod
    public void hangup(String callId, ReadableMap headers) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.hangup(Utils.createHashMap(headers));
        }
    }

    @ReactMethod
    public void startReceiving(String streamId) {
        IRemoteVideoStream remoteVideoStream = CallManager.getInstance().getRemoteVideoStreamById(streamId);
        if (remoteVideoStream != null) {
            remoteVideoStream.startReceiving();
        }
    }

    @ReactMethod
    public void stopReceiving(String streamId) {
        IRemoteVideoStream remoteVideoStream = CallManager.getInstance().getRemoteVideoStreamById(streamId);
        if (remoteVideoStream != null) {
            remoteVideoStream.stopReceiving();
        }
    }

    @ReactMethod
    public void requestVideoSize(String streamId, int width, int height) {
        IRemoteVideoStream remoteVideoStream = CallManager.getInstance().getRemoteVideoStreamById(streamId);
        if (remoteVideoStream != null) {
            remoteVideoStream.requestVideoSize(width, height);
            WritableMap params = Arguments.createMap();
            params.putString(EVENT_PARAM_NAME, EVENT_ENDPOINT_REQUEST_VIDEO_SIZE_FOR_VIDEO_STREAM_SUCCESS);
            sendEvent(EVENT_ENDPOINT_REQUEST_VIDEO_SIZE_FOR_VIDEO_STREAM_SUCCESS, params);
        } else {
            WritableMap params = Arguments.createMap();
            params.putString(EVENT_PARAM_NAME, EVENT_ENDPOINT_REQUEST_VIDEO_SIZE_FOR_VIDEO_STREAM_FAILURE);
            params.putString(EVENT_PARAM_CODE, CallError.INTERNAL_ERROR.toString());
            params.putString(EVENT_PARAM_REASON, "Failed to find remote video stream by provided video stream id");
            sendEvent(EVENT_ENDPOINT_REQUEST_VIDEO_SIZE_FOR_VIDEO_STREAM_FAILURE, params);
        }
    }

    @ReactMethod
    public void getCallDuration(String callId, final Promise promise) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            long duration = call.getCallDuration();
            DecimalFormat df = new DecimalFormat("0");
            promise.resolve(Integer.parseInt(df.format(duration / 1000)));
        } else {
            promise.reject(CallError.INTERNAL_ERROR.toString(), "Call.getDuration(): call is no more unavailable, already ended or failed");
        }
    }

    @ReactMethod
    public void currentQualityIssues(String callId, final Promise promise) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            Map<QualityIssue, QualityIssueLevel> issues = call.getCurrentQualityIssues();
            promise.resolve(Utils.convertQualityIssuesMapToWritableMap(issues));
        } else {
            promise.reject(CallError.INTERNAL_ERROR.toString(), "Call.currentQualityIssues(): call is no more unavailable, already ended or failed");
        }
    }

    @Override
    public void onCallConnected(ICall call, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_CONNECTED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
        sendEvent(EVENT_CALL_CONNECTED, params);
    }

    @Override
    public void onCallDisconnected(ICall call, Map<String, String> headers, boolean answeredElsewhere) {
        call.removeCallListener(this);
        call.setQualityIssueListener(null);
        CallManager.getInstance().removeCall(call);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_DISCONNECTED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putBoolean(EVENT_PARAM_ANSWERED_ELSEWHERE, answeredElsewhere);
        params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
        sendEvent(EVENT_CALL_DISCONNECTED, params);
    }

    @Override
    public void onCallRinging(ICall call, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_PROGRESS_TONE_START);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
        sendEvent(EVENT_CALL_PROGRESS_TONE_START, params);
    }

    @Override
    public void onCallFailed(ICall call, int code, String description, Map<String, String> headers) {
        call.removeCallListener(this);
        call.setQualityIssueListener(null);
        CallManager.getInstance().removeCall(call);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_FAILED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putInt(EVENT_PARAM_CODE, code);
        params.putString(EVENT_PARAM_REASON, description);
        params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
        sendEvent(EVENT_CALL_FAILED, params);
    }

    @Override
    public void onCallAudioStarted(ICall call) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_PROGRESS_TONE_STOP);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        sendEvent(EVENT_CALL_PROGRESS_TONE_STOP, params);
    }

    @Override
    public void onSIPInfoReceived(ICall call, String type, String content, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_INFO_RECEIVED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_MIMETYPE, type);
        params.putString(EVENT_PARAM_BODY, content);
        params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
        sendEvent(EVENT_CALL_INFO_RECEIVED, params);
    }

    @Override
    public void onMessageReceived(ICall call, String text) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_MESSAGE_RECEIVED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_TEXT, text);
        sendEvent(EVENT_CALL_MESSAGE_RECEIVED, params);
    }

    @Override
    public void onLocalVideoStreamAdded(ICall call, ILocalVideoStream videoStream) {
        CallManager.getInstance().addLocalVideoStream(call.getCallId(), videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_LOCAL_VIDEO_STREAM_ADDED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_TYPE, Utils.convertVideoStreamType(videoStream.getVideoStreamType()));
        sendEvent(EVENT_CALL_LOCAL_VIDEO_STREAM_ADDED, params);
    }

    @Override
    public void onLocalVideoStreamRemoved(ICall call, ILocalVideoStream videoStream) {
        CallManager.getInstance().removeLocalVideoStream(videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_LOCAL_VIDEO_STREAM_REMOVED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        sendEvent(EVENT_CALL_LOCAL_VIDEO_STREAM_REMOVED, params);
    }

    @Override
    public void onICETimeout(ICall call) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_ICETIMEOUT);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        sendEvent(EVENT_CALL_ICETIMEOUT, params);
    }

    @Override
    public void onICECompleted(ICall call) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_ICECOMPLETED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        sendEvent(EVENT_CALL_ICECOMPLETED, params);
    }


    @Override
    public void onCallStatsReceived(ICall call, CallStats callStats) {

    }

    @Override
    public void onCallReconnecting(ICall call) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_RECONNECTING);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        sendEvent(EVENT_CALL_RECONNECTING, params);
    }

    @Override
    public void onCallReconnected(ICall call) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_RECONNECTED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        sendEvent(EVENT_CALL_RECONNECTED, params);
    }

    @Override
    public void onEndpointAdded(ICall call, IEndpoint endpoint) {
        endpoint.setEndpointListener(this);
        CallManager.getInstance().addEndpoint(endpoint, call.getCallId());
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_ENDPOINT_ADDED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_ENDPOINT_NAME, endpoint.getUserName());
        params.putString(EVENT_PARAM_DISPLAY_NAME, endpoint.getUserDisplayName());
        params.putString(EVENT_PARAM_ENDPOINT_SIP_URI, endpoint.getSipUri());
        sendEvent(EVENT_CALL_ENDPOINT_ADDED, params);
    }

    @Override
    public void onEndpointInfoUpdated(IEndpoint endpoint) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_INFO_UPDATED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_ENDPOINT_NAME, endpoint.getUserName());
        params.putString(EVENT_PARAM_DISPLAY_NAME, endpoint.getUserDisplayName());
        params.putString(EVENT_PARAM_ENDPOINT_SIP_URI, endpoint.getSipUri());
        sendEvent(EVENT_ENDPOINT_INFO_UPDATED, params);
    }

    @Override
    public void onEndpointRemoved(IEndpoint endpoint) {
        endpoint.setEndpointListener(null);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_REMOVED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        sendEvent(EVENT_ENDPOINT_REMOVED, params);
        CallManager.getInstance().removeEndpoint(endpoint);
    }

    @Override
    public void onRemoteVideoStreamAdded(IEndpoint endpoint, IRemoteVideoStream videoStream) {
        CallManager.getInstance().addRemoteVideoStream(CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()), videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_REMOTE_STREAM_ADDED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_TYPE, Utils.convertVideoStreamType(videoStream.getVideoStreamType()));
        sendEvent(EVENT_ENDPOINT_REMOTE_STREAM_ADDED, params);
    }

    @Override
    public void onRemoteVideoStreamRemoved(IEndpoint endpoint, IRemoteVideoStream videoStream) {
        CallManager.getInstance().removeRemoteVideoStream(videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_REMOTE_STREAM_REMOVED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        sendEvent(EVENT_ENDPOINT_REMOTE_STREAM_REMOVED, params);
    }

    @Override
    public void onVoiceActivityStarted(IEndpoint endpoint) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_VOICE_ACTIVITY_STARTED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        sendEvent(EVENT_ENDPOINT_VOICE_ACTIVITY_STARTED, params);
    }

    @Override
    public void onVoiceActivityStopped(IEndpoint endpoint) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_VOICE_ACTIVITY_STOPPED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        sendEvent(EVENT_ENDPOINT_VOICE_ACTIVITY_STOPPED, params);
    }

    @Override
    public void onStartReceivingVideoStream(@NonNull IEndpoint endpoint, @NonNull IRemoteVideoStream videoStream) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_START_RECEIVING_VIDEO_STREAM);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        sendEvent(EVENT_ENDPOINT_START_RECEIVING_VIDEO_STREAM, params);
    }

    @Override
    public void onStopReceivingVideoStream(@NonNull IEndpoint endpoint, @NonNull IRemoteVideoStream videoStream, @NonNull VideoStreamReceiveStopReason reason) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_STOP_RECEIVING_VIDEO_STREAM);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_REASON, Utils.convertVideoReceiveStopReason(reason));
        sendEvent(EVENT_ENDPOINT_STOP_RECEIVING_VIDEO_STREAM, params);
    }

    @Override
    public void onPacketLoss(@NonNull ICall call, @NonNull QualityIssueLevel level, double packetLoss) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_PACKET_LOSS);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putDouble(EVENT_PARAM_PACKET_LOSS, packetLoss);
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_PACKET_LOSS, params);
    }

    @Override
    public void onCodecMismatch(@NonNull ICall call, @NonNull QualityIssueLevel level, @Nullable String sendCodec) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_CODEC_MISMATCH);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        if (sendCodec != null) {
            params.putString(EVENT_PARAM_CODEC, sendCodec);
        } else {
            params.putNull(EVENT_PARAM_CODEC);
        }
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_CODEC_MISMATCH, params);
    }

    @Override
    public void onLocalVideoDegradation(@NonNull ICall call, @NonNull QualityIssueLevel level, int targetWidth, int targetHeight, int actualWidth, int actualHeight) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_LOCAL_VIDEO_DEGRADATION);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());

        WritableMap actual = Arguments.createMap();
        actual.putInt("width", actualWidth);
        actual.putInt("height", actualHeight);

        WritableMap target = Arguments.createMap();
        actual.putInt("width", targetWidth);
        actual.putInt("height", targetHeight);

        params.putMap(EVENT_PARAM_ACTUAL_SIZE, actual);
        params.putMap(EVENT_PARAM_TARGET_SIZE, target);
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_LOCAL_VIDEO_DEGRADATION, params);
    }

    @Override
    public void onIceDisconnected(@NonNull ICall call, @NonNull QualityIssueLevel level) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_ICE_DISCONNECTED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_ICE_DISCONNECTED, params);
    }

    @Override
    public void onHighMediaLatency(@NonNull ICall call, @NonNull QualityIssueLevel level, double latency) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_HIGH_MEDIA_LATENCY);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putDouble(EVENT_PARAM_LATENCY, latency);
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_HIGH_MEDIA_LATENCY, params);
    }

    @Override
    public void onNoAudioSignal(@NonNull ICall call, @NonNull QualityIssueLevel level) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_NO_AUDIO_SIGNAL);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_NO_AUDIO_SIGNAL, params);
    }

    @Override
    public void onNoAudioReceive(@NonNull ICall call, @NonNull QualityIssueLevel level, @NonNull IRemoteAudioStream audioStream, @NonNull IEndpoint endpoint) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_NO_AUDIO_RECEIVE);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_AUDIO_STREAM_ID, audioStream.getAudioStreamId());
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_NO_AUDIO_RECEIVE, params);
    }

    @Override
    public void onNoVideoReceive(@NonNull ICall call, @NonNull QualityIssueLevel level, @NonNull IRemoteVideoStream videoStream, @NonNull IEndpoint endpoint) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_QUALITY_ISSUE_NO_VIDEO_RECEIVE);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_ISSUE_LEVEL, Utils.convertQualityIssueLevelToString(level));
        sendEvent(EVENT_CALL_QUALITY_ISSUE_NO_VIDEO_RECEIVE, params);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
