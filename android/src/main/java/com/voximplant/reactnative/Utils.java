package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.voximplant.sdk.client.ClientState;
import com.voximplant.sdk.client.LoginError;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

class Utils {

    static List<String> createArrayList(ReadableArray readableArray) {
		if (readableArray == null) {
			return null;
		}
		List<String> list = new ArrayList<>(readableArray.size());
		for (int i = 0; i < readableArray.size(); i++) {
			ReadableType indexType = readableArray.getType(i);
			switch (indexType) {
			case String:
				list.add(readableArray.getString(i));
				break;
			default:
				throw new IllegalArgumentException("Could not convert object with index: " + i);
			}
		}
		return list;
	}

    static Map<String, String> createHashMap(ReadableMap v) {
        if (v == null) {
            return null;
        }
        Map<String, String> map = new HashMap<>();
        ReadableMapKeySetIterator it = v.keySetIterator();
        while (it.hasNextKey()) {
            String key = it.nextKey();
            map.put(key, v.getString(key));
        }
        return map;
    }

    static WritableMap createWritableMap(Map<String, String> v) {
        WritableMap map = Arguments.createMap();
        for (Map.Entry<String, String> entry : v.entrySet()) {
            map.putString(entry.getKey(), entry.getValue());
        }
        return map;
    }

	static String convertClientStateToString(ClientState state) {
		switch (state) {
			case DISCONNECTED:
				return Constants.DISCONNECTED;
			case CONNECTING:
				return Constants.CONNECTING;
			case CONNECTED:
				return Constants.CONNECTED;
			case LOGGING_IN:
				return Constants.LOGGING_IN;
			case LOGGED_IN:
				return Constants.LOGGED_IN;
			default:
				return Constants.DISCONNECTED;
		}
	}

	static int convertLoginErrorToInt(LoginError error) {
    	switch (error) {
			case INVALID_PASSWORD:
				return 401;
			case ACCOUNT_FROZEN:
				return 403;
			case INVALID_USERNAME:
				return 404;
			case TIMEOUT:
				return 408;
			case INVALID_STATE:
				return 491;
			case NETWORK_ISSUES:
				return 503;
			case TOKEN_EXPIRED:
				return 701;
			case INTERNAL_ERROR:
				default:
				return 500;
		}
	}
}