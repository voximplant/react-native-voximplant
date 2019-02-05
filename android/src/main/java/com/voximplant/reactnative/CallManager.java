/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.IVideoStream;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

class CallManager {
    private static CallManager mInstance = null;
    private HashMap<String, ICall> mCalls = new HashMap<>();
    private HashMap<String, IEndpoint> mEndpoints = new HashMap<>();
    // endpoint id and call id matching
    private HashMap<String, String> mCallEndpoints = new HashMap<>();

    private HashMap<String, IVideoStream> mVideoStreams = new HashMap<>();
    // video stream id and call id matching
    private HashMap<String, String> mCallVideoStreams = new HashMap<>();

    private CallManager() {

    }

    static synchronized CallManager getInstance() {
        if (mInstance == null) {
            mInstance = new CallManager();
        }
        return mInstance;
    }

    void addCall(ICall call) {
        if (call != null && !mCalls.containsKey(call.getCallId())) {
            mCalls.put(call.getCallId(), call);
        }
    }

    void removeCall(ICall call) {
        if (call != null) {
            ArrayList<String> objectsToRemove = new ArrayList<>();
            for (Map.Entry<String, String> callEndpoint : mCallEndpoints.entrySet()) {
                if (callEndpoint.getValue().equals(call.getCallId())) {
                    mEndpoints.remove(callEndpoint.getKey());
                    objectsToRemove.add(callEndpoint.getKey());
                }
            }
            for (String endpointId : objectsToRemove) {
                mCallEndpoints.remove(endpointId);
            }
            objectsToRemove.clear();
            for (Map.Entry<String, String> callVideoStream : mCallVideoStreams.entrySet()) {
                if (callVideoStream.getValue().equals(call.getCallId())) {
                    mVideoStreams.remove(callVideoStream.getKey());
                    objectsToRemove.add(callVideoStream.getKey());
                }
            }
            for (String videoStreamId : objectsToRemove) {
                mCallVideoStreams.remove(videoStreamId);
            }
            objectsToRemove.clear();
            mCalls.remove(call.getCallId());
        }
    }

    ICall getCallById(String callId) {
        return mCalls.get(callId);
    }

    ICall getCallByEndpointId(String endpointId) {
        String callId = mCallEndpoints.get(endpointId);
        return mCalls.get(callId);
    }

    String getCallIdByEndpointId(String endpointId) {
        return mCallEndpoints.get(endpointId);
    }

    void addEndpoint(IEndpoint endpoint, String callId) {
        if (endpoint != null && !mEndpoints.containsKey(endpoint.getEndpointId())) {
            mEndpoints.put(endpoint.getEndpointId(), endpoint);
            mCallEndpoints.put(endpoint.getEndpointId(), callId);
        }
    }

    void removeEndpoint(IEndpoint endpoint) {
        if (endpoint != null) {
            mEndpoints.remove(endpoint.getEndpointId());
            mCallEndpoints.remove(endpoint.getEndpointId());
        }
    }

    IEndpoint getEndpointById(String endpointId) {
        return mEndpoints.get(endpointId);
    }

    void addVideoStream(String callId, IVideoStream videoStream) {
        if (videoStream != null) {
            mVideoStreams.put(videoStream.getVideoStreamId(), videoStream);
            mCallVideoStreams.put(videoStream.getVideoStreamId(), callId);
        }
    }

    void removeVideoStream(IVideoStream videoStream) {
        if (videoStream != null) {
            mVideoStreams.remove(videoStream.getVideoStreamId());
            mCallVideoStreams.remove(videoStream.getVideoStreamId());
        }
    }

    IVideoStream getVideoStreamById(String videoStreamId) {
        return mVideoStreams.get(videoStreamId);
    }

}