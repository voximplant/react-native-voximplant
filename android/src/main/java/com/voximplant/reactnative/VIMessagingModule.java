/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.reactnative;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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
import com.voximplant.sdk.messaging.IConversationListEvent;
import com.voximplant.sdk.messaging.IConversationServiceEvent;
import com.voximplant.sdk.messaging.IErrorEvent;
import com.voximplant.sdk.messaging.IMessage;
import com.voximplant.sdk.messaging.IMessageEvent;
import com.voximplant.sdk.messaging.IMessenger;
import com.voximplant.sdk.messaging.IMessengerCompletionHandler;
import com.voximplant.sdk.messaging.IMessengerEvent;
import com.voximplant.sdk.messaging.IMessengerListener;
import com.voximplant.sdk.messaging.IRetransmitEvent;
import com.voximplant.sdk.messaging.IStatusEvent;
import com.voximplant.sdk.messaging.ISubscriptionEvent;
import com.voximplant.sdk.messaging.IUser;
import com.voximplant.sdk.messaging.IUserEvent;
import com.voximplant.sdk.messaging.MessengerAction;
import com.voximplant.sdk.messaging.MessengerNotification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.voximplant.reactnative.Constants.EVENT_MES_CREATE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_EDIT_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ACTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_EDIT_ALL_MESSAGES;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_EDIT_MESSAGES;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_REMOVE_ALL_MESSAGES;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_REMOVE_MESSAGES;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CAN_WRITE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CODE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CONVERSATION_UUID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CREATED_TIME;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DESCRIPTION;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DIRECT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_DISPLAY_NAME;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_EVENT_TYPE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_FROM_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_IM_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_IM_USER_ID;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_IS_DELETED;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_SEQENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LAST_UPDATE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_LEAVE_CONVERSATION_LIST;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_ONLINE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_OWNER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PARTICIPANTS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PAYLOAD;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_PUBLIC_JOIN;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TEXT;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TIMESTAMP;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TITLE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_TO_SEQUENCE;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_UBER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USERS;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_USER_NAME;
import static com.voximplant.reactnative.Constants.EVENT_MES_PARAM_UUID;
import static com.voximplant.reactnative.Constants.EVENT_MES_READ;
import static com.voximplant.reactnative.Constants.EVENT_MES_REMOVE_CONVERSATION;
import static com.voximplant.reactnative.Constants.EVENT_MES_REMOVE_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_SEND_MESSAGE;
import static com.voximplant.reactnative.Constants.EVENT_MES_SET_STATUS;
import static com.voximplant.reactnative.Constants.EVENT_MES_SUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_MES_TYPING;
import static com.voximplant.reactnative.Constants.EVENT_MES_UNSUBSCRIBE;
import static com.voximplant.reactnative.Constants.EVENT_NAME_MES_ERROR;
import static com.voximplant.reactnative.Constants.INVALID_ARGUMENTS_ERROR;

public class VIMessagingModule extends ReactContextBaseJavaModule implements IMessengerListener {
    private ReactApplicationContext mReactContext;
    private IMessenger mMessenger = Voximplant.getMessenger();

    public VIMessagingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;

        mMessenger.addMessengerListener(this);
    }

    @Override
    public String getName() {
        return "VIMessagingModule";
    }
    
    @ReactMethod
    public void getUserByName(String username, Callback callback) {
        mMessenger.getUser(username, new IMessengerCompletionHandler<IUserEvent>() {
            @Override
            public void onSuccess(IUserEvent userEvent) {
                WritableMap user = convertUserEventToMap(userEvent);
                callback.invoke(user, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getUserById(Double imUserId, Callback callback) {
        if (imUserId == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.GET_USER);
            callback.invoke(null, error);
            return;
        }
        mMessenger.getUser(imUserId.longValue(), new IMessengerCompletionHandler<IUserEvent>() {
            @Override
            public void onSuccess(IUserEvent userEvent) {
                WritableMap user = convertUserEventToMap(userEvent);
                callback.invoke(user, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getUsersByName(ReadableArray users, Callback callback) {
        List<String> usersList;
        try {
            usersList = Utils.createStringArrayList(users);
        } catch (IllegalArgumentException e) {
            usersList = null;
        }
        mMessenger.getUsersByName(usersList, new IMessengerCompletionHandler<List<IUserEvent>>() {
            @Override
            public void onSuccess(List<IUserEvent> userEvents) {
                WritableArray userEventsArray = Arguments.createArray();
                for (IUserEvent userEvent : userEvents) {
                    userEventsArray.pushMap(convertUserEventToMap(userEvent));
                }
                callback.invoke(userEventsArray, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getUsersById(ReadableArray users, Callback callback) {
        List<Long> usersList;
        try {
            usersList = Utils.createLongArrayList(users);
        } catch (IllegalArgumentException e) {
            usersList = null;
        }
        mMessenger.getUsersByIMId(usersList, new IMessengerCompletionHandler<List<IUserEvent>>() {
            @Override
            public void onSuccess(List<IUserEvent> userEvents) {
                WritableArray userEventsArray = Arguments.createArray();
                for (IUserEvent userEvent : userEvents) {
                    userEventsArray.pushMap(convertUserEventToMap(userEvent));
                }
                callback.invoke(userEventsArray, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void editUser(ReadableMap customData, ReadableMap privateCustomData, Callback callback) {
        Map<String, Object> customDataMap = Utils.createObjectMap(customData);
        Map<String, Object> privateCustomDataMap = Utils.createObjectMap(privateCustomData);
        mMessenger.editUser(customDataMap, privateCustomDataMap, new IMessengerCompletionHandler<IUserEvent>() {
            @Override
            public void onSuccess(IUserEvent userEvent) {
                WritableMap user = convertUserEventToMap(userEvent);
                callback.invoke(user, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void setStatus(Boolean online, Callback callback) {
        if (online == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.SET_STATUS);
            callback.invoke(null, error);
            return;
        }
        mMessenger.setStatus(online, new IMessengerCompletionHandler<IStatusEvent>() {
            @Override
            public void onSuccess(IStatusEvent statusEvent) {
                WritableMap status = convertStatusEventToMap(statusEvent);
                callback.invoke(status, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void subscribe(ReadableArray users, Callback callback) {
        List<Long> usersList;
        try {
            usersList = Utils.createLongArrayList(users);
        } catch (IllegalArgumentException e) {
            usersList = null;
        }
        mMessenger.subscribe(usersList, new IMessengerCompletionHandler<ISubscriptionEvent>() {
            @Override
            public void onSuccess(ISubscriptionEvent subscriptionEvent) {
                WritableMap subscription = convertSubscriptionEventToMap(subscriptionEvent);
                callback.invoke(subscription, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void unsubscribe(ReadableArray users, Callback callback) {
        List<Long> usersList;
        try {
            usersList = Utils.createLongArrayList(users);
        } catch (IllegalArgumentException e) {
            usersList = null;
        }
        mMessenger.unsubscribe(usersList, new IMessengerCompletionHandler<ISubscriptionEvent>() {
            @Override
            public void onSuccess(ISubscriptionEvent subscriptionEvent) {
                WritableMap subscription = convertSubscriptionEventToMap(subscriptionEvent);
                callback.invoke(subscription, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void unsubscribeFromAll(Callback callback) {
        mMessenger.unsubscribeFromAll(new IMessengerCompletionHandler<ISubscriptionEvent>() {
            @Override
            public void onSuccess(ISubscriptionEvent subscriptionEvent) {
                WritableMap subscription = convertSubscriptionEventToMap(subscriptionEvent);
                callback.invoke(subscription, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getSubscriptions(Callback callback) {
        mMessenger.getSubscriptionList(new IMessengerCompletionHandler<ISubscriptionEvent>() {
            @Override
            public void onSuccess(ISubscriptionEvent subscriptionEvent) {
                WritableMap subscription = convertSubscriptionEventToMap(subscriptionEvent);
                callback.invoke(subscription, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void manageNotifications(ReadableArray notifications, Callback callback) {
        List<MessengerNotification> list = Utils.convertArrayToMessengerNotifications(notifications);
        mMessenger.managePushNotifications(list, new IMessengerCompletionHandler<IUserEvent>() {
            @Override
            public void onSuccess(IUserEvent userEvent) {
                WritableMap user = convertUserEventToMap(userEvent);
                callback.invoke(user, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void createConversation(ReadableMap config, Callback callback) {
        ConversationConfig conversationConfig;
        if (config == null) {
            conversationConfig = null;
        } else {
            ConversationConfig.ConversationConfigBuilder builder = ConversationConfig.createBuilder();
            if (config.hasKey(EVENT_MES_PARAM_TITLE)) {
                builder.setTitle(config.getString(EVENT_MES_PARAM_TITLE));
            }
            if (config.hasKey(EVENT_MES_PARAM_DIRECT)) {
                builder.setDirect(config.getBoolean(EVENT_MES_PARAM_DIRECT));
            }
            if (config.hasKey(EVENT_MES_PARAM_PUBLIC_JOIN)) {
                builder.setPublicJoin(config.getBoolean(EVENT_MES_PARAM_PUBLIC_JOIN));
            }
            if (config.hasKey(EVENT_MES_PARAM_UBER)) {
                builder.setUber(config.getBoolean(EVENT_MES_PARAM_UBER));
            }
            if (config.hasKey(EVENT_MES_PARAM_CUSTOM_DATA)) {
                Map<String, Object> customData = Utils.createObjectMap(config.getMap(EVENT_MES_PARAM_CUSTOM_DATA));
                builder.setCustomData(customData);
            }
            if (config.hasKey(EVENT_MES_PARAM_PARTICIPANTS)) {
                List<ConversationParticipant> participants = convertArrayToConversationParticipantList(config.getArray(EVENT_MES_PARAM_PARTICIPANTS));
                builder.setParticipants(participants);
            }
            conversationConfig = builder.build();
        }
        mMessenger.createConversation(conversationConfig, new IMessengerCompletionHandler<IConversationEvent>() {
            @Override
            public void onSuccess(IConversationEvent conversationEvent) {
                WritableMap conversation = convertConversationEventToMap(conversationEvent);
                callback.invoke(conversation, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getConversation(String uuid, Callback callback) {
        mMessenger.getConversation(uuid, new IMessengerCompletionHandler<IConversationEvent>() {
            @Override
            public void onSuccess(IConversationEvent conversationEvent) {
                WritableMap conversation = convertConversationEventToMap(conversationEvent);
                callback.invoke(conversation, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getConversations(ReadableArray conversations, Callback callback) {
        mMessenger.getConversations(Utils.createStringArrayList(conversations), new IMessengerCompletionHandler<List<IConversationEvent>>() {
            @Override
            public void onSuccess(List<IConversationEvent> conversationEvents) {
                WritableArray conversations = Arguments.createArray();
                for (IConversationEvent event : conversationEvents) {
                    WritableMap conversation = convertConversationEventToMap(event);
                    conversations.pushMap(conversation);
                }
                callback.invoke(conversations, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void getPublicConversations(Callback callback) {
        mMessenger.getPublicConversations(new IMessengerCompletionHandler<IConversationListEvent>() {
            @Override
            public void onSuccess(IConversationListEvent conversationListEvent) {
                WritableMap conversationList = convertConversationListEventToMap(conversationListEvent);
                callback.invoke(conversationList, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void addParticipants(String uuid, ReadableArray participants, Callback callback) {
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(),
                uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.addParticipants(convertArrayToConversationParticipantList(participants), new IMessengerCompletionHandler<IConversationEvent>() {
                @Override
                public void onSuccess(IConversationEvent conversationEvent) {
                    WritableMap conversation = convertConversationEventToMap(conversationEvent);
                    callback.invoke(conversation, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.ADD_PARTICIPANTS);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void editParticipants(String uuid, ReadableArray participants, Callback callback) {
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(),
                uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.editParticipants(convertArrayToConversationParticipantList(participants), new IMessengerCompletionHandler<IConversationEvent>() {
                @Override
                public void onSuccess(IConversationEvent conversationEvent) {
                    WritableMap conversation = convertConversationEventToMap(conversationEvent);
                    callback.invoke(conversation, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.EDIT_PARTICIPANTS);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void removeParticipants(String uuid, ReadableArray participants, Callback callback) {
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(),
                uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.removeParticipants(convertArrayToConversationParticipantList(participants), new IMessengerCompletionHandler<IConversationEvent>() {
                @Override
                public void onSuccess(IConversationEvent conversationEvent) {
                    WritableMap conversation = convertConversationEventToMap(conversationEvent);
                    callback.invoke(conversation, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.REMOVE_PARTICIPANTS);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void updateConversation(String uuid, String title, Boolean publicJoin,
                                   ReadableMap customData, Boolean isUber, Boolean direct, Callback callback) {
        ConversationConfig.ConversationConfigBuilder builder = ConversationConfig.createBuilder();
        builder.setTitle(title);
        builder.setCustomData(Utils.createObjectMap(customData));
        if (publicJoin != null) {
            builder.setPublicJoin(publicJoin);
        }
        if (isUber != null) {
            builder.setUber(isUber);
        }
        if (direct != null) {
            builder.setDirect(direct);
        }

        IConversation conversation = mMessenger.recreateConversation(builder.build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.update(new IMessengerCompletionHandler<IConversationEvent>() {
                @Override
                public void onSuccess(IConversationEvent conversationEvent) {
                    WritableMap conversation = convertConversationEventToMap(conversationEvent);
                    callback.invoke(conversation, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.EDIT_CONVERSATION);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void typing(String uuid, Callback callback) {
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.typing(new IMessengerCompletionHandler<IConversationServiceEvent>() {
                @Override
                public void onSuccess(IConversationServiceEvent conversationServiceEvent) {
                    WritableMap event = convertConversationServiceEventToMap(conversationServiceEvent);
                    callback.invoke(event, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.TYPING_MESSAGE);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void markAsRead(String uuid, Double sequence, Callback callback) {
        if (sequence == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.IS_READ);
            callback.invoke(null, error);
            return;
        }
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.markAsRead(sequence.longValue(), new IMessengerCompletionHandler<IConversationServiceEvent>() {
                @Override
                public void onSuccess(IConversationServiceEvent conversationServiceEvent) {
                    WritableMap event = convertConversationServiceEventToMap(conversationServiceEvent);
                    callback.invoke(event, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.IS_READ);
            callback.invoke(null, error);
        }
    }


    @ReactMethod
    public void sendMessage(String conversationUuid, String text, ReadableArray payloads, Callback callback) {
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), conversationUuid, 0, 0, 0);
        if (conversation != null) {
            List<Map<String, Object>> payload = Utils.createObjectMapList(payloads);
            conversation.sendMessage(text, payload, new IMessengerCompletionHandler<IMessageEvent>() {
                @Override
                public void onSuccess(IMessageEvent messageEvent) {
                    WritableMap event = convertMessageEventToMap(messageEvent);
                    callback.invoke(event, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.SEND_MESSAGE);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void updateMessage(String conversationUuid, String uuid, String text, ReadableArray payload, Callback callback) {
        IMessage message = mMessenger.recreateMessage(uuid, conversationUuid, text, Utils.createObjectMapList(payload), 0);
        if (message != null) {
            message.update(text, Utils.createObjectMapList(payload), new IMessengerCompletionHandler<IMessageEvent>() {
                @Override
                public void onSuccess(IMessageEvent messageEvent) {
                    WritableMap event = convertMessageEventToMap(messageEvent);
                    callback.invoke(event, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.EDIT_MESSAGE);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void removeMessage(String conversationUuid, String uuid, Callback callback) {
        IMessage message = mMessenger.recreateMessage(uuid, conversationUuid, null, null, 0);
        if (message != null) {
            message.remove(new IMessengerCompletionHandler<IMessageEvent>() {
                @Override
                public void onSuccess(IMessageEvent messageEvent) {
                    WritableMap event = convertMessageEventToMap(messageEvent);
                    callback.invoke(event, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.REMOVE_MESSAGE);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void leaveConversation(String uuid, Callback callback) {
        mMessenger.leaveConversation(uuid, new IMessengerCompletionHandler<IConversationEvent>() {
            @Override
            public void onSuccess(IConversationEvent conversationEvent) {
                WritableMap conversation = convertConversationEventToMap(conversationEvent);
                callback.invoke(conversation, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }

    @ReactMethod
    public void joinConversation(String uuid, Callback callback) {
        mMessenger.joinConversation(uuid, new IMessengerCompletionHandler<IConversationEvent>() {
            @Override
            public void onSuccess(IConversationEvent conversationEvent) {
                WritableMap conversation = convertConversationEventToMap(conversationEvent);
                callback.invoke(conversation, null);
            }

            @Override
            public void onError(IErrorEvent errorEvent) {
                WritableMap error = convertErrorEventToMap(errorEvent);
                callback.invoke(null, error);
            }
        });
    }



    @ReactMethod
    public void retransmitEvents(String uuid, Double from, Double to, Callback callback) {
        if (from == null || to == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
            return;
        }
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.retransmitEvents(from.longValue(), to.longValue(), new IMessengerCompletionHandler<IRetransmitEvent>() {
                @Override
                public void onSuccess(IRetransmitEvent retransmitEvent) {
                    WritableMap events = convertRetransmitEventToMap(retransmitEvent);
                    callback.invoke(events, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void retransmitEventsFrom(String uuid, Double from, Double count, Callback callback) {
        if (from == null || count == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
            return;
        }
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.retransmitEventsFrom(from.longValue(), count.intValue(), new IMessengerCompletionHandler<IRetransmitEvent>() {
                @Override
                public void onSuccess(IRetransmitEvent retransmitEvent) {
                    WritableMap events = convertRetransmitEventToMap(retransmitEvent);
                    callback.invoke(events, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
        }
    }

    @ReactMethod
    public void retransmitEventsTo(String uuid, Double to, Double count, Callback callback) {
        if (to == null || count == null) {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
            return;
        }
        IConversation conversation = mMessenger.recreateConversation(ConversationConfig.createBuilder().build(), uuid, 0, 0, 0);
        if (conversation != null) {
            conversation.retransmitEventsTo(to.longValue(), count.intValue(), new IMessengerCompletionHandler<IRetransmitEvent>() {
                @Override
                public void onSuccess(IRetransmitEvent retransmitEvent) {
                    WritableMap events = convertRetransmitEventToMap(retransmitEvent);
                    callback.invoke(events, null);
                }

                @Override
                public void onError(IErrorEvent errorEvent) {
                    WritableMap error = convertErrorEventToMap(errorEvent);
                    callback.invoke(null, error);
                }
            });
        } else {
            WritableMap error = createErrorEventMapInvalidArguments(MessengerAction.RETRANSMIT_EVENTS);
            callback.invoke(null, error);
        }
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
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, conversationEvent.getIMUserId());
        params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationEvent.getSequence());
        IConversation conversation = conversationEvent.getConversation();
        if (conversation != null) {
            WritableMap conversationMap = Arguments.createMap();
            conversationMap.putString(EVENT_MES_PARAM_UUID, conversation.getUUID());
            params.putMap(EVENT_MES_PARAM_CONVERSATION, conversationMap);
        }
        sendEvent(EVENT_MES_REMOVE_CONVERSATION, params);
    }

    @Override
    public void onEditConversation(IConversationEvent conversationEvent) {
        sendEvent(EVENT_MES_EDIT_CONVERSATION, convertConversationEventToMap(conversationEvent));
    }

    @Override
    public void onSetStatus(IStatusEvent statusEvent) {
        sendEvent(EVENT_MES_SET_STATUS, convertStatusEventToMap(statusEvent));
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
    public void isRead(IConversationServiceEvent conversationServiceEvent) {
        sendEvent(EVENT_MES_READ, convertConversationServiceEventToMap(conversationServiceEvent));
    }

    @Override
    public void onGetUser(IUserEvent userEvent) { }

    @Override
    public void onGetSubscriptionList(ISubscriptionEvent iSubscriptionEvent) { }

    @Override
    public void onGetConversation(IConversationEvent conversationEvent) { }

    @Override
    public void onGetPublicConversations(IConversationListEvent iConversationListEvent) { }

    @Override
    public void onError(IErrorEvent errorEvent) { }

    @Override
    public void onRetransmitEvents(IRetransmitEvent retransmitEvent) { }

    private List<ConversationParticipant> convertArrayToConversationParticipantList(ReadableArray array) {
        if (array == null) {
            return null;
        }
        List<ConversationParticipant> participants = new ArrayList<>();
        for (int i = 0; i < array.size(); i++) {
            ReadableMap map = array.getMap(i);
            ConversationParticipant participant = null;
            if (map.hasKey(EVENT_MES_PARAM_IM_USER_ID)) {
                participant = new ConversationParticipant((long)map.getDouble(EVENT_MES_PARAM_IM_USER_ID));
                if (map.hasKey(EVENT_MES_PARAM_CAN_WRITE)) {
                    participant.setCanWrite(map.getBoolean(EVENT_MES_PARAM_CAN_WRITE));
                }
                if (map.hasKey(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS)) {
                    participant.setCanManageParticipants(map.getBoolean(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS));
                }
                if (map.hasKey(EVENT_MES_PARAM_CAN_EDIT_MESSAGES)) {
                    participant.setCanEditMessages(map.getBoolean(EVENT_MES_PARAM_CAN_EDIT_MESSAGES));
                }
                if (map.hasKey(EVENT_MES_PARAM_CAN_EDIT_ALL_MESSAGES)) {
                    participant.setCanEditAllMessages(map.getBoolean(EVENT_MES_PARAM_CAN_EDIT_ALL_MESSAGES));
                }
                if (map.hasKey(EVENT_MES_PARAM_CAN_REMOVE_MESSAGES)) {
                    participant.setCanRemoveMessages(map.getBoolean(EVENT_MES_PARAM_CAN_REMOVE_MESSAGES));
                }
                if (map.hasKey(EVENT_MES_PARAM_CAN_REMOVE_ALL_MESSAGES)) {
                    participant.setCanRemoveAllMessages(map.getBoolean(EVENT_MES_PARAM_CAN_REMOVE_ALL_MESSAGES));
                }
                if (map.hasKey(EVENT_MES_PARAM_OWNER)) {
                    participant.setOwner(map.getBoolean(EVENT_MES_PARAM_OWNER));
                }
            }

            if (participant != null) {
                participants.add(participant);
            }
        }
        return participants;
    }

    private WritableArray convertConversationParticipantListToArray(List<ConversationParticipant> participants) {
        if (participants == null) {
            return null;
        }
        WritableArray array = Arguments.createArray();
        for (ConversationParticipant participant : participants) {
            WritableMap map = Arguments.createMap();
            map.putDouble(EVENT_MES_PARAM_IM_USER_ID, participant.getIMUserId());
            map.putBoolean(EVENT_MES_PARAM_CAN_WRITE, participant.canWrite());
            map.putBoolean(EVENT_MES_PARAM_CAN_MANAGE_PARTICIPANTS, participant.canManageParticipants());
            map.putBoolean(EVENT_MES_PARAM_CAN_EDIT_MESSAGES, participant.canEditMessages());
            map.putBoolean(EVENT_MES_PARAM_CAN_EDIT_ALL_MESSAGES, participant.canEditAllMessages());
            map.putBoolean(EVENT_MES_PARAM_CAN_REMOVE_MESSAGES, participant.canRemoveMessages());
            map.putBoolean(EVENT_MES_PARAM_CAN_REMOVE_ALL_MESSAGES, participant.canRemoveAllMessages());
            map.putBoolean(EVENT_MES_PARAM_OWNER, participant.isOwner());
            map.putDouble(EVENT_MES_PARAM_LAST_READ, participant.getLastReadEventSequence());

            array.pushMap(map);
        }
        return array;
    }

    private WritableMap convertConversationEventToMap(IConversationEvent conversationEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, conversationEvent.getIMUserId());
        params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationEvent.getSequence());
        params.putDouble(EVENT_MES_PARAM_TIMESTAMP, conversationEvent.getTimestamp());
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
                WritableArray array = convertConversationParticipantListToArray(conversation.getParticipants());
                conversationMap.putArray(EVENT_MES_PARAM_PARTICIPANTS, array);
            }
            conversationMap.putDouble(EVENT_MES_PARAM_CREATED_TIME, conversation.getCreatedTime());
            conversationMap.putDouble(EVENT_MES_PARAM_LAST_SEQENCE, conversation.getLastSequence());
            conversationMap.putDouble(EVENT_MES_PARAM_LAST_UPDATE, conversation.getLastUpdateTime());
            conversationMap.putBoolean(EVENT_MES_PARAM_DIRECT, conversation.isDirect());
            conversationMap.putBoolean(EVENT_MES_PARAM_PUBLIC_JOIN, conversation.isPublicJoin());
            conversationMap.putBoolean(EVENT_MES_PARAM_UBER, conversation.isUber());

            params.putMap(EVENT_MES_PARAM_CONVERSATION, conversationMap);
        }
        return params;
    }

    private WritableMap convertUserEventToMap(IUserEvent userEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(userEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(userEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, userEvent.getIMUserId());
        IUser user = userEvent.getUser();
        if (user != null) {
            WritableMap userMap = Arguments.createMap();
            userMap.putDouble(EVENT_MES_PARAM_IM_ID, user.getIMId());
            userMap.putBoolean(EVENT_MES_PARAM_IS_DELETED, user.isDeleted());
            if (user.getName() != null) {
                userMap.putString(EVENT_MES_PARAM_USER_NAME, user.getName());
            }
            if (user.getDisplayName() != null) {
                userMap.putString(EVENT_MES_PARAM_DISPLAY_NAME, user.getDisplayName());
            }
            if (user.getCustomData() != null) {
                userMap.putMap(EVENT_MES_PARAM_CUSTOM_DATA, Utils.createObjectWritableMap(user.getCustomData()));
            }
            if (user.getPrivateCustomData() != null) {
                userMap.putMap(EVENT_MES_PARAM_PRIVATE_CUSTOM_DATA, Utils.createObjectWritableMap(user.getPrivateCustomData()));
            }
            if (user.getConversationList() != null) {
                userMap.putArray(EVENT_MES_PARAM_CONVERSATION_LIST, Utils.createWritableArray(user.getConversationList()));
            }
            if (user.getNotifications() != null) {
                WritableArray notifications = Utils.convertMessengerNotificationsToArray(user.getNotifications());
                userMap.putArray(EVENT_MES_PARAM_MESSENGER_NOTIFICATIONS, notifications);
            }
            if (user.getLeaveConversationList() != null) {
                userMap.putArray(EVENT_MES_PARAM_LEAVE_CONVERSATION_LIST, Utils.createWritableArray(user.getLeaveConversationList()));
            }

            params.putMap(EVENT_MES_PARAM_USER, userMap);
        }
        return params;
    }

    private WritableMap convertSubscriptionEventToMap(ISubscriptionEvent subscriptionEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(subscriptionEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(subscriptionEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, subscriptionEvent.getIMUserId());
        List<Long> users = subscriptionEvent.getUsers();
        if (users != null) {
            WritableArray usersArray = Utils.createLongWritableArray(users);
            params.putArray(EVENT_MES_PARAM_USERS, usersArray);
        }
        return params;
    }

    private WritableMap convertConversationServiceEventToMap(IConversationServiceEvent conversationServiceEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationServiceEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationServiceEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, conversationServiceEvent.getIMUserId());
        if (conversationServiceEvent.getSequence() != 0) {
            params.putDouble(EVENT_MES_PARAM_SEQUENCE, conversationServiceEvent.getSequence());
        }
        if (conversationServiceEvent.getConversationUUID() != null) {
            params.putString(EVENT_MES_PARAM_CONVERSATION_UUID, conversationServiceEvent.getConversationUUID());
        }
        return params;
    }

    private WritableMap convertMessageEventToMap(IMessageEvent messageEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(messageEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(messageEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, messageEvent.getIMUserId());
        if (messageEvent.getSequence() != 0) {
            params.putDouble(EVENT_MES_PARAM_SEQUENCE, messageEvent.getSequence());
        }
        if (messageEvent.getTimestamp() != 0) {
            params.putDouble(EVENT_MES_PARAM_TIMESTAMP, messageEvent.getTimestamp());
        }
        IMessage message = messageEvent.getMessage();
        if (message != null) {
            WritableMap messageMap = Arguments.createMap();
            if (message.getConversation() != null) {
                messageMap.putString(EVENT_MES_PARAM_CONVERSATION, message.getConversation());
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
                messageMap.putArray(EVENT_MES_PARAM_PAYLOAD, Utils.createArrayForObjectMapList(message.getPayload()));
            }
            params.putMap(EVENT_MES_PARAM_MESSAGE, messageMap);
        }

        return params;
    }

    private WritableMap convertRetransmitEventToMap(IRetransmitEvent retransmitEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(retransmitEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(retransmitEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, retransmitEvent.getIMUserId());
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

    private WritableMap convertStatusEventToMap(IStatusEvent statusEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(statusEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(statusEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, statusEvent.getIMUserId());
        params.putBoolean(EVENT_MES_PARAM_ONLINE, statusEvent.isOnline());
        return params;
    }

    private WritableMap convertConversationListEventToMap(IConversationListEvent conversationListEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(conversationListEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(conversationListEvent.getMessengerAction()));
        params.putDouble(EVENT_MES_PARAM_IM_USER_ID, conversationListEvent.getIMUserId());
        params.putArray(EVENT_MES_PARAM_CONVERSATION_LIST, Utils.createWritableArray(conversationListEvent.getConversationList()));
        return params;
    }


    private WritableMap convertErrorEventToMap(IErrorEvent errorEvent) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, Utils.convertMessengerEventToString(errorEvent.getMessengerEventType()));
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(errorEvent.getMessengerAction()));
        params.putInt(EVENT_MES_PARAM_CODE, errorEvent.getErrorCode());
        if (errorEvent.getErrorDescription() != null) {
            params.putString(EVENT_MES_PARAM_DESCRIPTION, errorEvent.getErrorDescription());
        }
        return params;
    }

    private WritableMap createErrorEventMapInvalidArguments(MessengerAction action) {
        WritableMap params = Arguments.createMap();
        params.putString(EVENT_MES_PARAM_EVENT_TYPE, EVENT_NAME_MES_ERROR);
        params.putString(EVENT_MES_PARAM_ACTION, Utils.convertMessengerActionToString(action));
        params.putInt(EVENT_MES_PARAM_CODE, 10001);
        params.putString(EVENT_MES_PARAM_DESCRIPTION, INVALID_ARGUMENTS_ERROR);
        return params;
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}