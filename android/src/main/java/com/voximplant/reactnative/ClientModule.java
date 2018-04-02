/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.voximplant.sdk.client.ClientConfig;
import com.voximplant.sdk.client.IClient;

import java.util.concurrent.Executors;

import com.voximplant.sdk.Voximplant;

public class ClientModule extends ReactContextBaseJavaModule {
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
	}

	@ReactMethod
	public void disconnect() {
		if (mClient != null) {
			mClient.disconnect();
		}
	}

}