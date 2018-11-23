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
import com.facebook.react.bridge.ReadableType;
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
import com.voximplant.sdk.messaging.IMessage;
import com.voximplant.sdk.messaging.IMessageEvent;
import com.voximplant.sdk.messaging.IMessenger;
import com.voximplant.sdk.messaging.IMessengerEvent;
import com.voximplant.sdk.messaging.IMessengerListener;
import com.voximplant.sdk.messaging.IRetransmitEvent;
import com.voximplant.sdk.messaging.IStatusEvent;
import com.voximplant.sdk.messaging.ISubscriptionEvent;
import com.voximplant.sdk.messaging.IUser;
import com.voximplant.sdk.messaging.IUserEvent;
import com.voximplant.sdk.messaging.MessengerNotifications;
import com.voximplant.sdk.messaging.Payload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.voximplant.reactnative.Constants.EVENT_MES_CREATE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_DELIVERED;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_ERROR;
import static com.voximplant.reactnative.Constants.EVENT_MES_GET_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_GET_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ACTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_WRITE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CODE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATIONS_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION_UUID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CREATED_AT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DESCRIPTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DISTINCT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENT_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_FROM_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_IS_UBER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_SEQ;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_UPDATE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ONLINE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PAYLOAD;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PUBLIC_JOIN;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_SENDER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TEXT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TIMESTAMP;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TITLE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TO_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USERS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_UUID;
import static com.voximplant.reactnative.Constants.EVENT_MES_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_REMOVE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_REMOVE_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_RETRANSMIT_EVENTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SEND_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_SET_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_MES_TYPING;
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

    @ReactMethod
    public void updateConversation(String uuid, boolean isUber, String title, boolean publicJoin, boolean distinct, ReadableMap customData) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, uuid, null, 0, false, null, 0, 0, false, null, 0, isUber);
            conversation.setCustomData(Utils.createObjectMap(customData));
            conversation.setDistinct(distinct);
            conversation.setPublicJoin(publicJoin);
            conversation.setTitle(title);
            conversation.update();
        }
    }

    @ReactMethod
    public void typing(String uuid) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, uuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.typing();
        }
    }

    @ReactMethod
    public void sendMessage(String conversationUuid, String text, ReadableArray payloads) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, conversationUuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.sendMessage(text, convertArrayToPayloadsList(payloads));
        }
    }

    @ReactMethod
    public void updateMessage(String conversationUuid, String uuid, String text, ReadableArray payload) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IMessage message = messenger.recreateMessage(uuid, conversationUuid, null, null, null, 0);
            message.update(text, convertArrayToPayloadsList(payload));
        }
    }

    @ReactMethod
    public void removeMessage(String conversationUuid, String uuid) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IMessage message = messenger.recreateMessage(uuid, conversationUuid, null, null, null, 0);
            message.remove();
        }
    }

    @ReactMethod
    public void markAsDelivered(String conversationUuid, Double sequence) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, conversationUuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.markAsDelivered(sequence.longValue());
        }
    }

    @ReactMethod
    public void markAsRead(String conversationUuid, Double sequence) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, conversationUuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.markAsRead(sequence.longValue());
        }
    }

    @ReactMethod
    public void retransmitEvents(String conversationUuid, Double from, Double to) {
        IMessenger messenger = getMessenger();
        if (messenger != null) {
            IConversation conversation = messenger.recreateConversation(null, conversationUuid, null, 0, false, null, 0, 0, false, null, 0, false);
            conversation.retransmitEvents(from.longValue(), to.longValue());
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
        sendEvent(EVENT_MES_EDIT_MESSAGE, convertMessageEventToMap(messageEvent));
    }

    @Override
    public void onSendMessage(IMessageEvent messageEvent) {
        sendEvent(EVENT_MES_SEND_MESSAGE, convertMessageEventToMap(messageEvent));
    }

    @Override
    public void onRemoveMessage(IMessageEvent messageEvent) {
        sendEvent(EVENT_MES_REMOVE_MESSAGE, convertMessageEventToMap(messageEvent));
    }

    @Override
    public void onTyping(IConversationServiceEvent conversationServiceEvent) {
        sendEvent(EVENT_MES_TYPING, convertConversationServiceEventToMap(conversationServiceEvent));
    }

    @Override
    public void isDelivered(IConversationServiceEvent conversationServiceEvent) {
        sendEvent(EVENT_MES_DELIVERED, convertConversationServiceEventToMap(conversationServiceEvent));
    }

    @Override
    public void isRead(IConversationServiceEvent conversationServiceEvent) {
        sendEvent(EVENT_MES_READ, convertConversationServiceEventToMap(conversationServiceEvent));
    }

    @Override
    public void onError(IErrorEvent errorEvent) {
        sendEvent(EVENT_MES_ERROR, convertErrorEventToMap(errorEvent));
    }

    @Override
    public void onRetransmitEvents(IRetransmitEvent retransmitEvent) {
        sendEvent(EVENT_MES_RETRANSMIT_EVENTS, convertRetransmitEventToMap(retransmitEvent));
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

    private WritableMap convertConversationServiceEventToMap(IConversationServiceEvent conversationServiceEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationServiceEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationServiceEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, conversationServiceEvent.getUserId());
        if (conversationServiceEvent.getSequence() != 0) {
            params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationServiceEvent.getSequence());
        }
        if (conversationServiceEvent.getTimestamp() != 0) {
            params.putDouble(EVENT_MES_PARAM_TIMESTAMP, conversationServiceEvent.getTimestamp());
        }
        params.putString(EVENT_MES_PARAM_CONVERSATION_UUID, conversationServiceEvent.getConversationUUID());
        return params;
    }

    private List<Payload> convertArrayToPayloadsList(ReadableArray array) {
        if (array == null) {
            return null;
        }
        ArrayList<Payload> payloads = new ArrayList<>();
        for (int i = 0; i < array.size(); i++) {
            ReadableType indexType = array.getType(i);
            if (indexType == ReadableType.Map) {
                ReadableMap map = array.getMap(i);
                HashMap<String, Object> payloadMap = map.toHashMap();
                Payload payload = new Payload(payloadMap.get(EVENT_MES_PARAM_DATA), (String)payloadMap.get(EVENT_MES_PARAM_TITLE), (String)payloadMap.get(EVENT_MES_PARAM_TYPE));
                payloads.add(payload);
            }
        }

        return payloads;
    }

    //TODO: check type conversion
    private WritableArray convertPayloadListToArray(List<Payload> payloads) {
        if (payloads == null) {
            return null;
        }
        WritableArray array = Arguments.createArray();
        for (Payload payload : payloads) {
            WritableMap map = Arguments.createMap();
            map.putString(EVENT_MES_PARAM_TITLE, payload.getTitle());
            map.putString(EVENT_MES_PARAM_TYPE, payload.getType());
            Object data = payload.getData();
            if (data instanceof Integer) {
                map.putInt(EVENT_MES_PARAM_DATA, (Integer) data);
            } else if (data instanceof String) {
                map.putString(EVENT_MES_PARAM_DATA, (String) data);
            } else if (data instanceof Double || data instanceof Long) {
                map.putDouble(EVENT_MES_PARAM_DATA, (Double) data);
            } else if (data instanceof Boolean) {
                map.putBoolean(EVENT_MES_PARAM_DATA, (Boolean) data);
            } else if (data instanceof List) {
                map.putArray(EVENT_MES_PARAM_DATA, Utils.createObjectWritableArray((List<Object>) data));
            } else if (data instanceof Map) {
                map.putMap(EVENT_MES_PARAM_DATA, Utils.createObjectWritableMap((Map<Object, Object>) data));
            }
            array.pushMap(map);
        }

        return array;
    }

    private WritableMap convertMessageEventToMap(IMessageEvent messageEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(messageEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(messageEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, messageEvent.getUserId());
        if (messageEvent.getSequence() != 0) {
            params.putDouble(EVENT_MES_PARAM_SEQUENCE, messageEvent.getSequence());
        }
        IMessage message = messageEvent.getMessage();
        if (message != null) {
            WritableMap messageMap = Arguments.createMap();
            if (message.getConversation() != null) {
                messageMap.putString(EVENT_MES_PARAM_CONVERSATION, message.getConversation());
            }
            if (message.getSender() != null) {
                messageMap.putString(EVENT_MES_PARAM_SENDER, message.getSender());
            }
            if (message.getText() != null) {
                messageMap.putString(EVENT_MES_PARAM_TEXT, message.getText());
            }
            if (message.getUUID() != null) {
                messageMap.putString(EVENT_MES_PARAM_UUID, message.getUUID());
            }
            if (message.getSequence() != 0) {
                messageMap.putDouble(EVENT_MES_PARAM_SEQUENCE, message.getSequence());
            }
            if (message.getPayload() != null) {
                messageMap.putArray(EVENT_MES_PARAM_PAYLOAD, convertPayloadListToArray(message.getPayload()));
            }
            params.putMap(EVENT_MES_PARAM_MESSAGE, messageMap);
        }

        return params;
    }

    private WritableMap convertRetransmitEventToMap(IRetransmitEvent retransmitEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(retransmitEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(retransmitEvent.getMessengerAction()));
        params.putString(EVENT_MES_PARAM_USER_ID, retransmitEvent.getUserId());
        params.putDouble(EVENT_MES_PARAM_FROM_SEQUENCE, retransmitEvent.getFromSequence());
        params.putDouble(EVENT_MES_PARAM_TO_SEQUENCE, retransmitEvent.getToSequence());
        if (retransmitEvent.getEvents() != null) {
            WritableArray eventsArray = Arguments.createArray();
            for (IMessengerEvent event : retransmitEvent.getEvents()) {
                if (event instanceof IConversationEvent) {
                    eventsArray.pushMap(convertConversationEventToMap((IConversationEvent) event));
                }
                if (event instanceof IMessageEvent) {
                    eventsArray.pushMap(convertMessageEventToMap((IMessageEvent) event));
                }
            }
            params.putArray(EVENT_MES_PARAM_EVENTS, eventsArray);
        }

        return params;
    }

    private WritableMap convertErrorEventToMap(IErrorEvent errorEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(errorEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(errorEvent.getMessengerAction()));
        if (errorEvent.getUserId() != null) {
            params.putString(EVENT_MES_PARAM_USER_ID, errorEvent.getUserId());
        }
        if (errorEvent.getMessengerException() != null) {
            params.putInt(EVENT_MES_PARAM_CODE, errorEvent.getMessengerException().getErrorCode());
            if (errorEvent.getMessengerException().getMessage() != null) {
                params.putString(EVENT_MES_PARAM_DESCRIPTION, errorEvent.getMessengerException().getMessage());
            }
        }
        return params;
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}