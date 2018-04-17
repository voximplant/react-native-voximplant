/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.IEndpoint;

import java.util.HashMap;

class CallManager {
    private static CallManager mInstance = null;
    private HashMap<String, ICall> mCalls = new HashMap<>();
    private HashMap<String, IEndpoint> mEndpoints = new HashMap<>();
    // endpoint id and call id matching
    private HashMap<String, String> mCallEndpoints = new HashMap<>();

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
    
}