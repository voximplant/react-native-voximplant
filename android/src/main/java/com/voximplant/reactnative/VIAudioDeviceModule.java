/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.hardware.AudioDevice;
import com.voximplant.sdk.hardware.IAudioDeviceManager;
import com.voximplant.sdk.hardware.IAudioDeviceEventsListener;


import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.*;

public class VIAudioDeviceModule extends ReactContextBaseJavaModule implements IAudioDeviceEventsListener {
    private ReactApplicationContext mReactContext;
    private IAudioDeviceManager mAudioDeviceManager;

    public VIAudioDeviceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mAudioDeviceManager = Voximplant.getAudioDeviceManager();
        mAudioDeviceManager.addAudioDeviceEventsListener(this);
    }

    @Override
    public String getName() {
        return "VIAudioDeviceModule";
    }

    @ReactMethod
    public void selectAudioDevice(String audioDevice) {
        mAudioDeviceManager.selectAudioDevice(Utils.convertStringToAudioDevice(audioDevice));
    }

    @ReactMethod
    public void getAudioDevices(Promise promise) {
        List<AudioDevice> audioDevices = mAudioDeviceManager.getAudioDevices();
        WritableArray deviceList = Arguments.createArray();
        for (AudioDevice device : audioDevices) {
            deviceList.pushString(Utils.convertAudioDeviceToString(device));
        }
        promise.resolve(deviceList);
    }

    @ReactMethod
    public void getActiveDevice(Promise promise) {
        AudioDevice device = mAudioDeviceManager.getActiveDevice();
        promise.resolve(Utils.convertAudioDeviceToString(device));
    }

    @Override
    public void onAudioDeviceChanged(AudioDevice currentAudioDevice) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUDIO_DEVICE_CHANGED);
        params.putString(EVENT_PARAM_CURRENT_AUDIO_DEVICE, Utils.convertAudioDeviceToString(currentAudioDevice));
        sendEvent(EVENT_AUDIO_DEVICE_CHANGED, params);
    }

    @Override
    public void onAudioDeviceListChanged(List<AudioDevice> newDeviceList) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUDIO_DEVICE_LIST_CHANGED);
        WritableArray deviceList = Arguments.createArray();
        for (AudioDevice device : newDeviceList) {
            deviceList.pushString(Utils.convertAudioDeviceToString(device));
        }
        params.putArray(EVENT_PARAM_AUDIO_DEVICE_LIST, deviceList);
        sendEvent(EVENT_AUDIO_DEVICE_LIST_CHANGED, params);
    }

	private void sendEvent(String eventName, @Nullable WritableMap params) {
		mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}
}