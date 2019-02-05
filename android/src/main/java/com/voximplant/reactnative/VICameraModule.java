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
import com.voximplant.sdk.hardware.ICameraManager;
import com.voximplant.sdk.hardware.ICameraEventsListener;

import static com.voximplant.reactnative.Constants.*;

import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class VICameraModule extends ReactContextBaseJavaModule implements ICameraEventsListener {
    private ReactApplicationContext mReactContext;
    private ICameraManager mCameraManager;
    private int mCameraResolutionWidth = DEFAULT_CAMERA_RESOLUTION_WITDTH;
    private int mCameraResolutionHeight = DEFAULT_CAMERA_RESOLUTION_HEIGHT;
    private int mCameraIndex = DEFAULT_CAMERA_INDEX;

    public VICameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        mCameraManager = Voximplant.getCameraManager(mReactContext);
        mCameraManager.addCameraEventsListener(this);
    }

    @Override
    public String getName() {
        return "VICameraModule";
    }

    @ReactMethod
    public void switchCamera(String cameraType) {
        mCameraIndex = Utils.convertCameraTypeToCameraIndex(cameraType);
        mCameraManager.setCamera(mCameraIndex, mCameraResolutionWidth, mCameraResolutionHeight);
    }
    
    @ReactMethod
    public void setCameraResolution(int width, int height) {
         mCameraResolutionWidth = width;
         mCameraResolutionHeight = height;
         mCameraManager.setCamera(mCameraIndex, mCameraResolutionWidth, mCameraResolutionHeight);
    }

    @Override
    public void onCameraDisconnected() {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CAMERA_DISCONNECTED);
        sendEvent(EVENT_CAMERA_DISCONNECTED, params);
    }

    @Override 
    public void onCameraError(String errorDescription) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CAMERA_ERROR);
        params.putString(EVENT_PARAM_CAMERA_ERROR, errorDescription);
        sendEvent(EVENT_CAMERA_ERROR, params);
    }

    @Override
    public void onCameraSwitchDone(boolean isFrontCamera) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CAMERA_SWITCH_DONE);
        params.putBoolean(EVENT_PARAM_IS_FRONT_CAMERA, isFrontCamera);
        sendEvent(EVENT_CAMERA_SWITCH_DONE, params);
    }

    @Override 
    public void onCameraSwitchError(String errorDescription) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_PARAM_NAME, EVENT_NAME_CAMERA_SWITCH_ERROR);
        params.putString(EVENT_PARAM_CAMERA_ERROR, errorDescription);
        sendEvent(EVENT_CAMERA_SWITCH_ERROR, params);
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
		mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}
}