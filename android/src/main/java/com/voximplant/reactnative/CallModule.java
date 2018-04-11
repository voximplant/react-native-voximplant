/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.ICallListener;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.IVideoStream;

import java.util.Map;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.EVENT_CALL_CONNECTED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_DISCONNECTED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_FAILED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_ICECOMPLETED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_ICETIMEOUT;
import static com.voximplant.reactnative.Constants.EVENT_CALL_INFO_RECEIVED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_MESSAGE_RECEIVED;
import static com.voximplant.reactnative.Constants.EVENT_CALL_PROGRESS_TONE_START;
import static com.voximplant.reactnative.Constants.EVENT_CALL_PROGRESS_TONE_STOP;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_CONNECTED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_DISCONNECTED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_FAILED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_ICECOMPLETED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_ICETIMEOUT;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_INFO_RECEIVED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_MESSAGE_RECEIVED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_PROGRESS_TONE_START;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CALL_PROGRESS_TONE_STOP;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ANSWERED_ELSEWHERE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_BODY;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_CALLID;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_CODE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_HEADERS;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_MIMETYPE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_NAME;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_REASON;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_TEXT;

public class CallModule extends ReactContextBaseJavaModule implements ICallListener {
    private ReactApplicationContext mReactContext;

    public CallModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CallModule";
    }

    @ReactMethod
    public void internalSetup(String callId) {
        ICall call = CallManager.getInstance().getCallById(callId);
        if (call != null) {
            call.addCallListener(this);
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

    }

    @Override
    public void onLocalVideoStreamRemoved(ICall call, IVideoStream videoStream) {

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
    public void onEndpointAdded(ICall call, IEndpoint endpoint) {

    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}