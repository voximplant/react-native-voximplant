/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.ILocalVideoStream;
import com.voximplant.sdk.call.IRemoteVideoStream;
import com.voximplant.sdk.call.IVideoStream;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class CallManager {
    private static CallManager mInstance = null;
    private Map<String, ICall> mCalls = new HashMap<>();
    private Map<String, IEndpoint> mEndpoints = new HashMap<>();
    // endpoint id and call id matching
    private Map<String, String> mCallEndpoints = new HashMap<>();

    private Map<String, ILocalVideoStream> mLocalVideoStreams = new HashMap<>();
    private Map<String, IRemoteVideoStream> mRemoteVideoStreams = new HashMap<>();
    // video stream id and call id matching
    private Map<String, String> mCallVideoStreams = new HashMap<>();

    private CallManager() {

    }

    public static synchronized CallManager getInstance() {
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
                    mLocalVideoStreams.remove(callVideoStream.getKey());
                    objectsToRemove.add(callVideoStream.getKey());
                }
                if (callVideoStream.getValue().equals(call.getCallId())) {
                    mRemoteVideoStreams.remove(callVideoStream.getKey());
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

    void addLocalVideoStream(String callId, ILocalVideoStream videoStream) {
        if (videoStream != null) {
            mLocalVideoStreams.put(videoStream.getVideoStreamId(), videoStream);
            mCallVideoStreams.put(videoStream.getVideoStreamId(), callId);
        }
    }

    void addRemoteVideoStream(String callId, IRemoteVideoStream videoStream) {
        if (videoStream != null) {
            mRemoteVideoStreams.put(videoStream.getVideoStreamId(), videoStream);
            mCallVideoStreams.put(videoStream.getVideoStreamId(), callId);
        }
    }

    void removeLocalVideoStream(ILocalVideoStream videoStream) {
        if (videoStream != null) {
            mLocalVideoStreams.remove(videoStream.getVideoStreamId());
            mCallVideoStreams.remove(videoStream.getVideoStreamId());
        }
    }

    void removeRemoteVideoStream(IRemoteVideoStream videoStream) {
        if (videoStream != null) {
            mRemoteVideoStreams.remove(videoStream.getVideoStreamId());
            mCallVideoStreams.remove(videoStream.getVideoStreamId());
        }
    }

    ILocalVideoStream getLocalVideoStreamById(String videoStreamId) {
        return mLocalVideoStreams.get(videoStreamId);
    }

    IRemoteVideoStream getRemoteVideoStreamById(String videoStreamId) {
        return mRemoteVideoStreams.get(videoStreamId);
    }

    IVideoStream getVideoStreamById(String videoStreamId) {
        IVideoStream videoStream = mLocalVideoStreams.get(videoStreamId);
        if (videoStream == null) {
            videoStream = mRemoteVideoStreams.get(videoStreamId);
        }
        return videoStream;
    }

    public void endAllCalls() {
        for (Map.Entry<String, ICall> callEntry : mCalls.entrySet()) {
            callEntry.getValue().hangup(null);
        }
    }

}
