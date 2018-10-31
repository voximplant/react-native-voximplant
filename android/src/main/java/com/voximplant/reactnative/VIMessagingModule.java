/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.messaging.IConversationEvent;
import com.voximplant.sdk.messaging.IConversationServiceEvent;
import com.voximplant.sdk.messaging.IErrorEvent;
import com.voximplant.sdk.messaging.IMessageEvent;
import com.voximplant.sdk.messaging.IMessenger;
import com.voximplant.sdk.messaging.IMessengerListener;
import com.voximplant.sdk.messaging.IRetransmitEvent;
import com.voximplant.sdk.messaging.IStatusEvent;
import com.voximplant.sdk.messaging.ISubscriptionEvent;
import com.voximplant.sdk.messaging.IUser;
import com.voximplant.sdk.messaging.IUserEvent;
import com.voximplant.sdk.messaging.MessengerNotifications;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ACTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATIONS_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENT_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ONLINE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TIMESTAMP;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USERS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SET_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_MES_UNSUBSCRIBE;

public class VIMessagingModule extends ReactContextBaseJavaModule implements IMessengerListener {
    private ReactApplicationContext mReactContext;
    private boolean mIsListenerAdded;

    public VIMessagingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VIMessagingModule";
    }
    
    @ReactMethod
    public void getUser(String userId) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.getUser(userId);
        }
    }

    @ReactMethod
    public void getUsers(ReadableArray users) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            List<String> usersList;
            try {
                usersList = Utils.createArrayList(users);
            } catch (IllegalArgumentException e) {
                usersList = null;
            }
            messenger.getUsers(usersList);
        }
    }

    @ReactMethod
    public void editUser(ReadableMap customData, ReadableMap privateCustomData) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            Map<Object, Object> customDataMap = Utils.createObjectMap(customData);
            Map<Object, Object> privateCustomDataMap = Utils.createObjectMap(privateCustomData);
            messenger.editUser(customDataMap, privateCustomDataMap);
        }
    }

    @ReactMethod
    public void setStatus(boolean online) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.setStatus(online);
        }
    }

    @ReactMethod
    public void subscribe(ReadableArray users) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            List<String> usersList;
            try {
                usersList = Utils.createArrayList(users);
            } catch (IllegalArgumentException e) {
                usersList = null;
            }
            messenger.subscribe(usersList);
        }
    }

    @ReactMethod
    public void unsubscribe(ReadableArray users) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            List<String> usersList;
            try {
                usersList = Utils.createArrayList(users);
            } catch (IllegalArgumentException e) {
                usersList = null;
            }
            messenger.unSubscribe(usersList);
        }
    }

    @ReactMethod
    public void manageNotifications(ReadableArray notifications) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            ArrayList<MessengerNotifications> list = new ArrayList<>();
            for (int i = 0; i < notifications.size(); i++) {
                list.add(Utils.convertStringToMessengerNotification(notifications.getString(i)));
            }
            messenger.managePushNotifications(list);
        }
    }

    @Override
    public void onGetUser(IUserEvent userEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(userEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(userEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, userEvent.getUserId());
        IUser user = userEvent.getUser();
        WritableMap userParam = Arguments.createMap();
        userParam.putString(EVENT_MES_PARAM_USER_ID, user.getUserId());
        if (user.getCustomData() != null) {
            userParam.putMap(EVENT_MES_PARAM_CUSTOM_DATA, Utils.createObjectWritableMap(user.getCustomData()));
        }
        if (user.getPrivateCustomData() != null) {
            userParam.putMap(EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA, Utils.createObjectWritableMap(user.getPrivateCustomData()));
        }
        if (user.getConversationsList() != null) {
            userParam.putArray(EVENT_MES_PARAM_CONVERSATIONS_LIST, Utils.createWritableArray(user.getConversationsList()));
        }
        if (user.getMessengerNotifications() != null) {
            WritableArray notifications = Arguments.createArray();
            for (MessengerNotifications notification : user.getMessengerNotifications()) {
                notifications.pushString(Utils.convertMessengerNotificationsToString(notification));
            }
            userParam.putArray(EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS, notifications);
        }
        params.putMap(EVENT_MES_PARAM_USER, userParam);
        sendEvent(EVENT_MES_GET_USER, params);
    }

    @Override
    public void onEditUser(IUserEvent userEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(userEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(userEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, userEvent.getUserId());
        IUser user = userEvent.getUser();
        WritableMap userParam = Arguments.createMap();
        userParam.putString(EVENT_MES_PARAM_USER_ID, user.getUserId());
        if (user.getCustomData() != null) {
            userParam.putMap(EVENT_MES_PARAM_CUSTOM_DATA, Utils.createObjectWritableMap(user.getCustomData()));
        }
        if (user.getPrivateCustomData() != null) {
            userParam.putMap(EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA, Utils.createObjectWritableMap(user.getPrivateCustomData()));
        }
        if (user.getConversationsList() != null) {
            userParam.putArray(EVENT_MES_PARAM_CONVERSATIONS_LIST, Utils.createWritableArray(user.getConversationsList()));
        }
        if (user.getMessengerNotifications() != null) {
            WritableArray notifications = Arguments.createArray();
            for (MessengerNotifications notification : user.getMessengerNotifications()) {
                notifications.pushString(Utils.convertMessengerNotificationsToString(notification));
            }
            userParam.putArray(EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS, notifications);
        }
        params.putMap(EVENT_MES_PARAM_USER, userParam);
        sendEvent(EVENT_MES_EDIT_USER, params);
    }

    @Override
    public void onSubscribe(ISubscriptionEvent subscriptionEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(subscriptionEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(subscriptionEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, subscriptionEvent.getUserId());
        WritableArray users = Utils.createWritableArray(subscriptionEvent.getUsers());
        params.putArray(EVENT_MES_PARAM_USERS, users);
        sendEvent(EVENT_MES_SUBSCRIBE, params);
    }

    @Override
    public void onUnsubscribe(ISubscriptionEvent subscriptionEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(subscriptionEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(subscriptionEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, subscriptionEvent.getUserId());
        WritableArray users = Utils.createWritableArray(subscriptionEvent.getUsers());
        params.putArray(EVENT_MES_PARAM_USERS, users);
        sendEvent(EVENT_MES_UNSUBSCRIBE, params);
    }

    @Override
    public void onCreateConversation(IConversationEvent conversationEvent) {

    }

    @Override
    public void onRemoveConversation(IConversationEvent conversationEvent) {

    }

    @Override
    public void onGetConversation(IConversationEvent conversationEvent) {

    }

    @Override
    public void onEditConversation(IConversationEvent conversationEvent) {

    }

    @Override
    public void onSetStatus(IStatusEvent statusEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(statusEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(statusEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, statusEvent.getUserId());
        WritableMap statusParams = Arguments.createMap();
        statusParams.putBoolean(EVENT_MES_PARAM_ONLINE, statusEvent.getUserStatus().isOnline());
        statusParams.putDouble(EVENT_MES_PARAM_TIMESTAMP, (double) statusEvent.getUserStatus().getTimestamp());
        params.putMap(EVENT_MES_PARAM_USER_STATUS, statusParams);
        sendEvent(EVENT_MES_SET_STATUS, params);
    }

    @Override
    public void onEditMessage(IMessageEvent messageEvent) {

    }

    @Override
    public void onSendMessage(IMessageEvent messageEvent) {

    }

    @Override
    public void onRemoveMessage(IMessageEvent messageEvent) {

    }

    @Override
    public void onTyping(IConversationServiceEvent conversationServiceEvent) {

    }

    @Override
    public void isDelivered(IConversationServiceEvent conversationServiceEvent) {

    }

    @Override
    public void isRead(IConversationServiceEvent conversationServiceEvent) {

    }

    @Override
    public void onError(IErrorEvent errorEvent) {

    }

    @Override
    public void onRetransmitEvents(IRetransmitEvent retransmitEvent) {

    }

    private IMessenger getMessenger() {
        IMessenger messenger = Voximplant.getMessenger();
        if (!mIsListenerAdded) {
            messenger.addMessengerListener(this);
            mIsListenerAdded = true;
        }
        return messenger;
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}