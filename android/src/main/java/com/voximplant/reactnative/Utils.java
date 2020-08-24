package com.voximplant.reactnative;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.voximplant.sdk.call.VideoCodec;
import com.voximplant.sdk.call.VideoStreamType;
import com.voximplant.sdk.client.ClientState;
import com.voximplant.sdk.client.LogLevel;
import com.voximplant.sdk.client.LoginError;
import com.voximplant.sdk.client.RequestAudioFocusMode;
import com.voximplant.sdk.hardware.AudioDevice;
import com.voximplant.sdk.hardware.AudioFileUsage;
import com.voximplant.sdk.messaging.MessengerAction;
import com.voximplant.sdk.messaging.MessengerEventType;
import com.voximplant.sdk.messaging.MessengerNotification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.voximplant.reactnative.Constants.EDIT_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_ADD_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_CREATE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_EDIT_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_EDIT_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_EDIT_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_CONVERSATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_PUBLIC_CONVERSATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_SUBSCRIPTION_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_GET_USERS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_JOIN_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_LEAVE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_MANAGE_NOTIFICATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_REMOVE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_REMOVE_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_REMOVE_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_RETRANSMIT_EVENTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_SEND_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_SET_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_SUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_TYPING;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_UNKNOWN;
import static com.voximplant.reactnative.Constants.EVENT_MES_ACTION_UNSUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_CREATE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_EDIT_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_EDIT_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_ERROR;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_GET_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_GET_PUBLIC_CONVERSATIONS;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_GET_SUBSCRIPTION_LIST;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_READ;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_REMOVE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_REMOVE_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_RETRANSMIT_EVENTS;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_SEND_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_SET_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_SUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_TYPING;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_UNKNOWN;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_UNSUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL_DEBUG;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL_ERROR;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL_INFO;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL_VERBOSE;
import static com.voximplant.reactnative.Constants.EVENT_PARAM_LOG_LEVEL_WARNING;
import static com.voximplant.reactnative.Constants.IN_CALL;
import static com.voximplant.reactnative.Constants.NOTIFICATION;
import static com.voximplant.reactnative.Constants.RINGTONE;
import static com.voximplant.reactnative.Constants.SEND_MESSAGE;

import static com.voximplant.reactnative.Constants.REQUEST_ON_CALL_CONNECTED;
import static com.voximplant.reactnative.Constants.REQUEST_ON_CALL_START;
import static com.voximplant.reactnative.Constants.UNKNOWN;
import static com.voximplant.reactnative.Constants.VIDEO_STREAM_TYPE_SCREEN_SHARING;
import static com.voximplant.reactnative.Constants.VIDEO_STREAM_TYPE_VIDEO;

class Utils {

	static List<String> createStringArrayList(ReadableArray readableArray) {
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

	static List<Long> createLongArrayList(ReadableArray readableArray) {
		if (readableArray == null) {
			return null;
		}
		List<Long> list = new ArrayList<>(readableArray.size());
		for (int i = 0; i < readableArray.size(); i++) {
			ReadableType indexType = readableArray.getType(i);
			switch (indexType) {
				case Number:
					list.add((long)readableArray.getDouble(i));
					break;
				default:
					throw new IllegalArgumentException("Could not convert object with index: " + i);
			}
		}
		return list;
	}

	static List<Object> createObjectArrayList(ReadableArray readableArray) {
		if (readableArray == null) {
			return null;
		}
		ArrayList<Object> list = new ArrayList<>(readableArray.size());
		for (int i = 0; i < readableArray.size(); i++) {
			ReadableType indexType = readableArray.getType(i);
			switch (indexType) {
				case Null:
					list.add(null);
					break;
				case Boolean:
					list.add(readableArray.getBoolean(i));
					break;
				case Number:
					list.add(readableArray.getDouble(i));
					break;
				case String:
					list.add(readableArray.getString(i));
					break;
				case Map:
					list.add(createHashMap(readableArray.getMap(i)));
					break;
				case Array:
					list.add(createStringArrayList(readableArray.getArray(i)));
					break;
			}
		}
		return list;
	}

	static WritableArray createWritableArray(List<String> list) {
		if (list == null) {
			return null;
		}
		WritableArray array = Arguments.createArray();
		for (String item : list) {
			array.pushString(item);
		}
		return array;
	}

	static WritableArray createLongWritableArray(List<Long> list) {
		if (list == null) {
			return null;
		}
		WritableArray array = Arguments.createArray();
		for (Long item : list) {
			array.pushDouble(item);
		}
		return array;
	}

	static WritableArray createObjectWritableArray(List<Object> list) {
		if (list == null) {
			return null;
		}
		WritableArray array = Arguments.createArray();
		for (Object item : list) {
			if (item == null) {
				array.pushNull();
			} else if (item instanceof String) {
				array.pushString((String) item);
			} else if (item instanceof Double || item instanceof Long) {
				array.pushDouble((Double) item);
			} else if (item instanceof Integer) {
				array.pushInt((Integer) item);
			} else if (item instanceof Boolean) {
				array.pushBoolean((Boolean) item);
			} else if (item instanceof List) {
				array.pushArray(createObjectWritableArray((List) item));
			} else if (item instanceof Map) {
				array.pushMap(createObjectWritableMap((Map) item));
			}
		}
		return array;
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

	static Map<String, Object> createObjectMap(ReadableMap map) {
		if (map == null) {
			return null;
		}
		HashMap<String, Object> resultMap = new HashMap<>();
		ReadableMapKeySetIterator it = map.keySetIterator();
		while (it.hasNextKey()) {
			String key = it.nextKey();
			switch (map.getType(key)) {
				case Null:
					resultMap.put(key, null);
				case Boolean:
					resultMap.put(key, map.getBoolean(key));
					break;
				case Number:
					resultMap.put(key, map.getDouble(key));
					break;
				case String:
					resultMap.put(key, map.getString(key));
					break;
				case Map:
					resultMap.put(key, createObjectMap(map.getMap(key)));
					break;
				case Array:
					resultMap.put(key, createObjectArrayList(map.getArray(key)));
					break;
			}
		}
		return resultMap;
	}

	static List<Map<String, Object>> createObjectMapList(ReadableArray array) {
		if (array == null) {
			return null;
		}
		List<Map<String, Object>> list = new ArrayList<>();
		for (int i = 0; i < array.size(); i++) {
			ReadableType indexType = array.getType(i);
			switch (indexType) {
				case Null:
				case Boolean:
				case Number:
				case String:
				case Array:
					break;
				case Map:
					Map<String, Object> map = createObjectMap(array.getMap(i));
					if (map != null) {
						list.add(map);
					}
					break;
			}
		}
		return list;
	}

	static WritableArray createArrayForObjectMapList(List<Map<String, Object>> list) {
		if (list == null) {
			return null;
		}
		WritableArray array = Arguments.createArray();
		for (Map<String, Object> objectMap : list) {
			WritableMap map = createObjectWritableMap(objectMap);
			if (map != null) {
				array.pushMap(map);
			}
		}
		return array;
	}

	static WritableMap createWritableMap(Map<String, String> v) {
		WritableMap map = Arguments.createMap();
		for (Map.Entry<String, String> entry : v.entrySet()) {
			map.putString(entry.getKey(), entry.getValue());
		}
		return map;
	}

	static WritableMap createObjectWritableMap(Map<String, Object> map) {
		if (map == null) {
			return null;
		}
		WritableMap resultMap = Arguments.createMap();
		for (Map.Entry<String, Object> entry : map.entrySet()) {
			if (entry.getValue() == null) {
				resultMap.putNull(entry.getKey());
			} else if (entry.getValue() instanceof String) {
				resultMap.putString(entry.getKey(), (String) entry.getValue());
			} else if (entry.getValue() instanceof Long || entry.getValue() instanceof Double) {
				resultMap.putDouble(entry.getKey(), (Double) entry.getValue());
			} else if (entry.getValue() instanceof Integer) {
				resultMap.putInt(entry.getKey(), (Integer) entry.getValue());
			} else if (entry.getValue() instanceof Boolean) {
				resultMap.putBoolean(entry.getKey(), (Boolean) entry.getValue());
			} else if (entry.getValue() instanceof List) {
				resultMap.putArray(entry.getKey(), createObjectWritableArray((List) entry.getValue()));
			} else if (entry.getValue() instanceof Map) {
				resultMap.putMap(entry.getKey(), createObjectWritableMap((Map) entry.getValue()));
			}
		}
		return resultMap;
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
			case MAU_ACCESS_DENIED:
				return 402;
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

	static AudioDevice convertStringToAudioDevice(String device) {
		switch (device) {
			case Constants.BLUETOOTH:
				return AudioDevice.BLUETOOTH;
			case Constants.EARPIECE:
				return AudioDevice.EARPIECE;
			case Constants.SPEAKER:
				return AudioDevice.SPEAKER;
			case Constants.WIRED_HEADSET:
				return AudioDevice.WIRED_HEADSET;
			case Constants.NONE:
			default:
				return AudioDevice.NONE;
		}
	}

	static String convertAudioDeviceToString(AudioDevice device) {
		switch (device) {
			case BLUETOOTH:
				return Constants.BLUETOOTH;
			case EARPIECE:
				return Constants.EARPIECE;
			case SPEAKER:
				return Constants.SPEAKER;
			case WIRED_HEADSET:
				return Constants.WIRED_HEADSET;
			case NONE:
			default:
				return Constants.NONE;
		}
	}

	static int convertCameraTypeToCameraIndex(String cameraType) {
		return cameraType.equals(Constants.CAMERA_TYPE_BACK) ? 0 : 1;
	}

	static VideoCodec convertStringToVideoCodec(String videoCodec) {
		switch (videoCodec) {
			case "VP8":
				return VideoCodec.VP8;
			case "H264":
				return VideoCodec.H264;
			case "AUTO":
			default:
				return VideoCodec.AUTO;
		}
	}

	static RequestAudioFocusMode convertStringToRequestAudioFocusMode(String requestAudioFocusMode) {
		switch (requestAudioFocusMode) {
			case REQUEST_ON_CALL_CONNECTED:
				return RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED;
			case REQUEST_ON_CALL_START:
			default:
				return RequestAudioFocusMode.REQUEST_ON_CALL_START;
		}
	}

	static WritableArray convertMessengerNotificationsToArray(List<MessengerNotification> notifications) {
		if (notifications == null) {
			return null;
		}
		WritableArray array = Arguments.createArray();
		for (MessengerNotification notification : notifications) {
			switch (notification) {
				case ON_EDIT_MESSAGE:
					array.pushString(EDIT_MESSAGE);
				case ON_SEND_MESSAGE:
				default:
					array.pushString(SEND_MESSAGE);
			}
		}
		return array;
	}

	static List<MessengerNotification> convertArrayToMessengerNotifications(ReadableArray readableArray) {
		if (readableArray == null) {
			return null;
		}
		List<MessengerNotification> list = new ArrayList<>();
		for (int i = 0; i < readableArray.size(); i++) {
			if (readableArray.getString(i).equals(EDIT_MESSAGE)) {
				list.add(MessengerNotification.ON_EDIT_MESSAGE);
			}
			if (readableArray.getString(i).equals(SEND_MESSAGE)) {
				list.add(MessengerNotification.ON_SEND_MESSAGE);
			}
		}
		return list;
	}

	static String convertMessengerActionToString(MessengerAction action) {
		switch (action) {
			case ADD_PARTICIPANTS:
				return EVENT_MES_ACTION_ADD_PARTICIPANTS;
			case CREATE_CONVERSATION:
				return EVENT_MES_ACTION_CREATE_CONVERSATION;
			case EDIT_CONVERSATION:
				return EVENT_MES_ACTION_EDIT_CONVERSATION;
			case EDIT_MESSAGE:
				return EVENT_MES_ACTION_EDIT_MESSAGE;
			case EDIT_PARTICIPANTS:
				return EVENT_MES_ACTION_EDIT_PARTICIPANTS;
			case EDIT_USER:
				return EVENT_MES_ACTION_EDIT_USER;
			case GET_CONVERSATION:
				return EVENT_MES_ACTION_GET_CONVERSATION;
			case GET_CONVERSATIONS:
				return EVENT_MES_ACTION_GET_CONVERSATIONS;
			case GET_USER:
				return EVENT_MES_ACTION_GET_USER;
			case GET_USERS:
				return EVENT_MES_ACTION_GET_USERS;
			case IS_READ:
				return EVENT_MES_ACTION_READ;
			case JOIN_CONVERSATION:
				return EVENT_MES_ACTION_JOIN_CONVERSATION;
			case LEAVE_CONVERSATION:
				return EVENT_MES_ACTION_LEAVE_CONVERSATION;
			case MANAGE_NOTIFICATIONS:
				return EVENT_MES_ACTION_MANAGE_NOTIFICATIONS;
			case REMOVE_CONVERSATION:
				return EVENT_MES_ACTION_REMOVE_CONVERSATION;
			case REMOVE_MESSAGE:
				return EVENT_MES_ACTION_REMOVE_MESSAGE;
			case REMOVE_PARTICIPANTS:
				return EVENT_MES_ACTION_REMOVE_PARTICIPANTS;
			case RETRANSMIT_EVENTS:
				return EVENT_MES_ACTION_RETRANSMIT_EVENTS;
			case SEND_MESSAGE:
				return EVENT_MES_ACTION_SEND_MESSAGE;
			case SET_STATUS:
				return EVENT_MES_ACTION_SET_STATUS;
			case SUBSCRIBE:
				return EVENT_MES_ACTION_SUBSCRIBE;
			case TYPING_MESSAGE:
				return EVENT_MES_ACTION_TYPING;
			case UNSUBSCRIBE:
				return EVENT_MES_ACTION_UNSUBSCRIBE;
			case GET_SUBSCRIPTION_LIST:
				return EVENT_MES_ACTION_GET_SUBSCRIPTION_LIST;
			case GET_PUBLIC_CONVERSATIONS:
				return EVENT_MES_ACTION_GET_PUBLIC_CONVERSATIONS;
			case ACTION_UNKNOWN:
			default:
				return EVENT_MES_ACTION_UNKNOWN;
		}
	}

	static String convertMessengerEventToString(MessengerEventType eventType) {
		switch (eventType) {
			case IS_READ:
				return EVENT_NAME_MES_READ;
			case ON_CREATE_CONVERSATION:
				return EVENT_NAME_MES_CREATE_CONVERSATION;
			case ON_EDIT_CONVERSATION:
				return EVENT_NAME_MES_EDIT_CONVERSATION;
			case ON_EDIT_MESSAGE:
				return EVENT_NAME_MES_EDIT_MESSAGE;
			case ON_EDIT_USER:
				return EVENT_NAME_MES_EDIT_USER;
			case ON_ERROR:
				return EVENT_NAME_MES_ERROR;
			case ON_GET_CONVERSATION:
				return EVENT_NAME_MES_GET_CONVERSATION;
			case ON_GET_USER:
				return EVENT_NAME_MES_GET_USER;
			case ON_REMOVE_CONVERSATION:
				return EVENT_NAME_MES_REMOVE_CONVERSATION;
			case ON_REMOVE_MESSAGE:
				return EVENT_NAME_MES_REMOVE_MESSAGE;
			case ON_RETRANSMIT_EVENTS:
				return EVENT_NAME_MES_RETRANSMIT_EVENTS;
			case ON_SEND_MESSAGE:
				return EVENT_NAME_MES_SEND_MESSAGE;
			case ON_SET_STATUS:
				return EVENT_NAME_MES_SET_STATUS;
			case ON_SUBSCRIBE:
				return EVENT_NAME_MES_SUBSCRIBE;
			case ON_TYPING:
				return EVENT_NAME_MES_TYPING;
			case ON_UNSUBSCRIBE:
				return EVENT_NAME_MES_UNSUBSCRIBE;
			case ON_GET_SUBSCRIPTION_LIST:
				return EVENT_NAME_MES_GET_SUBSCRIPTION_LIST;
			case ON_GET_PUBLIC_CONVERSATIONS:
				return EVENT_NAME_MES_GET_PUBLIC_CONVERSATIONS;
			case EVENT_UNKNOWN:
			default:
				return EVENT_NAME_MES_UNKNOWN;
		}
	}

	static String convertLogLevel(LogLevel logLevel) {
		switch (logLevel) {
			case ERROR:
				return EVENT_PARAM_LOG_LEVEL_ERROR;
			case WARNING:
				return EVENT_PARAM_LOG_LEVEL_WARNING;
			case INFO:
				return EVENT_PARAM_LOG_LEVEL_INFO;
			case DEBUG:
				return EVENT_PARAM_LOG_LEVEL_DEBUG;
			case VERBOSE:
				return EVENT_PARAM_LOG_LEVEL_VERBOSE;
			default:
				return EVENT_PARAM_LOG_LEVEL_INFO;

		}
	}

	static String convertVideoStreamType(VideoStreamType videoStreamType) {
		switch (videoStreamType) {
			case SCREEN_SHARING:
				return VIDEO_STREAM_TYPE_SCREEN_SHARING;
			case VIDEO:
			default:
				return VIDEO_STREAM_TYPE_VIDEO;
		}
	}

	static AudioFileUsage convertStringToAudioFileUsage(String usage) {
		if (usage == null) {
			return AudioFileUsage.UNKNOWN;
		}
		switch (usage) {
			case IN_CALL:
				return AudioFileUsage.IN_CALL;
			case NOTIFICATION:
				return AudioFileUsage.NOTIFICATION;
			case RINGTONE:
				return AudioFileUsage.RINGTONE;
			case UNKNOWN:
			default:
				return AudioFileUsage.UNKNOWN;
		}
	}
}
