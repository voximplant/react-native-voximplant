/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.client.AuthParams;
import com.voximplant.sdk.client.ClientConfig;
import com.voximplant.sdk.client.IClient;
import com.voximplant.sdk.client.IClientIncomingCallListener;
import com.voximplant.sdk.client.IClientLoginListener;
import com.voximplant.sdk.client.IClientSessionListener;
import com.voximplant.sdk.client.LoginError;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.*;

public class ClientModule extends ReactContextBaseJavaModule
		implements IClientSessionListener, IClientLoginListener, IClientIncomingCallListener{
	private IClient mClient = null;
	private ReactApplicationContext mReactContext;

	public ClientModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
	}

	@Override
	public String getName() {
		return "ClientModule";
	}

	//region React methods
	@ReactMethod
	public void init(boolean enableVideo, boolean enableHWAcceleration, boolean provideLocalFramesInByteBuffers,
					 boolean enableDebugLogging) {
		ClientConfig config = new ClientConfig();
		config.enableVideo = enableVideo;
		config.enableHWAccelerationForDecoding = enableHWAcceleration;
		config.enableHWAccelerationForEncoding = enableHWAcceleration;
		config.provideLocalFramesInByteBuffers = provideLocalFramesInByteBuffers;
		config.enableDebugLogging = enableDebugLogging;
		mClient = Voximplant.getClientInstance(Executors.newSingleThreadExecutor(), mReactContext, config);
		mClient.setClientIncomingCallListener(this);
		mClient.setClientLoginListener(this);
		mClient.setClientSessionListener(this);
	}

	@ReactMethod
	public void disconnect() {
		if (mClient != null) {
			mClient.disconnect();
		}
	}

	@ReactMethod
	public void connect(boolean connectivityCheck, ReadableArray servers, Callback callback) {
		List<String> serversList;
		if (mClient == null) {
			return;
		}
		try {
			serversList = Utils.createArrayList(servers);
		} catch (IllegalArgumentException e) {
			serversList = null;
		}
		try {
			mClient.connect(connectivityCheck, serversList);
			callback.invoke(true);
		} catch (IllegalStateException e) {
			callback.invoke(false);
		}
	}

	@ReactMethod
	public void getClientState(Promise promise) {
		if (mClient != null) {
			promise.resolve(Utils.convertClientStateToString(mClient.getClientState()));
		}
	}

	@ReactMethod
	public void login(String user, String password) {
		if (mClient != null) {
			mClient.login(user, password);
		}
	}

	@ReactMethod
	public void loginWithToken(String user, String token) {
		if (mClient != null) {
			mClient.loginWithAccessToken(user, token);
		}
	}

	@ReactMethod
	public void loginWithOneTimeKey(String user, String key) {
		if (mClient != null) {
			mClient.loginWithOneTimeKey(user, key);
		}
	}

	@ReactMethod
	public void requestOneTimeLoginKey(String user) {
		if (mClient != null) {
			mClient.requestOneTimeKey(user);
		}
	}

	@ReactMethod
	public void refreshToken(String user, String token) {
		if (mClient != null) {
			mClient.refreshToken(user, token);
		}
	}

	@ReactMethod
	public void registerPushNotificationsToken(String token) {
		if (mClient != null) {
			mClient.registerForPushNotifications(token);
		}
	}

	@ReactMethod
	public void unregisterPushNotificationsToken(String token) {
		if (mClient != null) {
			mClient.unregisterFromPushNotifications(token);
		}
	}

	@ReactMethod
	public void handlePushNotification(ReadableMap notification) {
		if (mClient != null) {
			mClient.handlePushNotification(Utils.createHashMap(notification));
		}
	}
	//endregion

	//region Listeners methods
	@Override
	public void onIncomingCall(ICall call, boolean hasIncomingVideo, Map<String, String> headers) {

	}

	@Override
	public void onLoginSuccessful(String displayName, AuthParams authParams) {
		WritableMap tokens = Arguments.createMap();
		tokens.putString(EVENT_PARAM_ACCESS_TOKEN, authParams.getAccessToken());
		tokens.putInt(EVENT_PARAM_ACCESS_EXPIRE, authParams.getAccessTokenTimeExpired());
		tokens.putString(EVENT_PARAM_REFRESH_TOKEN, authParams.getRefreshToken());
		tokens.putInt(EVENT_PARAM_REFRESH_EXPIRE, authParams.getRefreshTokenTimeExpired());
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, true);
		params.putString(EVENT_PARAM_DISPLAY_NAME, displayName);
		params.putMap(EVENT_PARAM_TOKENS, tokens);
		sendEvent(mReactContext, EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onLoginFailed(LoginError loginError) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, Utils.convertLoginErrorToInt(loginError));
		sendEvent(mReactContext, EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onRefreshTokenFailed(LoginError loginError) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_TOKEN_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, Utils.convertLoginErrorToInt(loginError));
		sendEvent(mReactContext, EVENT_AUTH_TOKEN_RESULT, params);
	}

	@Override
	public void onRefreshTokenSuccess(AuthParams authParams) {
		WritableMap tokens = Arguments.createMap();
		tokens.putString(EVENT_PARAM_ACCESS_TOKEN, authParams.getAccessToken());
		tokens.putInt(EVENT_PARAM_ACCESS_EXPIRE, authParams.getAccessTokenTimeExpired());
		tokens.putString(EVENT_PARAM_REFRESH_TOKEN, authParams.getRefreshToken());
		tokens.putInt(EVENT_PARAM_REFRESH_EXPIRE, authParams.getRefreshTokenTimeExpired());
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_TOKEN_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, true);
		params.putMap(EVENT_PARAM_TOKENS, tokens);
		sendEvent(mReactContext, EVENT_AUTH_TOKEN_RESULT, params);
	}

	@Override
	public void onOneTimeKeyGenerated(String key) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, 302);
		params.putString(EVENT_PARAM_KEY, key);
		sendEvent(mReactContext, EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onConnectionEstablished() {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_ESTABLISHED);
		sendEvent(mReactContext, EVENT_CONNECTION_ESTABLISHED, params);
	}

	@Override
	public void onConnectionFailed(String error) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_FAILED);
		params.putString(EVENT_PARAM_MESSAGE, error);
		sendEvent(mReactContext, EVENT_CONNECTION_FAILED, params);
	}

	@Override
	public void onConnectionClosed() {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_CLOSED);
		sendEvent(mReactContext, EVENT_CONNECTION_CLOSED, params);
	}
	//endregion

	private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}
}