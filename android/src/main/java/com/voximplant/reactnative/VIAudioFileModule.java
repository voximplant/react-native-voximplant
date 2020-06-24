/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.hardware.IAudioFile;
import com.voximplant.sdk.hardware.IAudioFileListener;

import java.util.UUID;

import javax.annotation.Nullable;

import static com.voximplant.reactnative.Constants.EVENT_AUDIO_FILE_STARTED;
import static com.voximplant.reactnative.Constants.EVENT_AUDIO_FILE_STOPPED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_AUDIO_FILE_STARTED;
import static com.voximplant.reactnative.Constants.EVENT_NAME_AUDIO_FILE_STOPPED;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_AUDIO_FILE_ID;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_NAME;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_RESULT;

public class VIAudioFileModule extends ReactContextBaseJavaModule implements IAudioFileListener {
    private ReactApplicationContext mReactContext;
    private Callback mCallback;

    public VIAudioFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VIAudioFileModule";
    }

    @ReactMethod
    public void initWithFile(ReadableMap params, Callback callback) {
        if (params == null) {
            callback.invoke(null, "Invalid arguments");
            return;
        }
        String name = params.getString("name");
        String usage = params.getString("usage");
        int rawId = mReactContext.getResources().getIdentifier(name, "raw", mReactContext.getPackageName());
        IAudioFile audioFile = Voximplant.createAudioFile(mReactContext, rawId, Utils.convertStringToAudioFileUsage(usage));
        if (audioFile == null) {
            callback.invoke(null, "Internal error");
            return;
        }
        audioFile.setAudioFileListener(this);
        String fileId = UUID.randomUUID().toString();
        AudioFileManager.getInstance().addAudioFile(fileId, audioFile);
        callback.invoke(fileId, null);
    }

    @ReactMethod
    public void loadFile(ReadableMap params, Callback callback) {
        if (params == null) {
            callback.invoke(null, "Invalid arguments");
            return;
        }
        String url = params.getString("url");
        String usage = params.getString("usage");
        IAudioFile audioFile = Voximplant.createAudioFile(url, Utils.convertStringToAudioFileUsage(usage));
        if (audioFile == null) {
            callback.invoke(null, "Internal error");
            return;
        }
        audioFile.setAudioFileListener(this);
        String fileId = UUID.randomUUID().toString();
        AudioFileManager.getInstance().addAudioFile(fileId, audioFile);
        mCallback = callback;
    }

    @ReactMethod
    public void play(String fileId, boolean loop) {
        IAudioFile audioFile = AudioFileManager.getInstance().getAudioFile(fileId);
        if (audioFile != null) {
            audioFile.play(loop);
        }
    }

    @ReactMethod
    public void stop(String fileId) {
        IAudioFile audioFile = AudioFileManager.getInstance().getAudioFile(fileId);
        if (audioFile != null) {
            audioFile.stop(false);
        }
    }

    @ReactMethod
    public void releaseResources(String fileId) {
        IAudioFile audioFile = AudioFileManager.getInstance().getAudioFile(fileId);
        if (audioFile != null) {
            audioFile.release();
            AudioFileManager.getInstance().removeAudioFile(fileId);
        }
    }


    @Override
    public void onStart(IAudioFile audioFile) {
        String fileId = AudioFileManager.getInstance().getFileIdForAudioFile(audioFile);
        if (fileId != null) {
            WritableMap params = Arguments.createMap();
            params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUDIO_FILE_STARTED);
            params.putString(EVENT_PARAM_AUDIO_FILE_ID, fileId);
            params.putBoolean(EVENT_PARAM_RESULT, true);
            sendEvent(EVENT_AUDIO_FILE_STARTED, params);
        }
    }

    @Override
    public void onStop(IAudioFile audioFile) {
        String fileId = AudioFileManager.getInstance().getFileIdForAudioFile(audioFile);
        if (fileId != null) {
            WritableMap params = Arguments.createMap();
            params.putString(EVENT_PARAM_NAME, EVENT_NAME_AUDIO_FILE_STOPPED);
            params.putString(EVENT_PARAM_AUDIO_FILE_ID, fileId);
            params.putBoolean(EVENT_PARAM_RESULT, true);
            sendEvent(EVENT_AUDIO_FILE_STOPPED, params);
        }
    }

    @Override
    public void onPrepared(IAudioFile audioFile) {
        if (mCallback != null) {
            String fileId = AudioFileManager.getInstance().getFileIdForAudioFile(audioFile);
            mCallback.invoke(fileId, null);
            mCallback = null;
        }
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
