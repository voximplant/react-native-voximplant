/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.voximplant.sdk.hardware.IAudioFile;

import java.util.HashMap;
import java.util.Map;

public class AudioFileManager {
    private static AudioFileManager mInstance = null;
    private HashMap<String, IAudioFile> mAudioFiles = new HashMap<>();

    static synchronized AudioFileManager getInstance() {
        if (mInstance == null) {
            mInstance = new AudioFileManager();
        }
        return mInstance;
    }

    void addAudioFile(String fileId, IAudioFile audioFile) {
        if (fileId != null && audioFile != null) {
            mAudioFiles.put(fileId, audioFile);
        }
    }

    IAudioFile getAudioFile(String fileId) {
        if (fileId == null) {
            return null;
        }
        return mAudioFiles.get(fileId);
    }

    void removeAudioFile(String fileId) {
        if (fileId != null) {
            mAudioFiles.remove(fileId);
        }
    }

    String getFileIdForAudioFile(IAudioFile audioFile) {
        for(Map.Entry<String, IAudioFile> entry : mAudioFiles.entrySet()) {
            if (entry.getValue().equals(audioFile)) {
                return entry.getKey();
            }
        }
        return null;
    }
}
