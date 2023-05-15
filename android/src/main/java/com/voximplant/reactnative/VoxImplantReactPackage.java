/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import com.facebook.react.ReactPackage;
import java.util.List;
import java.util.Arrays;

public class VoxImplantReactPackage implements ReactPackage {
	@NonNull
	@Override
	public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
		return Arrays.asList(
				new VIClientModule(reactContext),
				new VICallModule(reactContext),
				new VIAudioDeviceModule(reactContext),
				new VICameraModule(reactContext),
				new VIMessagingModule(reactContext),
				new VIAudioFileModule(reactContext));
	}

	@NonNull
	@Override
	public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
		return Arrays.asList(new com.voximplant.reactnative.VideoViewManager(reactContext));
	}
}
