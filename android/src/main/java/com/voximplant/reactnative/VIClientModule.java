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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.call.CallException;
import com.voximplant.sdk.call.CallSettings;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.VideoFlags;
import com.voximplant.sdk.client.AuthParams;
import com.voximplant.sdk.client.ClientConfig;
import com.voximplant.sdk.client.IClient;
import com.voximplant.sdk.client.IClientIncomingCallListener;
import com.voximplant.sdk.client.IClientLoginListener;
import com.voximplant.sdk.client.IClientSessionListener;
import com.voximplant.sdk.client.ILogListener;
import com.voximplant.sdk.client.LogLevel;
import com.voximplant.sdk.client.LoginError;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.EVENT_AUTH_RESULT;
import static com.voximplant.reactnative.Constants.EVENT_AUTH_TOKEN_RESULT;
import static com.voximplant.reactnative.Constants.EVENT_CONNECTION_CLOSED;
import static com.voximplant.reactnative.Constants.EVENT_CONNECTION_ESTABLISHED;
import static com.voximplant.reactnative.Constants.EVENT_CONNECTION_FAILED;
import static com.voximplant.reactnative.Constants.EVENT_INCOMING_CALL;
import static com.voximplant.reactnative.Constants.EVENT_LOG_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_AUTH_RESULT;
import static com.voximplant.reactnative.Constants.EVENT_NAME_AUTH_TOKEN_RESULT;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CONNECTION_CLOSED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CONNECTION_ESTABLISHED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_CONNECTION_FAILED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_INCOMING_CALL;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ACCESS_EXPIRE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ACCESS_TOKEN;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_CALLID;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_CODE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_DISPLAY_NAME;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ENDPOINTID;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ENDPOINT_NAME;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_ENDPOINT_SIP_URI;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_HEADERS;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_INCOMING_VIDEO;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_KEY;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_NAME;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_REFRESH_EXPIRE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_REFRESH_TOKEN;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_RESULT;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_TOKENS;

public class VIClientModule extends ReactContextBaseJavaModule
		implements IClientSessionListener, IClientLoginListener, IClientIncomingCallListener, ILogListener {
	private IClient mClient = null;
	private ReactApplicationContext mReactContext;

	public VIClientModule(ReactApplicationContext reactContext) {
		super(reactContext);
		mReactContext = reactContext;
	}

	@Override
	public String getName() {
		return "VIClientModule";
	}

	//region React methods
	@ReactMethod
	public void init(boolean enableVideo, boolean enableDebugLogging, boolean enableCameraMirroring, boolean enableLogcatLogging,
					 String videoCodec, String packageName, String requestAudioFocusMode) {
		Voximplant.subVersion = "react-1.23.0";
		ClientConfig config = new ClientConfig();
		config.enableVideo = enableVideo;
		config.enableDebugLogging = enableDebugLogging;
		config.enableCameraMirroring = enableCameraMirroring;
		config.enableLogcatLogging = enableLogcatLogging;
		config.preferredVideoCodec = Utils.convertStringToVideoCodec(videoCodec);
		config.packageName = packageName;
		config.requestAudioFocusMode = Utils.convertStringToRequestAudioFocusMode(requestAudioFocusMode);
		mClient = Voximplant.getClientInstance(Executors.newSingleThreadExecutor(), mReactContext, config);
		mClient.setClientIncomingCallListener(this);
		mClient.setClientLoginListener(this);
		mClient.setClientSessionListener(this);
		Voximplant.setLogListener(this);
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
			serversList = Utils.createStringArrayList(servers);
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
			mClient.registerForPushNotifications(token, null);
		}
	}

	@ReactMethod
	public void unregisterPushNotificationsToken(String token) {
		if (mClient != null) {
			mClient.unregisterFromPushNotifications(token, null);
		}
	}

	@ReactMethod
	public void handlePushNotification(ReadableMap notification) {
		if (mClient != null) {
			mClient.handlePushNotification(Utils.createHashMap(notification));
		}
	}

	@ReactMethod
	public void createAndStartCall(String user, ReadableMap videoSettings, String videoCodec, String customData, ReadableMap headers, Callback callback) {
		if (mClient != null) {
			CallSettings callSettings = new CallSettings();
			callSettings.videoFlags = new VideoFlags(videoSettings.getBoolean("receiveVideo"), videoSettings.getBoolean("sendVideo"));
			callSettings.customData = customData;
			callSettings.extraHeaders = Utils.createHashMap(headers);
			callSettings.preferredVideoCodec = Utils.convertStringToVideoCodec(videoCodec);
			ICall call = mClient.call(user, callSettings);
			if (call != null) {
				try {
					CallManager.getInstance().addCall(call);
					call.start();
					callback.invoke(call.getCallId(), null);
				} catch (CallException e) {
					callback.invoke(null, e.getErrorCode().toString());
				}
			} else {
				callback.invoke(null, "NOT_LOGGED_IN");
			}
		} else {
			callback.invoke(null, "NOT_LOGGED_IN");
		}
	}

	@ReactMethod
	public void createAndStartConference(String user, ReadableMap videoSettings, String videoCodec, String customData, ReadableMap headers, Callback callback) {
		if (mClient != null) {
			CallSettings callSettings = new CallSettings();
			callSettings.videoFlags = new VideoFlags(videoSettings.getBoolean("receiveVideo"), videoSettings.getBoolean("sendVideo"));
			callSettings.customData = customData;
			callSettings.extraHeaders = Utils.createHashMap(headers);
			callSettings.preferredVideoCodec = Utils.convertStringToVideoCodec(videoCodec);
			ICall call = mClient.callConference(user, callSettings);
			if (call != null) {
				try {
					CallManager.getInstance().addCall(call);
					call.start();
					callback.invoke(call.getCallId(), null);
				} catch (CallException e) {
					callback.invoke(null, e.getErrorCode().toString());
				}
			} else {
				callback.invoke(null, "NOT_LOGGED_IN");
			}
		} else {
			callback.invoke(null, "NOT_LOGGED_IN");
		}
	}
	//endregion

	//region Listeners methods
	@Override
	public void onIncomingCall(ICall call, boolean hasIncomingVideo, Map<String, String> headers) {
		CallManager.getInstance().addCall(call);
		IEndpoint endpoint = call.getEndpoints().get(0);
		if (endpoint != null) {
			CallManager.getInstance().addEndpoint(endpoint, call.getCallId());
		}
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_INCOMING_CALL);
		params.putString(EVENT_PARAM_CALLID, call.getCallId());
		params.putBoolean(EVENT_PARAM_INCOMING_VIDEO, hasIncomingVideo);
		params.putMap(EVENT_PARAM_HEADERS, Utils.createWritableMap(headers));
		if (endpoint != null) {
			params.putString(EVENT_PARAM_ENDPOINTID, endpoint.getEndpointId());
			params.putString(EVENT_PARAM_ENDPOINT_NAME, endpoint.getUserName());
			params.putString(EVENT_PARAM_DISPLAY_NAME, endpoint.getUserDisplayName());
			params.putString(EVENT_PARAM_ENDPOINT_SIP_URI, endpoint.getSipUri());
		}
		sendEvent(EVENT_INCOMING_CALL, params);
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
		sendEvent(EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onLoginFailed(LoginError loginError) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, Utils.convertLoginErrorToInt(loginError));
		sendEvent(EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onRefreshTokenFailed(LoginError loginError) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_TOKEN_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, Utils.convertLoginErrorToInt(loginError));
		sendEvent(EVENT_AUTH_TOKEN_RESULT, params);
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
		sendEvent(EVENT_AUTH_TOKEN_RESULT, params);
	}

	@Override
	public void onOneTimeKeyGenerated(String key) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUTH_RESULT);
		params.putBoolean(EVENT_PARAM_RESULT, false);
		params.putInt(EVENT_PARAM_CODE, 302);
		params.putString(EVENT_PARAM_KEY, key);
		sendEvent(EVENT_AUTH_RESULT, params);
	}

	@Override
	public void onConnectionEstablished() {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_ESTABLISHED);
		sendEvent(EVENT_CONNECTION_ESTABLISHED, params);
	}

	@Override
	public void onConnectionFailed(String error) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_FAILED);
		params.putString(EVENT_PARAM_MESSAGE, error);
		sendEvent(EVENT_CONNECTION_FAILED, params);
	}

	@Override
	public void onConnectionClosed() {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_NAME, EVENT_NAME_CONNECTION_CLOSED);
		sendEvent(EVENT_CONNECTION_CLOSED, params);
	}


	@Override
	public void onLogMessage(LogLevel logLevel, String message) {
		WritableMap params = Arguments.createMap();
		params.putString(EVENT_PARAM_LOG_LEVEL, Utils.convertLogLevel(logLevel));
		params.putString(EVENT_PARAM_LOG_MESSAGE, message);
		sendEvent(EVENT_LOG_MESSAGE, params);
	}
	//endregion

	private void sendEvent(String eventName, @Nullable WritableMap params) {
		mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}

}
