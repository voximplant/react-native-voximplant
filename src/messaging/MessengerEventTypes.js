/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Enum that represents types of messenger events.
 * @memberOf Voximplant.Messaging
 * @enum {string}
 * @type {{CreateConversation: string, Typing: string, RemoveMessage: string, Error: string, EditConversation: string, Subscribe: string, EditMessage: string, EditUser: string, RetransmitEvents: string, Read: string, GetPublicConversations: string, RemoveConversation: string, GetSubscriptions: string, SetStatus: string, GetConversation: string, Unsubscribe: string, GetUser: string, SendMessage: string}}
 */
const MessengerEventTypes = {
    /**
     * Event is triggered when a conversation is created via {@link Voximplant.Messaging.Messenger#createConversation}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for participants that belong to the conversation.
     *
     * Handler function receives {@link Voximplant.EventHandlers.ConversationEvent} object as an argument.
     */
    CreateConversation : 'CreateConversation',
    /**
     * Event is triggered when the conversation properties were modified as the result of:
     * - {@link Voximplant.Messaging.Messenger#joinConversation}
     * - {@link Voximplant.Messaging.Messenger#leaveConversation}
     * - {@link Voximplant.Messaging.Conversation#update}
     * - {@link Voximplant.Messaging.Conversation#addParticipants}
     * - {@link Voximplant.Messaging.Conversation#removeParticipants}
     * - {@link Voximplant.Messaging.Conversation#editParticipants}
     * - or analogous methods from other Voximplant SDKs and Messaging API
     *
     * Triggered only for participants that belong to the conversation.
     *
     * Handler function receives {@link Voximplant.EventHandlers.ConversationEvent} object as an argument.
     */
    EditConversation: 'EditConversation',
    /**
     * Event is triggered when a message was edited via {@link Voximplant.Messaging.Message#update} or analogous methods
     * from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for participants that belong to the conversation with the changed message.
     *
     * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
     */
    EditMessage: 'EditMessage',
    /**
     * Event is triggered as the result of {@link Voximplant.Messaging.Messenger#editUser} or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for the subscribers of the changed user. Use {@link Voximplant.Messaging.Messenger#subscribe} to subscribe for user's changes.
     *
     * Handler function receives {@link Voximplant.EventHandlers.UserEvent} object as an argument.
     */
    EditUser : 'EditUser',
    /**
     * Type of the event the promises of the Voximplant React Native Messaging methods are rejected with.
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    Error : 'Error',
    /**
     * Type of the event the promises of the following methods are resolved with:
     * - {@link Voximplant.Messaging.Messenger#getConversation}
     * - {@link Voximplant.Messaging.Messenger#getConversations}
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    GetConversation : 'GetConversation',
    /**
     * Type of the event the promise of {@link Voximplant.Messaging.Messenger#getPublicConversations} is resolved with.
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    GetPublicConversations : 'GetPublicConversations',
    /**
     * Type of the event the promise of {@link Voximplant.Messaging.Messenger#getSubscriptions} is resolved with.
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    GetSubscriptions : 'GetSubscriptions',
    /**
     * Type of the event the promises of the following methods are resolved with:
     * - {@link Voximplant.Messaging.Messenger#getUserByIMId}
     * - {@link Voximplant.Messaging.Messenger#getUserByName}
     * - {@link Voximplant.Messaging.Messenger#getUsersByIMId}
     * - {@link Voximplant.Messaging.Messenger#getUsersByName}
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    GetUser : 'GetUser',
    /**
     * Event is triggered for all clients in the conversation as the result of {@link Voximplant.Messaging.Conversation#markAsRead}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Handler function receives {@link Voximplant.EventHandlers.ConversationServiceEvent} object as an argument.
     */
    Read : 'Read',
    /**
     * Event is triggered when a conversation was removed.
     *
     * Note that removing is possible via Voximplant Messaging API only.
     *
     * Triggered only for participants that belong to the conversation.
     *
     * Handler function receives {@link Voximplant.EventHandlers.ConversationEvent} object as an argument.
     */
    RemoveConversation : 'RemoveConversation',
    /**
     * Event is triggered when a message was removed from a conversation via {@link Voximplant.Messaging.Message#remove}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for participants that belong to the conversation with the deleted message.
     *
     * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
     */
    RemoveMessage : 'RemoveMessage',
    /**
     * Type of the event the promises of the following methods are resolved with:
     * - {@link Voximplant.Messaging.Conversation#retransmitEvents}
     * - {@link Voximplant.Messaging.Conversation#retransmitEventsFrom}
     * - {@link Voximplant.Messaging.Conversation#retransmitEventsTo}
     *
     * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
     * handler function.
     */
    RetransmitEvents : 'RetransmitEvents',
    /**
     * Event is triggered when a new message was sent to a conversation via {@link Voximplant.Messaging.Conversation#sendMessage}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for participants that belong to the conversation.
     *
     * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
     */
    SendMessage : 'SendMessage',
    /**
     * Event is triggered after a user status was changed via {@link Voximplant.Messaging.Messenger#setStatus}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for the subscribers of the changed user. Use @link Voximplant.Messaging.Messenger#subscribe} to subscribe for a user's changes.
     *
     * Handler function receives {@link Voximplant.EventHandlers.UserEvent} object as an argument.
     */
    SetStatus : 'SetStatus',
    /**
     * Event is triggered as the result of {@link Voximplant.Messaging.Messenger#subscribe} or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered on all logged in clients of the current user.
     *
     * Handler function receives {@link Voximplant.EventHandlers.SubscriptionEvent} object as an argument.
     */
    Subscribe : 'Subscribe',
    /**
     * Event is triggered when some user is typing text in a conversation. Information about typing is received via
     * {@link Voximplant.Messaging.Conversation#typing} or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered only for participants that belong to the conversation where typing is performing.
     *
     * Handler function receives {@link Voximplant.EventHandlers.ConversationServiceEvent} object as an argument.
     */
    Typing : 'Typing',
    /**
     * Invoked as the result of {@link Voximplant.Messaging.Messenger#unsubscribe}, {@link Voximplant.Messaging.Messenger#unsubscribeFromAll}
     * or analogous methods from other Voximplant SDKs and Messaging API.
     *
     * Triggered on all logged in clients of the current user.
     *
     * Handler function receives {@link Voximplant.EventHandlers.SubscriptionEvent} object as an argument.
     */
    Unsubscribe : 'Unsubscribe'
};

export default MessengerEventTypes;