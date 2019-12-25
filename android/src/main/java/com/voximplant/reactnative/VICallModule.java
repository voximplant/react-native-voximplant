/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
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
import com.voximplant.sdk.call.IVideoStream;
import com.voximplant.sdk.call.RejectMode;
import com.voximplant.sdk.call.VideoFlags;

import java.util.Map;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.*;

public class VICallModule extends ReactContextBaseJavaModule implements ICallListener, IEndpointListener {
    private ReactApplicationContext mReactContext;

    public VICallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VICallModule";
    }

    @ReactMethod
    public void internalSetup(String callId) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.addCallListener(this);
        }
    }

    @ReactMethod
    public void answer(String callId, ReadableMap videoSettings, String videoCodec, String customData, ReadableMap headers) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            CallSettings callSettings = new CallSettings();
            callSettings.videoFlags = new VideoFlags(videoSettings.getBoolean("receiveVideo"), videoSettings.getBoolean("sendVideo"));
            callSettings.customData = customData;
            callSettings.extraHeaders = Utils.createHashMap(headers);
            callSettings.preferredVideoCodec = Utils.convertStringToVideoCodec(videoCodec);
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
    public void onLocalVideoStreamAdded(ICall call, IVideoStream videoStream) {
        CallManager.getInstance().addVideoStream(call.getCallId(), videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CALL_LOCAL_VIDEO_STREAM_ADDED);
        params.putString(EVENT_PARAM_CALLID, call.getCallId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_TYPE, Utils.convertVideoStreamType(videoStream.getVideoStreamType()));
        sendEvent(EVENT_CALL_LOCAL_VIDEO_STREAM_ADDED, params);
    }

    @Override
    public void onLocalVideoStreamRemoved(ICall call, IVideoStream videoStream) {
        CallManager.getInstance().removeVideoStream(videoStream);
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
    public void onRemoteVideoStreamAdded(IEndpoint endpoint, IVideoStream videoStream) {
        CallManager.getInstance().addVideoStream(CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()), videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_REMOTE_STREAM_ADDED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_TYPE, Utils.convertVideoStreamType(videoStream.getVideoStreamType()));
        sendEvent(EVENT_ENDPOINT_REMOTE_STREAM_ADDED, params);
    }

    @Override
    public void onRemoteVideoStreamRemoved(IEndpoint endpoint, IVideoStream videoStream) {
        CallManager.getInstance().removeVideoStream(videoStream);
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_ENDPOINT_REMOTE_STREAM_REMOVED);
        params.putString(EVENT_PARAM_CALLID, CallManager.getInstance().getCallIdByEndpointId(endpoint.getEndpointId()));
        params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
        params.putString(EVENT_PARAM_VIDEO_STREAM_ID, videoStream.getVideoStreamId());
        sendEvent(EVENT_ENDPOINT_REMOTE_STREAM_REMOVED, params);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
