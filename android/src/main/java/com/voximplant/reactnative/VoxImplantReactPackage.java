/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import com.facebook.react.ReactPackage;
import java.util.List;
import java.util.Arrays;

public class VoxImplantReactPackage implements ReactPackage {
	@Override
	public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
		return Arrays.<NativeModule>asList(
				new VIClientModule(reactContext),
				new VICallModule(reactContext),
				new VIAudioDeviceModule(reactContext),
				new VICameraModule(reactContext),
				new VIMessagingModule(reactContext),
				new VIAudioFileModule(reactContext));
	}

	@Override
	public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
		return Arrays.<ViewManager>asList(new VideoViewManager());
	}
}
