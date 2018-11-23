/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import MessagingShared from "./MessagingShared";
import MessengerEventTypes from "./MessengerEventTypes";
import Conversation from "./Conversation";
import Message from "./Message";

const MessagingModule = NativeModules.VIMessagingModule;

const listeners = {};

const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(MessagingModule),
    android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant.Messaging
 * @class Messenger
 * @classdesc Messenger class used to control messaging functions.
 */
export default class Messenger {

    /**
     * @private
     */
    static _instance = null;

    /**
     * @ignore
     */
    constructor() {
        if (Messenger._instance) {
            throw new Error("Error - use Voximplant.getMessenger()");
        }
        EventEmitter.addListener('VIGetUser', this._onGetUser);
        EventEmitter.addListener('VISetStatus', this._onSetStatus);
        EventEmitter.addListener('VISubscribe', this._onSubscribe);
        EventEmitter.addListener('VIUnsubscribe', this._onUnsubscribe);
        EventEmitter.addListener('VIEditUser', this._onEditUser);
        EventEmitter.addListener('VIGetConversation', this.onGetConversation);
        EventEmitter.addListener('VICreateConversation', this._onCreateConversation);
        EventEmitter.addListener('VIRemoveConversation', this._onRemoveConversation);
        EventEmitter.addListener('VIEditConversation', this._onEditConversation);
        EventEmitter.addListener('VITyping', this._onTyping);
        EventEmitter.addListener('VISendMessage', this._onSendMessage);
        EventEmitter.addListener('VIEditMessage', this._onEditMessage);
        EventEmitter.addListener('VIRemoveMessage', this._onRemoveMessage);
        EventEmitter.addListener('VIDelivered', this._onDelivered);
        EventEmitter.addListener('VIRead', this._onRead);
        EventEmitter.addListener('VIRetransmitEvents', this._onRetransmitEvents);
        EventEmitter.addListener('VIError', this._onError);
    }

    /**
     *  @ignore
     */
    static getInstance() {
        if (Messenger._instance === null) {
            Messenger._instance = new Messenger();
        }
        return Messenger._instance;
    }

    /**
     * Register handler for specified messenger event.
     * Use {@link Voximplant.Messaging.Messenger.off} method to delete a handler.
     *
     * @param {Voximplant.Messaging.MessengerEventTypes} eventType
     * @param {function} event
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    on(eventType, event) {
        if (!listeners[eventType]) {
            listeners[eventType] = new Set();
        }
        listeners[eventType].add(event);
    }

    /**
     * Remove handler for specified event
     *
     * @param {Voximplant.Messaging.MessengerEventTypes} eventType
     * @param {function} event
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    off(eventType, event) {
        if (listeners[eventType]) {
            listeners[eventType].delete(event);
        }
    }

    /**
     * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
     *
     * @return string
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    getMe() {
        return MessagingShared.getInstance().getCurrentUser();
    }

    /**
     * Get user information for the user specified by the full Voximplant user identifier, ex 'username@appname.accname'
     *
     * @param {string} userId - User identifier
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUser(userId) {
        MessagingModule.getUser(userId);
    }

    /**
     * Get user information for the users specified by the array of the full Voximplant user identifiers, ex 'username@appname.accname'
     *
     * @param {Array<string>} users - List of user identifiers
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUsers(users) {
        MessagingModule.getUsers(users);
    }

    /**
     * Edit current user information.
     *
     * @param {object} customData - New custom data.
     * @param {object} privateCustomData - New private custom data.
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    editUser(customData, privateCustomData) {
        MessagingModule.editUser(customData, privateCustomData);
    }

    /**
     * Set user presence status. Triggers the MessengerEvents.SetStatus event for all messenger objects on all connected
     * clients which are subscribed for notifications about this user.
     *
     * @param {boolean} online - true if user is available for messaging
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    setStatus(online) {
        MessagingModule.setStatus(online);
    }

    /**
     * Subscribe for user information change and presence status change. On change, the 'MessengerEvents.Subscribe' event will be triggered.
     *
     * @param {Array<string>} users - List of full Voximplant user identifiers, ex 'username@appname.accname'
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    subscribe(users) {
        MessagingModule.subscribe(users)
    }

    /**
     * Unsubscribe for user information change and presence status change.
     *
     * @param {Array<string>} users - List of full Voximplant user identifiers, ex 'username@appname.accname'
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    unsubscribe(users) {
        MessagingModule.unsubscribe(users);
    }

    /**
     * Manage messenger push notification subscriptions.
     *
     * @param {Array<Voximplant.Messaging.MessengerNotifications>} notifications - List of MessengerNotifications
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    managePushNotifications(notifications) {
        MessagingModule.manageNotifications(notifications);
    }

    /**
     * Create a new conversation. Triggers the MessengerEvents.ErrorCreateConversation event on all connected clients
     * that are mentioned in the 'participants' array.
     *
     * @param {Array<ConversationParticipant>} participants - Array of participants alongside with access rights params
     * @param {string} title - Conversation title
     * @param {boolean} [distinct] - If two conversations are created with same set of users and moderators and both have 'distinct' flag,
     *                             second creation of conversation (with the same participants) will fail with the UUID of conversation already created.
     *                             Note that changing users or moderators list will clear 'distinct' flag.
     * @param {boolean} [publicJoin] - If set to 'true', anyone can join conversation by uuid
     * @param {object} [customData] - JavaScript object with custom data, up to 5kb. Note that setting this property does not send changes to the server.
     *                                Use the 'update' to send all changes at once or 'setCustomData' to update and set the custom data.
     * @param {boolean} [isUber] - Specify if the conversation is uber conversation
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    createConversation(participants, title, distinct, publicJoin, customData, isUber) {
        if (title === undefined || title === null) {
            title = "";
        }
        if (distinct === undefined) {
            distinct = false;
        }
        if (publicJoin === undefined) {
            publicJoin = false;
        }
        if (customData === undefined || customData === null) {
            customData = {};
        }
        if (isUber === undefined) {
            isUber = false;
        }
        MessagingModule.createConversation(participants, title, distinct, publicJoin, customData, isUber);
    }

    /**
     * Get conversation by it's UUID.
     *
     * @param {string} uuid
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    getConversation(uuid) {
       if (uuid === undefined) {
           uuid = null;
       }
       MessagingModule.getConversation(uuid);
    }

    /**
     * Get multiple conversations by array of UUIDs. Maximum 30 conversations.
     * Note that calling this method will result in multiple IMessengerListener.onGetConversation(IConversationEvent) events.
     *
     * @param {Array<string>} conversations - Array of UUIDs
     */
    getConversations(conversations) {
        if (conversations === undefined) {
            conversations = [];
        }
        MessagingModule.getConversations(conversations);
    }

    /**
     * Remove the conversation specified by the UUID
     *
     * @param {string} uuid - Universally Unique Identifier of the conversation
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    removeConversation(uuid) {
        if (uuid === undefined) {
            uuid = null;
        }
        MessagingModule.removeConversation(uuid);
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    /**
     * @private
     */
    _processConversationEvent(event) {
        let conversation = new Conversation();
        conversation.createdAt = event.conversation.createdAt;
        conversation.uuid = event.conversation.uuid;
        conversation.lastRead = event.conversation.lastRead;
        conversation.participants = event.conversation.participants;
        conversation.isUber = event.conversation.isUber;
        conversation.lastSeq = event.conversation.lastSeq;
        conversation.publicJoin = event.conversation.publicJoin;
        conversation.distinct = event.conversation.distinct;
        conversation.lastUpdate = event.conversation.lastUpdate;
        conversation.customData = event.conversation.customData;
        conversation.title = event.conversation.title;
        delete event.conversation;
        event.conversation = conversation;
    }

    /**
     * @private
     */
    _processMessageEvent(event) {
        let message = new Message();
        message.conversation = event.message.conversation;
        message.payload = event.message.payload;
        message.sender = event.message.sender;
        message.sequence = event.message.sequence;
        message.text = event.message.text;
        message.uuid = event.message.uuid;
        delete event.message;
        event.message = message;
    }

    /**
     * @private
     */
    _onGetUser = (event) => {
        this._emit(MessengerEventTypes.GetUser, event);
    };

    /**
     * @private
     */
    _onSetStatus = (event) => {
        this._emit(MessengerEventTypes.SetStatus, event);
    };

    /**
     * @private
     */
    _onSubscribe = (event) => {
        this._emit(MessengerEventTypes.Subscribe, event);
    };

    /**
     * @private
     */
    _onUnsubscribe = (event) => {
        this._emit(MessengerEventTypes.Unsubscribe, event);
    };

    /**
     * @private
     */
    _onEditUser = (event) => {
        this._emit(MessengerEventTypes.EditUser, event);
    };

    /**
     * @private
     */
    _onCreateConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.CreateConversation, event);
    };

    /**
     * @private
     */
    onGetConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.GetConversation, event);
    };

    /**
     * @private
     */
    _onRemoveConversation = (event) => {
        let conversation = new Conversation();
        conversation.uuid = event.conversation.uuid;
        delete event.conversation;
        event.conversation = conversation;
        this._emit(MessengerEventTypes.RemoveConversation, event);
    };

    /**
     * @private
     */
    _onEditConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.EditConversation, event);
    };

    /**
     * @private
     */
    _onTyping = (event) => {
        this._emit(MessengerEventTypes.Typing, event);
    };

    /**
     * @private
     */
    _onSendMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.SendMessage, event);
    };

    /**
     * @private
     */
    _onEditMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.EditMessage, event);
    };

    /**
     * @private
     */
    _onRemoveMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.RemoveMessage, event);
    };


    /**
     * @private
     */   _onRead = (event) => {
        this._emit(MessengerEventTypes.Read, event);
    };

    /**
     * @private
     */
    _onDelivered = (event) => {
        this._emit(MessengerEventTypes.Delivered, event);
    };

    /**
     * @private
     */
    _onRetransmitEvents = (event) => {
        if (event.events !== undefined) {
            for (let retransmitEvent in event.events) {
                if (retransmitEvent.hasOwnProperty('conversation')) {
                    this._processConversationEvent(retransmitEvent);
                }
                if (retransmitEvent.hasOwnProperty('message')) {
                    this._processMessageEvent(retransmitEvent);
                }
            }
        }
        this._emit(MessengerEventTypes.RetransmitEvents, event);
    };

    /**
     * @private
     */
    _onError = (event) => {
        this._emit(MessengerEventTypes.Error, event);
    }
}