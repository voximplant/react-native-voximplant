/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import javax.annotation.Nullable;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.hardware.Camera;
import android.util.Log;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.zingaya.voximplant.VoxImplantCallback;
import com.zingaya.voximplant.VoxImplantClient;
import com.zingaya.voximplant.VoxImplantClient.LoginFailureReason;

public class VoxImplantModule extends ReactContextBaseJavaModule implements VoxImplantCallback {
	public VoxImplantModule(ReactApplicationContext reactContext) {
		super(reactContext);
		this.reactContext = reactContext;
	}

	@Override
	public String getName() {
		return "VoxImplantModule";
	}

	// JS API

	@ReactMethod
	public void init(boolean enableVideo, boolean enableHWAcceleration, boolean provideLocalFramesInByteBuffers,
			boolean enableDebugLogging, String packageName) {
		this.client = VoxImplantClient.instance();
		VoxImplantClient.VoxImplantClientConfig clientConfig = new VoxImplantClient.VoxImplantClientConfig();
		clientConfig.enableVideo = enableVideo;
		clientConfig.enableHWAcceleration = enableHWAcceleration;
		clientConfig.provideLocalFramesInByteBuffers = provideLocalFramesInByteBuffers;
		clientConfig.enableDebugLogging = enableDebugLogging;
		clientConfig.packageName = packageName;
		this.client.setAndroidContext(reactContext, clientConfig);
		this.client.setCallback(this);
	}

	@ReactMethod
	public void connect(boolean connectivityCheck, ReadableArray servers) {
		List<String> serversList;
		try {
			serversList = Utils.createStringArrayList(servers);
		} catch (IllegalArgumentException e) {
			serversList = null;
		}
		try {
			this.client.connect(connectivityCheck, serversList);
		} catch (IllegalStateException e) {
			Log.e("VoxImplantModule", "Failed to connect: " + e.getMessage());
		}
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
	public void loginUsingAccessToken(String username, String accessToken) {
		this.client.loginUsingAccessToken(username, accessToken);
	}

	@ReactMethod
	public void requestOneTimeKey(String username) {
		this.client.requestOneTimeKey(username);
	}

	@ReactMethod
	public void refreshToken(String username, String refreshToken) {
		this.client.refreshToken(username, refreshToken);
	}

	@ReactMethod
	public void closeConnection() {
		this.client.closeConnection();
	}

	@ReactMethod
	public void startCall(String callId, ReadableMap headers) {
		if (null == headers) {
			this.client.startCall(callId);
		} else {
			this.client.startCall(callId, Utils.createHashMap(headers));
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
		} else {
			this.client.disconnectCall(callId, Utils.createHashMap(headers));
		}
	}

	@ReactMethod
	public void declineCall(String callId, ReadableMap headers) {
		if (null == headers) {
			this.client.declineCall(callId);
		} else {
			this.client.declineCall(callId, Utils.createHashMap(headers));
		}
	}

	@ReactMethod
	public void answerCall(String callId, String customData, ReadableMap headers) {
		this.client.answerCall(callId, customData, Utils.createHashMap(headers));
	}

	@ReactMethod
	public void sendMessage(String callId, String text) {
		this.client.sendMessage(callId, text);
	}

	@ReactMethod
	public void sendInfo(String callId, String mimeType, String content, ReadableMap headers) {
		if (null == headers) {
			Map<String, String> map = new HashMap<>();
			this.client.sendInfo(callId, mimeType, content, map);
		} else {
			this.client.sendInfo(callId, mimeType, content, Utils.createHashMap(headers));
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
		switch (cameraName) {
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

	@ReactMethod
	public void registerForPushNotifications(String pushRegistrationToken) {
		this.client.registerForPushNotifications(pushRegistrationToken);
	}

	@ReactMethod
	public void unregisterFromPushNotifications(String pushRegistrationToken) {
		this.client.unregisterFromPushNotifications(pushRegistrationToken);
	}

	@ReactMethod
	public void handlePushNotification(ReadableMap notification) {
		this.client.handlePushNotification(Utils.createHashMap(notification));
	}

	// VoxImplantCallback implementation

	@Override
	public void onLoginSuccessful(String displayName, LoginTokens loginTokens) {
		WritableMap tokens = Arguments.createMap();
		tokens.putString("accessToken", loginTokens.getAccessToken());
		tokens.putInt("accessExpire", loginTokens.getAccessTokenTimeExpired());
		tokens.putString("refreshToken", loginTokens.getRefreshToken());
		tokens.putInt("refreshExpire", loginTokens.getRefreshTokenTimeExpired());
		WritableMap params = Arguments.createMap();
		params.putString("displayName", displayName);
		params.putMap("loginTokens", tokens);
		sendEvent(this.reactContext, "LoginSuccessful", params);
	}

	@Override
	public void onLoginFailed(LoginFailureReason reason) {
		WritableMap params = Arguments.createMap();
		int errorCode;
		switch (reason) {
		case INVALID_PASSWORD:
			errorCode = 401;
			break;
		case ACCOUNT_FROZEN:
			errorCode = 403;
			break;
		case INVALID_USERNAME:
			errorCode = 404;
			break;
		case TOKEN_EXPIRED:
			errorCode = 701;
			break;
		case INTERNAL_ERROR:
		default:
			errorCode = 500;
			break;
		}
		params.putInt("errorCode", errorCode);
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
		params.putMap("headers", Utils.createWritableMap(headers));
		sendEvent(this.reactContext, "CallConnected", params);
	}

	@Override
	public void onCallDisconnected(String callId, Map<String, String> headers, boolean answeredElsewhere) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putMap("headers", Utils.createWritableMap(headers));
		params.putBoolean("answeredElsewhere", answeredElsewhere);
		sendEvent(this.reactContext, "CallDisconnected", params);
	}

	@Override
	public void onCallRinging(String callId, Map<String, String> headers) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putMap("headers", Utils.createWritableMap(headers));
		sendEvent(this.reactContext, "CallRinging", params);
	}

	@Override
	public void onCallFailed(String callId, int code, String reason, Map<String, String> headers) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putInt("code", code);
		params.putString("reason", reason);
		params.putMap("headers", Utils.createWritableMap(headers));
		sendEvent(this.reactContext, "CallFailed", params);
	}

	@Override
	public void onCallAudioStarted(String callId) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		sendEvent(this.reactContext, "CallAudioStarted", params);
	}

	@Override
	public void onIncomingCall(final String callId, String from, String displayName, final boolean videoCall,
			Map<String, String> headers) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putString("from", from);
		params.putString("displayName", displayName);
		params.putBoolean("videoCall", videoCall);
		params.putMap("headers", Utils.createWritableMap(headers));
		sendEvent(this.reactContext, "IncomingCall", params);
	}

	@Override
	public void onSIPInfoReceivedInCall(String callId, String type, String content, Map<String, String> headers) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putString("type", type);
		params.putString("content", content);
		params.putMap("headers", Utils.createWritableMap(headers));
		sendEvent(this.reactContext, "SIPInfoReceivedInCall", params);
	}

	@Override
	public void onMessageReceivedInCall(String callId, String text) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putString("text", text);
		sendEvent(this.reactContext, "MessageReceivedInCall", params);
	}

	@Override
	public void onNetStatsReceived(String callId, NetworkInfo stats) {
		WritableMap params = Arguments.createMap();
		params.putString("callId", callId);
		params.putInt("packetLoss", stats.packetLoss);
		sendEvent(this.reactContext, "NetStatsReceived", params);
	}

	@Override
	public void onRefreshTokenSuccess(LoginTokens loginTokens) {
		WritableMap tokens = Arguments.createMap();
		tokens.putString("accessToken", loginTokens.getAccessToken());
		tokens.putInt("accessExpire", loginTokens.getAccessTokenTimeExpired());
		tokens.putString("refreshToken", loginTokens.getRefreshToken());
		tokens.putInt("refreshExpire", loginTokens.getRefreshTokenTimeExpired());
		WritableMap params = Arguments.createMap();
		params.putMap("loginTokens", tokens);
		sendEvent(this.reactContext, "RefreshTokenSuccess", params);
	}

	@Override
	public void onRefreshTokenFailed(Integer reason) {
		WritableMap params = Arguments.createMap();
		params.putInt("reason", reason);
		sendEvent(this.reactContext, "RefreshTokenFailed", params);
	}

	private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}

	private VoxImplantClient client;
	private ReactApplicationContext reactContext;
}
