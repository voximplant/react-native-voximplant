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

import java.util.List;

import static com.voximplant.reactnative.Constants.EVENT_MES_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ACTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATIONS_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENT_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ONLINE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TIMESTAMP;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SET_STATUS;

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
    public void setStatus(boolean online) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.setStatus(online);
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
        WritableArray conversationList = Arguments.createArray();
        for (String conversation : user.getConversationsList()) {
            conversationList.pushString(conversation);
        }
        userParam.putArray(EVENT_MES_PARAM_CONVERSATIONS_LIST, conversationList);
        params.putMap(EVENT_MES_PARAM_USER, userParam);
        sendEvent(EVENT_MES_GET_USER, params);
    }

    @Override
    public void onEditUser(IUserEvent userEvent) {

    }

    @Override
    public void onSubscribe(ISubscriptionEvent subscriptionEvent) {

    }

    @Override
    public void onUnsubscribe(ISubscriptionEvent subscriptionEvent) {

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