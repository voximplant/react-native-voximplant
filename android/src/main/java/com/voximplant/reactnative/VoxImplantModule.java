package com.voximplant.reactnative;

import javax.annotation.Nullable;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import android.hardware.Camera;
import android.hardware.Camera.CameraInfo;
import android.util.Log;
import android.opengl.GLSurfaceView;
import java.util.Map;
import java.util.HashMap;


import com.zingaya.voximplant.VoxImplantCallback;
import com.zingaya.voximplant.VoxImplantClient;
import com.zingaya.voximplant.VoxImplantClient.LoginFailureReason;

public class VoxImplantModule extends ReactContextBaseJavaModule implements VoxImplantCallback
{
    public VoxImplantModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;
        this.client = VoxImplantClient.instance();
        this.client.setAndroidContext(reactContext, true, true);
        this.client.setCallback(this);
    }

    @Override public String getName() {
        return "VoxImplantModule";
    }

    // JS API

    @ReactMethod
    public void connect() {
        this.client.connect();
    }

    @ReactMethod
    public void createCall(String to, boolean video, String customData, Callback callback) {
        String callId = this.client.createCall(to, video, customData);
        callback.invoke(callId);
    }

    @ReactMethod
    public void login(String username, String password) {
        this.client.login(username, password);
    }

    @ReactMethod
    public void loginUsingOneTimeKey(String username, String hash) {
        this.client.loginUsingOneTimeKey(username, hash);
    }

    @ReactMethod
    public void requestOneTimeKey(String username) {
        this.client.requestOneTimeKey(username);
    }

    @ReactMethod
    public void closeConnection() {
        this.client.closeConnection();
    }

    @ReactMethod
    public void startCall(String callId, ReadableMap headers) {
        if (null == headers) {
            this.client.startCall(callId);
        }
        else {
            this.client.startCall(callId, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void sendDTMF(String callId, int digit) {
        this.client.sendDTMF(callId, digit);
    }

    @ReactMethod
    public void disconnectCall(String callId, ReadableMap headers) {
        if (null == headers) {
            this.client.disconnectCall(callId);
        }
        else {
            this.client.disconnectCall(callId, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void declineCall(String callId, ReadableMap headers) {
        if (null == headers) {
            this.client.declineCall(callId);
        }
        else {
            this.client.declineCall(callId, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void answerCall(String callId, ReadableMap headers) {
        if (null == headers) {
            this.client.answerCall(callId);
        }
        else {
            this.client.answerCall(callId, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void sendMessage(String callId, String text, ReadableMap headers) {
        if (null == headers) {
            Map<String, String> map = new HashMap<String, String>();
            this.client.sendMessage(callId, text, map);
        }
        else {
            this.client.sendMessage(callId, text, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void sendInfo(String callId, String mimeType, String content, ReadableMap headers) {
        if (null == headers) {
            Map<String, String> map = new HashMap<String, String>();
            this.client.sendInfo(callId, mimeType, content, map);
        }
        else {
            this.client.sendInfo(callId, mimeType, content, this.createHashMap(headers));
        }
    }

    @ReactMethod
    public void setMute(boolean b) {
        this.client.setMute(b);
    }

    @ReactMethod
    public void setUseLoudspeaker(boolean b) {
        this.client.setUseLoudspeaker(b);
    }

    //! Stub: not available in android sdk
    @ReactMethod
    public void setVideoResizeMode(String mode) {
    }

    @ReactMethod
    public void sendVideo(boolean doSend) {
        this.client.sendVideo(doSend);
    }

    @ReactMethod
    public void setCameraResolution(int width, int height) {
        this.client.setCameraResolution(width, height);
    }

    @ReactMethod
    public void switchToCamera(String cameraName) {
        switch(cameraName) {
            case "front":
                this.client.setCamera(Camera.CameraInfo.CAMERA_FACING_FRONT);
                break;
            case "back":
                this.client.setCamera(Camera.CameraInfo.CAMERA_FACING_BACK);
                break;
            default:
                //FIXME: RCTLogError for android?
                break;
        }
    }

    // VoxImplantCallback implementation

    @Override
    public void onLoginSuccessful(String displayName) {
        WritableMap params = Arguments.createMap();
        params.putString("displayName", displayName);
        sendEvent(this.reactContext, "LoginSuccessful", params);
    }

    @Override
    public void onLoginFailed(LoginFailureReason reason) {
        WritableMap params = Arguments.createMap();
        params.putInt("errorCode", reason.ordinal());
        sendEvent(this.reactContext, "LoginFailed", params);
    }

    @Override
    public void onOneTimeKeyGenerated(String key) {
        WritableMap params = Arguments.createMap();
        params.putString("key", key);
        sendEvent(this.reactContext, "OneTimeKeyGenerated", params);   
    }

    @Override
    public void onConnectionSuccessful() {
        WritableMap params = Arguments.createMap();
        sendEvent(this.reactContext, "ConnectionSuccessful", params);
    }

    @Override
    public void onConnectionClosed() {
        WritableMap params = Arguments.createMap();
        sendEvent(this.reactContext, "ConnectionClosed", params);
    }

    @Override
    public void onConnectionFailedWithError(String reason) {
        WritableMap params = Arguments.createMap();
        params.putString("reason", reason);
        sendEvent(this.reactContext, "ConnectionFailed", params);
    }

    @Override
    public void onCallConnected(String callId, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "CallConnected", params);
    }

    @Override
    public void onCallDisconnected(String callId, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "CallDisconnected", params);
    }

    @Override
    public void onCallRinging(String callId, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "CallRinging", params);
    }

    @Override
    public void onCallFailed(String callId, int code, String reason, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putInt("code", code);
        params.putString("reason", reason);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "CallFailed", params);
    }

    @Override
    public void onCallAudioStarted(String callId) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        sendEvent(this.reactContext, "CallAudioStarted", params);
    }

    @Override
    public void onIncomingCall(final String callId, String from, String displayName, final boolean videoCall, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putString("from", from);
        params.putString("displayName", displayName);
        params.putString("videoCall", videoCall ? "true" : "false");
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "IncomingCall", params);
    }

    @Override
    public void onSIPInfoReceivedInCall(String callId, String type, String content, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putString("type", type);
        params.putString("content", content);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "SIPInfoReceivedInCall", params);
    }

    @Override
    public void onMessageReceivedInCall(String callId, String text, Map<String, String> headers) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putString("text", text);
        params.putMap("headers", this.createReactMap(headers));
        sendEvent(this.reactContext, "MessageReceivedInCall", params);
    }

    @Override
    public void onNetStatsReceived(String callId, NetworkInfo stats) {
        WritableMap params = Arguments.createMap();
        params.putString("callId", callId);
        params.putInt("packetLoss", stats.packetLoss);
        sendEvent(this.reactContext, "NetStatsReceived", params);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
           .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
           .emit(eventName, params);
    }

    private WritableMap createReactMap(Map<String, String> v) {
        WritableMap map = Arguments.createMap();
        for (Map.Entry<String, String> entry : v.entrySet()) {
            map.putString(entry.getKey(), entry.getValue());
        }
        return map;
    }

    private Map<String, String> createHashMap(ReadableMap v) {
        Map<String, String> map = new HashMap<String, String>();
        ReadableMapKeySetIterator it = v.keySetIterator();
        while (it.hasNextKey()) {
          String key = it.nextKey();
          map.put(key, v.getString(key));
        }
        return map;
    }

    private VoxImplantClient client;
    private ReactApplicationContext reactContext;
}
