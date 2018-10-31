/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    NativeModules,
} from 'react-native';

const MessagingModule = NativeModules.VIMessagingModule;

/**
 * @memberOf Voximplant.Messaging
 * @class Conversation
 * @classdesc Conversation instance. Created by Messenger.createConversation(). Used to send messages, add or remove users, change moderators list etc.
 */
export default class Conversation {

    /**
     * @member {string} createdAt -
     * @memberOf Voximplant.Messaging.Conversation
     */
    createdAt;

    /**
     * @member {object} customData - JavaScript object with custom data, up to 5kb.
     *                               Note that setting this property does not send changes to the server.
     *                               Use the 'update' to send all changes at once or 'setCustomData' to update and set the custom data.
     * @memberOf Voximplant.Messaging.Conversation
     */
    customData;

    /**
     * @member {boolean} distinct - If two conversations are created with same set of users and moderators and both have 'distinct' flag,
     *                              second create call will fail with the UUID of conversation already created.
     *                              Note that changing users or moderators list will clear 'distinct' flag.
     *                              Note that setting this property does not send changes to the server.
     *                              Use the 'update' to send all changes at once or 'setDistinct' to update and set the distinct flag.
     * @memberOf Voximplant.Messaging.Conversation
     */
    distinct;

    /**
     * @member {number} lastRead - Sequence of last event that was read by user. Used to display unread messages, events etc.
     * @memberOf Voximplant.Messaging.Conversation
     */
    lastRead;

    /**
     * @member {number} lastSeq - Last event sequence for this conversation. Used with 'lastRead' to display unread messages and events.
     * @memberOf Voximplant.Messaging.Conversation
     */
    lastSeq;

    /**
     * @member {number} lastUpdate - UNIX timestamp integer that specifies the time of the last event in the conversation.
     * @memberOf Voximplant.Messaging.Conversation
     */
    lastUpdate;

    /**
     * @member {string[]} moderators - Conversation moderator names list.
     * @memberOf Voximplant.Messaging.Conversation
     */
    moderators;

    /**
     * @member {Voximplant.Messaging.ConversationParticipant[]} participants - Conversation participants list alongside with their rights.
     * @memberOf Voximplant.Messaging.Conversation
     */
    participants;

    /**
     * @member {boolean} publicJoin - If set to 'true', anyone can join conversation by UUID.
     *                                Note that setting this property does not send changes to the server.
     *                                Use the 'update' to send all changes at once or 'setPublicJoin' to update and set the public join flag.
     * @memberOf Voximplant.Messaging.Conversation
     */
    publicJoin;

    /**
     * @member {string} title - Current conversation title.
     *                          Note that setting this property does not send changes to the server.
     *                          Use the 'update' to send all changes at once or 'setTitle' to update and set the title.
     * @memberOf Voximplant.Messaging.Conversation
     */
    title;

    /**
     * @member {string} uuid - Universally unique identifier of current conversation. Used in methods like 'get', 'remove' etc.
     * @memberOf Voximplant.Messaging.Conversation
     */
    uuid;

    /**
     * @member {boolean} isUber - Users in uber conversation will not be able to retrieve messages that were posted to conversation after they left them.
     * @memberOf Voximplant.Messaging.Conversation
     */
    isUber;

    constructor() {

    }
}