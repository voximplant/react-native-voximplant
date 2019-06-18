/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
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
        EventEmitter.addListener('VISetStatus', this._onSetStatus);
        EventEmitter.addListener('VISubscribe', this._onSubscribe);
        EventEmitter.addListener('VIUnsubscribe', this._onUnsubscribe);
        EventEmitter.addListener('VIEditUser', this._onEditUser);
        EventEmitter.addListener('VICreateConversation', this._onCreateConversation);
        EventEmitter.addListener('VIRemoveConversation', this._onRemoveConversation);
        EventEmitter.addListener('VIEditConversation', this._onEditConversation);
        EventEmitter.addListener('VITyping', this._onTyping);
        EventEmitter.addListener('VISendMessage', this._onSendMessage);
        EventEmitter.addListener('VIEditMessage', this._onEditMessage);
        EventEmitter.addListener('VIRemoveMessage', this._onRemoveMessage);
        EventEmitter.addListener('VIRead', this._onRead);
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
        if (!event || !(event instanceof Function)) {
            console.warn(`Messenger: on: handler is not a Function`);
            return;
        }
        if (Object.values(MessengerEventTypes).indexOf(eventType) === -1) {
            console.warn(`Messenger: on: MessengerEventTypes does not contain ${eventType} event`);
            return;
        }
        if (!listeners[eventType]) {
            listeners[eventType] = new Set();
        }
        listeners[eventType].add(event);
    }

    /**
     * Remove handler for specified event
     *
     * @param {Voximplant.Messaging.MessengerEventTypes} eventType
     * @param {function} event - Handler function. If not specified, all handlers for the event type will be removed.
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    off(eventType, event) {
        if (!listeners[eventType]) {
            return;
        }
        if (Object.values(MessengerEventTypes).indexOf(eventType) === -1) {
            console.warn(`Messenger: off: MessengerEventTypes does not contain ${eventType} event`);
            return;
        }
        if (event && event instanceof Function) {
            listeners[eventType].delete(event);
        } else {
            listeners[eventType] = new Set();
        }
    }

    /**
     * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
     *
     * @return {string}
     *
     * @memberOf Voximplant.Messaging.Messenger
     */
    getMe() {
        return MessagingShared.getInstance().getCurrentUser();
    }

    /**
     * Get information for the user specified by the Voximplant user name, e.g., 'username@appname.accname'.
     *
     * It's possible to get any user of the main Voximplant developer account or its child accounts.
     *
     * Only the client that called the method can be informed about getting user information.
     *
     * @param {string} username - Voximplant user identifier
     * @returns {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUserByName(username) {
        return new Promise((resolve, reject) => {
            MessagingModule.getUserByName(username, (userEvent, errorEvent) => {
                if (userEvent) {
                    resolve(userEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get information for the user specified by the IM user id.
     *
     * It's possible to get any user of the main Voximplant developer account or its child accounts.
     *
     * Only the client that called the method can be informed about getting user information.
     *
     * @param {number} userId -  IM User id
     * @return {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUserByIMId(userId) {
        return new Promise((resolve, reject) => {
            MessagingModule.getUserById(userId, (userEvent, errorEvent) => {
                if (userEvent) {
                    resolve(userEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get information for the users specified by the array of the Voximplant user names. Maximum 50 users.
     *
     * It's possible to get any users of the main Voximplant developer account or its child accounts.
     *
     * Only the client that called the method can be informed about getting users information.
     *
     * @param {Array<string>} users - Array of Voximplant user identifiers
     * @return {Promise<Array<EventHandlers.UserEvent>|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUsersByName(users) {
        return new Promise((resolve, reject) => {
            MessagingModule.getUsersByName(users, (userEvents, errorEvent) => {
                if (userEvents) {
                    resolve(userEvents);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get information for the users specified by the array of the IM user ids. Maximum 50 users.
     *
     * It's possible to get any users of the main Voximplant developer account or its child accounts.
     *
     * Only the client that called the method can be informed about getting users information.
     * @param {Array<number>} users - Array of IM user ids
     * @return {Promise<Array<EventHandlers.UserEvent>|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getUsersByIMId(users) {
        return new Promise((resolve, reject) => {
            MessagingModule.getUsersById(users, (userEvents, errorEvent) => {
                if (userEvents) {
                    resolve(userEvents);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Edit current user information.
     *
     * Other users that are subscribed to the user can be informed about the editing via the
     * {@link Voximplant.Messaging.MessengerEventTypes.EditUser} event.
     *
     * @param {object} customData - New custom data.
     * If null, previously set custom data will not be changed. If empty object, previously set custom data will be removed.
     * @param {object} privateCustomData - New private custom data.
     * If null, previously set private custom data will not be changed. If empty object, previously set private custom data will be removed.
     * @return {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    editUser(customData, privateCustomData) {
        return new Promise((resolve, reject) => {
            MessagingModule.editUser(customData, privateCustomData, (userEvent, errorEvent) => {
                if (userEvent) {
                    resolve(userEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Set the current user status.
     *
     * Other users (that are subscribed to the user) and other clients (of the current user) can be informed about
     * the status changing via the {@link Voximplant.Messaging.MessengerEventTypes.SetStatus} event.
     *
     * @param {boolean} online - True if user is available for messaging, false otherwise
     * @return {Promise<EventHandlers.StatusEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    setStatus(online) {
        return new Promise((resolve, reject) => {
            MessagingModule.setStatus(online, (statusEvent, errorEvent) => {
                if (statusEvent) {
                    resolve(statusEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Subscribe for other user(s) information and status changes.
     *
     * It's possible to subscribe for any user of the main Voximplant developer account or its child accounts.
     *
     * Other logged in clients (of the current user) can be informed about the subscription via
     * the {@link Voximplant.Messaging.MessengerEventTypes.Subscribe} event.
     *
     * User(s) specified in the 'users' parameter aren't informed about the subscription.
     *
     * @param {Array<number>} users - Array of IM user ids
     * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    subscribe(users) {
        return new Promise((resolve, reject) => {
            MessagingModule.subscribe(users, (subscriptionEvent, errorEvent) => {
                if (subscriptionEvent) {
                    resolve(subscriptionEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Unsubscribe from other user(s) information and status changes.
     *
     * Other logged in clients (of the current user) can be informed about the unsubscription via
     * the {@link Voximplant.Messaging.MessengerEventTypes.Unsubscribe} event.
     *
     * User(s) specified in the 'users' parameter aren't informed about the unsubscription.
     *
     * @param {Array<number>} users - Array of IM user ids
     * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    unsubscribe(users) {
        return new Promise((resolve, reject) => {
            MessagingModule.unsubscribe(users, (subscriptionEvent, errorEvent) => {
                if (subscriptionEvent) {
                    resolve(subscriptionEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Unsubscribe from all subscriptions.
     *
     * Other logged in clients (of the current user) can be informed about the unsubscription via
     * the {@link Voximplant.Messaging.MessengerEventTypes.Unsubscribe} event.
     *
     * Other users aren't informed about the unsubscription.
     * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    unsubscribeFromAll() {
        return new Promise((resolve, reject) => {
            MessagingModule.unsubscribeFromAll((subscriptionEvent, errorEvent) => {
                if (subscriptionEvent) {
                    resolve(subscriptionEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get all current subscriptions, i.e., the array of users the current user is subscribed to.
     *
     * Only the client that called the method can be informed about getting subscriptions.
     *
     * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getSubscriptions() {
        return new Promise((resolve, reject) => {
            MessagingModule.getSubscriptions((subscriptionEvent, errorEvent) => {
                if (subscriptionEvent) {
                    resolve(subscriptionEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Manage messenger push notification subscriptions for the current user.
     *
     * Other logged in clients (of the current user) can be informed about managing push notifications via
     * {@link Voximplant.Messaging.MessengerEventTypes.EditUser}
     *
     * @param {Array<Voximplant.Messaging.MessengerNotification>} notifications - Array of messenger notification types
     * @return {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    managePushNotifications(notifications) {
        return new Promise((resolve, reject) => {
            MessagingModule.manageNotifications(notifications, (userEvent, errorEvent) => {
                if (userEvent) {
                    resolve(userEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Create a new conversation with the extended configuration.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about
     * the conversation creation via the {@link Voximplant.Messaging.MessengerEventTypes.CreateConversation}.
     *
     * @param {Voximplant.Messaging.ConversationConfig} [conversationConfig] - ConversationConfig instance with extended conversation parameters
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    createConversation(conversationConfig) {
        return new Promise((resolve, reject) => {
            MessagingModule.createConversation(conversationConfig, (conversationEvent, errorEvent) => {
                if (conversationEvent) {
                    Conversation._processConversationEvent(conversationEvent);
                    resolve(conversationEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get a conversation by its UUID.
     *
     * It's possible if:
     * - the user that calls the method is/was a participant of this conversation
     * - the conversation is an available public conversation (see {@link Voximplant.Messaging.Messenger#getPublicConversations})
     *
     * Only the client that called the method can be informed about getting conversation.
     *
     * @param {string} uuid - Conversation UUID
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getConversation(uuid) {
        return new Promise((resolve, reject) => {
           MessagingModule.getConversation(uuid, (conversationEvent, errorEvent) => {
               if (conversationEvent) {
                   Conversation._processConversationEvent(conversationEvent);
                   resolve(conversationEvent);
               } else {
                   reject(errorEvent);
               }
           })
        });
    }

    /**
     * Get the multiple conversations by the list of UUIDs. Maximum 30 conversations.
     *
     * It's possible if:
     * - the user that calls the method is/was a participant of this conversation
     * - the conversation is an available public conversation (see {@link Voximplant.Messaging.Messenger#getPublicConversations})
     *
     * Only the client that called the method can be informed about getting conversations.
     *
     * @param {Array<string>} uuids - Array of UUIDs. Maximum 30 conversations.
     * @return {Promise<Array<EventHandlers.ConversationEvent>|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getConversations(uuids) {
        return new Promise((resolve, reject) => {
            MessagingModule.getConversations(uuids, (conversationEvents, errorEvent) => {
                if (conversationEvents) {
                    for (let i in conversationEvents) {
                        if (conversationEvents.hasOwnProperty(i)) {
                            Conversation._processConversationEvent(conversationEvents[i]);
                        }
                    }
                    resolve(conversationEvents);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Get all public conversations ({@link Voximplant.Messaging.Conversation#publicJoin} is true).
     *
     * It's possible to get all public conversations (UUIDs) that were created by:
     * - the current user
     * - other users of the same child account
     * - users of the main Voximplant developer account
     *
     * Only the client that called the method can be informed about getting public conversations UUIDs.
     *
     * @return {Promise<EventHandlers.ConversationListEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    getPublicConversations() {
        return new Promise((resolve, reject) => {
            MessagingModule.getPublicConversations((conversationListEvent, errorEvent) => {
                if (conversationListEvent) {
                    resolve(conversationListEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Join the current user to any conversation specified by the UUID.
     *
     * It's possible only on the following conditions:
     * - a conversation is created by a user of the main Voximplant developer account or its child accounts
     * - public join is enabled ({@link Voximplant.Messaging.Conversation#publicJoin} is true)
     * - the conversation is not a direct one ({@link Voximplant.Messaging.Conversation#direct} is false)
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed
     * about joining to the conversation via the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @param {string} uuid - Conversation UUID
     * @return {Promise<EventHandlers.ConversationListEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    joinConversation(uuid) {
        return new Promise((resolve, reject) => {
            MessagingModule.joinConversation(uuid, (conversationEvent, errorEvent) => {
                if (conversationEvent) {
                    Conversation._processConversationEvent(conversationEvent);
                    resolve(conversationEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Make the current user leave a conversation specified by the UUID.
     *
     * It's possible only if the conversation is not a direct one ({@link Voximplant.Messaging.Conversation#direct} is false).
     *
     * After a successful method call the conversation's UUID will be added to {@link Voximplant.Messaging.User#leaveConversationList}.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed
     * about leaving the conversation via the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @param {string} uuid - Conversation UUID
     * @return {Promise<EventHandlers.ConversationListEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Messenger
     */
    leaveConversation(uuid) {
        return new Promise((resolve, reject) => {
            MessagingModule.leaveConversation(uuid, (conversationEvent, errorEvent) => {
                if (conversationEvent) {
                    Conversation._processConversationEvent(conversationEvent);
                    resolve(conversationEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
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
        Conversation._processConversationEvent(event);
        this._emit(MessengerEventTypes.CreateConversation, event);
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
        Conversation._processConversationEvent(event);
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
        Message._processMessageEvent(event);
        this._emit(MessengerEventTypes.SendMessage, event);
    };

    /**
     * @private
     */
    _onEditMessage = (event) => {
        Message._processMessageEvent(event);
        this._emit(MessengerEventTypes.EditMessage, event);
    };

    /**
     * @private
     */
    _onRemoveMessage = (event) => {
        Message._processMessageEvent(event);
        this._emit(MessengerEventTypes.RemoveMessage, event);
    };


    /**
     * @private
     */
    _onRead = (event) => {
        this._emit(MessengerEventTypes.Read, event);
    };
}