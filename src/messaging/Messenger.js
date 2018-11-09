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

    // init() {}

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
     *
     * @param eventType
     * @param event
     */
    on(eventType, event) {
        if (!listeners[eventType]) {
            listeners[eventType] = new Set();
        }
        listeners[eventType].add(event);
    }

    /**
     *
     * @param eventType
     * @param event
     */
    off(eventType, event) {
        if (listeners[eventType]) {
            listeners[eventType].delete(event);
        }
    }

    /**
     * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
     * @return string
     * @memberOf Voximplant.Messaging.Messenger
     */
    getMe() {
        return MessagingShared.getInstance().getCurrentUser();
    }

    /**
     *
     * @param userId
     */
    getUser(userId) {
        MessagingModule.getUser(userId);
    }

    /**
     *
     * @param users
     */
    getUsers(users) {
        MessagingModule.getUsers(users);
    }

    editUser(customData, privateCustomData) {
        MessagingModule.editUser(customData, privateCustomData);
    }

    /**
     *
     * @param online
     */
    setStatus(online) {
        MessagingModule.setStatus(online);
    }

    /**
     *
     * @param users
     */
    subscribe(users) {
        MessagingModule.subscribe(users)
    }

    /**
     *
     * @param users
     */
    unsubscribe(users) {
        MessagingModule.unsubscribe(users);
    }

    /**
     *
     * @param notifications
     */
    managePushNotifications(notifications) {
        MessagingModule.manageNotifications(notifications);
    }

    /**
     *
     * @param participants
     * @param title
     * @param distinct
     * @param publicJoin
     * @param customData
     * @param moderators
     * @param isUber
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
     *
     * @param uuid
     */
    getConversation(uuid) {
       if (uuid === undefined) {
           uuid = null;
       }
       MessagingModule.getConversation(uuid);
    }

    /**
     *
     * @param conversations
     */
    getConversations(conversations) {
        if (conversations === undefined) {
            conversations = [];
        }
        MessagingModule.getConversations(conversations);
    }

    /**
     *
     * @param uuid
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

    _onGetUser = (event) => {
        this._emit(MessengerEventTypes.GetUser, event);
    };

    _onSetStatus = (event) => {
        this._emit(MessengerEventTypes.SetStatus, event);
    };

    _onSubscribe = (event) => {
        this._emit(MessengerEventTypes.Subscribe, event);
    };

    _onUnsubscribe = (event) => {
        this._emit(MessengerEventTypes.Unsubscribe, event);
    };

    _onEditUser = (event) => {
        this._emit(MessengerEventTypes.EditUser, event);
    };

    _onCreateConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.CreateConversation, event);
    };

    onGetConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.GetConversation, event);
    };

    _onRemoveConversation = (event) => {
        let conversation = new Conversation();
        conversation.uuid = event.conversation.uuid;
        delete event.conversation;
        event.conversation = conversation;
        this._emit(MessengerEventTypes.RemoveConversation, event);
    };

    _onEditConversation = (event) => {
        this._processConversationEvent(event);
        this._emit(MessengerEventTypes.EditConversation, event);
    };

    _onTyping = (event) => {
        this._emit(MessengerEventTypes.Typing, event);
    };

    _onSendMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.SendMessage, event);
    };

    _onEditMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.EditMessage, event);
    };

    _onRemoveMessage = (event) => {
        this._processMessageEvent(event);
        this._emit(MessengerEventTypes.RemoveMessage, event);
    };

    _onRead = (event) => {
        this._emit(MessengerEventTypes.Read, event);
    };

    _onDelivered = (event) => {
        this._emit(MessengerEventTypes.Delivered, event);
    };

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

    _onError = (event) => {
        this._emit(MessengerEventTypes.Error, event);
    }
}