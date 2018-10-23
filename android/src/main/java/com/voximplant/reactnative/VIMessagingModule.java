/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.voximplant.sdk.messaging.IConversationEvent;
import com.voximplant.sdk.messaging.IConversationServiceEvent;
import com.voximplant.sdk.messaging.IErrorEvent;
import com.voximplant.sdk.messaging.IMessageEvent;
import com.voximplant.sdk.messaging.IMessenger;
import com.voximplant.sdk.messaging.IMessengerListener;
import com.voximplant.sdk.messaging.IRetransmitEvent;
import com.voximplant.sdk.messaging.IStatusEvent;
import com.voximplant.sdk.messaging.ISubscriptionEvent;
import com.voximplant.sdk.messaging.IUserEvent;

public class VIMessagingModule extends ReactContextBaseJavaModule implements IMessengerListener {
    private ReactApplicationContext mReactContext;
    private IMessenger mMessenger = null;

    public VIMessagingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "VIMessagingModule";
    }




    @Override
    public void onGetUser(IUserEvent iUserEvent) {

    }

    @Override
    public void onEditUser(IUserEvent iUserEvent) {

    }

    @Override
    public void onSubscribe(ISubscriptionEvent iSubscriptionEvent) {

    }

    @Override
    public void onUnsubscribe(ISubscriptionEvent iSubscriptionEvent) {

    }

    @Override
    public void onCreateConversation(IConversationEvent iConversationEvent) {

    }

    @Override
    public void onRemoveConversation(IConversationEvent iConversationEvent) {

    }

    @Override
    public void onGetConversation(IConversationEvent iConversationEvent) {

    }

    @Override
    public void onEditConversation(IConversationEvent iConversationEvent) {

    }

    @Override
    public void onSetStatus(IStatusEvent iStatusEvent) {

    }

    @Override
    public void onEditMessage(IMessageEvent iMessageEvent) {

    }

    @Override
    public void onSendMessage(IMessageEvent iMessageEvent) {

    }

    @Override
    public void onRemoveMessage(IMessageEvent iMessageEvent) {

    }

    @Override
    public void onTyping(IConversationServiceEvent iConversationServiceEvent) {

    }

    @Override
    public void isDelivered(IConversationServiceEvent iConversationServiceEvent) {

    }

    @Override
    public void isRead(IConversationServiceEvent iConversationServiceEvent) {

    }

    @Override
    public void onError(IErrorEvent iErrorEvent) {

    }

    @Override
    public void onRetransmitEvents(IRetransmitEvent iRetransmitEvent) {

    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}