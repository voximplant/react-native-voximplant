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
import com.voximplant.sdk.messaging.ConversationConfig;
import com.voximplant.sdk.messaging.ConversationParticipant;
import com.voximplant.sdk.messaging.IConversation;
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

import static com.voximplant.reactnative.Constants.EVENT_MES_CREATE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_GET_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ACTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_WRITE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATIONS_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CREATED_AT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DISTINCT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENT_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_IS_UBER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_SEQ;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_UPDATE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ONLINE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PUBLIC_JOIN;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TIMESTAMP;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TITLE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USERS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_UUID;
import static com.voximplant.reactnative.Constants.EVENT_MES_REMOVE_CONVERSATION;
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

    @ReactMethod
    public void createConversation(ReadableArray participants, String title, boolean distinct, boolean publicJoin,
                                   ReadableMap customData, boolean isUber) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            ConversationConfig conversationConfig = ConversationConfig.createBuilder()
                    .setTitle(title)
                    .setDistinct(distinct)
                    .setEnablePublicJoin(publicJoin)
                    .setCustomData(Utils.createObjectMap(customData))
                    .setUberConversation(isUber)
                    .build();
            messenger.createConversation(convertArrayToConversationParticipantList(participants), conversationConfig);
        }
    }

    @ReactMethod
    public void getConversation(String uuid) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.getConversation(uuid);
        }
    }

    @ReactMethod
    public void getConversations(ReadableArray conversations) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.getConversations(Utils.createArrayList(conversations));
        }
    }

    @ReactMethod
    public void removeConversation(String uuid) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            messenger.removeConversation(uuid);
        }
    }

    @ReactMethod
    public void addParticipants(String uuid, ReadableArray participants) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, uuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.addParticipants(convertArrayToConversationParticipantList(participants));
        }
    }

    @ReactMethod
    public void editParticipants(String uuid, ReadableArray participants) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, uuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.editParticipants(convertArrayToConversationParticipantList(participants));
        }
    }

    @ReactMethod
    public void removeParticipants(String uuid, ReadableArray participants) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, uuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.removeParticipants(convertArrayToConversationParticipantList(participants));
        }
    }

    @Override
    public void onGetUser(IUserEvent userEvent) {
        sendEvent(EVENT_MES_GET_USER, convertUserEventToMap(userEvent));
    }

    @Override
    public void onEditUser(IUserEvent userEvent) {
        sendEvent(EVENT_MES_EDIT_USER, convertUserEventToMap(userEvent));
    }

    @Override
    public void onSubscribe(ISubscriptionEvent subscriptionEvent) {
        sendEvent(EVENT_MES_SUBSCRIBE, convertSubscriptionEventToMap(subscriptionEvent));
    }

    @Override
    public void onUnsubscribe(ISubscriptionEvent subscriptionEvent) {
        sendEvent(EVENT_MES_UNSUBSCRIBE, convertSubscriptionEventToMap(subscriptionEvent));
    }

    @Override
    public void onCreateConversation(IConversationEvent conversationEvent) {
        sendEvent(EVENT_MES_CREATE_CONVERSATION, convertConversationEventToMap(conversationEvent));
    }

    @Override
    public void onRemoveConversation(IConversationEvent conversationEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, conversationEvent.getUserId());
        params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationEvent.getSequence());
        WritableMap conversation = Arguments.createMap();
        conversation.putString(EVENT_MES_PARAM_UUID, conversationEvent.getConversation().getUUID());
        params.putMap(EVENT_MES_PARAM_CONVERSATION, conversation);
        sendEvent(EVENT_MES_REMOVE_CONVERSATION, params);
    }

    @Override
    public void onGetConversation(IConversationEvent conversationEvent) {
        sendEvent(EVENT_MES_GET_CONVERSATION, convertConversationEventToMap(conversationEvent));
    }

    @Override
    public void onEditConversation(IConversationEvent conversationEvent) {
        sendEvent(EVENT_MES_EDIT_CONVERSATION, convertConversationEventToMap(conversationEvent));
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


    private List<ConversationParticipant> convertArrayToConversationParticipantList(ReadableArray participantsArray) {
        List<ConversationParticipant> conversationParticipants = new ArrayList<>();
        for (int i = 0; i < participantsArray.size(); i++) {
            ReadableMap participant = participantsArray.getMap(i);
            ConversationParticipant conversationParticipant = null;
            if (participant != null && participant.hasKey(EVENT_MES_PARAM_USER_ID)
                    && participant.hasKey(EVENT_MES_PARAM_CAN_WRITE) && participant.hasKey(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS)) {
                conversationParticipant = new ConversationParticipant(participant.getString(EVENT_MES_PARAM_USER_ID),
                        participant.getBoolean(EVENT_MES_PARAM_CAN_WRITE), participant.getBoolean(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS));
            }
            if (conversationParticipant != null) {
                conversationParticipants.add(conversationParticipant);
            }
        }
        return conversationParticipants;
    }

    private WritableMap convertConversationParticipantToMap(ConversationParticipant participant) {
        if (participant == null) {
            return null;
        }
        WritableMap map = Arguments.createMap();
        map.putString(EVENT_MES_PARAM_USER_ID, participant.getUserId());
        map.putBoolean(EVENT_MES_PARAM_CAN_WRITE, participant.canWrite());
        map.putBoolean(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS, participant.canManageParticipants());
        return map;
    }

    private WritableMap convertConversationEventToMap(IConversationEvent conversationEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, conversationEvent.getUserId());
        params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationEvent.getSequence());
        IConversation conversation = conversationEvent.getConversation();
        if (conversation != null) {
            WritableMap conversationMap = Arguments.createMap();
            if (conversation.getUUID() != null) {
                conversationMap.putString(EVENT_MES_PARAM_UUID, conversation.getUUID());
            }
            if (conversation.getTitle() != null) {
                conversationMap.putString(EVENT_MES_PARAM_TITLE, conversation.getTitle());
            }
            if (conversation.getCustomData() != null) {
                conversationMap.putMap(EVENT_MES_PARAM_CUSTOM_DATA, Utils.createObjectWritableMap(conversation.getCustomData()));
            }
            if (conversation.getParticipants() != null) {
                WritableArray array = Arguments.createArray();
                for (ConversationParticipant participant : conversation.getParticipants()) {
                    array.pushMap(convertConversationParticipantToMap(participant));
                }
                conversationMap.putArray(EVENT_MES_PARAM_PARTICIPANTS, array);
            }
            conversationMap.putDouble(EVENT_MES_PARAM_CREATED_AT, conversation.getCreatedTime());
            conversationMap.putDouble(EVENT_MES_PARAM_LAST_READ, conversation.getLastRead());
            conversationMap.putDouble(EVENT_MES_PARAM_LAST_SEQ, conversation.getLastSequence());
            conversationMap.putDouble(EVENT_MES_PARAM_LAST_UPDATE, conversation.getLastUpdateTime());
            conversationMap.putBoolean(EVENT_MES_PARAM_DISTINCT, conversation.isDistinct());
            conversationMap.putBoolean(EVENT_MES_PARAM_PUBLIC_JOIN, conversation.isPublicJoin());
            conversationMap.putBoolean(EVENT_MES_PARAM_IS_UBER, conversation.isUberConversation());

            params.putMap(EVENT_MES_PARAM_CONVERSATION, conversationMap);
        }
        return params;
    }

    private WritableMap convertUserEventToMap(IUserEvent userEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(userEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(userEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, userEvent.getUserId());
        IUser user = userEvent.getUser();
        if (user != null) {
            WritableMap userMap = Arguments.createMap();
            userMap.putString(EVENT_MES_PARAM_USER_ID, user.getUserId());
            if (user.getCustomData() != null) {
                userMap.putMap(EVENT_MES_PARAM_CUSTOM_DATA, Utils.createObjectWritableMap(user.getCustomData()));
            }
            if (user.getPrivateCustomData() != null) {
                userMap.putMap(EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA, Utils.createObjectWritableMap(user.getPrivateCustomData()));
            }
            if (user.getConversationsList() != null) {
                userMap.putArray(EVENT_MES_PARAM_CONVERSATIONS_LIST, Utils.createWritableArray(user.getConversationsList()));
            }
            if (user.getMessengerNotifications() != null) {
                WritableArray notifications = Arguments.createArray();
                for (MessengerNotifications notification : user.getMessengerNotifications()) {
                    notifications.pushString(Utils.convertMessengerNotificationsToString(notification));
                }
                userMap.putArray(EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS, notifications);
            }
            params.putMap(EVENT_MES_PARAM_USER, userMap);
        }
        return params;
    }

    private WritableMap convertSubscriptionEventToMap(ISubscriptionEvent subscriptionEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(subscriptionEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(subscriptionEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, subscriptionEvent.getUserId());
        List<String> users = subscriptionEvent.getUsers();
        if (users != null) {
            WritableArray usersArray = Utils.createWritableArray(users);
            params.putArray(EVENT_MES_PARAM_USERS, usersArray);
        }
        return params;
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}