/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.voximplant.sdk.call.ICall;

import java.util.HashMap;

class CallManager {
    private static CallManager mInstance = null;
    private HashMap<String, ICall> mCalls = new HashMap<>();

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
    
}