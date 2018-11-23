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

    /**
     * @ignore
     */
    constructor() {

    }

    /**
     * Set the JS object custom data. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update()} to send all changes at once.
     *
     * @param {object} customData - New custom data of the conversation
     * @memberOf Voximplant.Messaging.Conversation
     */
    setCustomData(customData) {
        this.customData = customData;
    }

    /**
     * Set the distinct flag. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update()} to send all changes at once.
     *
     * @param {boolean} distinct
     * @memberOf Voximplant.Messaging.Conversation
     */
    setDistinct(distinct) {
        this.distinct = distinct;
    }

    /**
     * Set the public join flag. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update()} to send all changes at once.
     *
     * @param {boolean} publicJoin
     * @memberOf Voximplant.Messaging.Conversation
     */
    setPublicJoin(publicJoin) {
        this.publicJoin = publicJoin;
    }

    /**
     * Set the conversation title. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update()} to send all changes at once.
     *
     * @param {string} title
     * @memberOf Voximplant.Messaging.Conversation
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Add new participants to the conversation. Duplicated users are ignored.
     * Will fail if any user does not exist. Triggers the MessengerEvents.EditConversation event for all messenger objects on all clients, including this one.
     *
     * @param {Array<ConversationParticipant>} participants - List of ConversationParticipant to be added to the conversation
     * @memberOf Voximplant.Messaging.Conversation
     */
    addParticipants(participants) {
        if (participants === undefined) {
            participants = [];
        }
        MessagingModule.addParticipants(this.uuid, participants);
    }

    /**
     * Change access rights for the existing participants. This function doesn't apply any changes to the participant list.
     * Use {@link Voximplant.Messaging.Conversation.addParticipants} or {@link Voximplant.Messaging.Conversation.removeParticipants} instead.
     * Triggers the MessengerEvents.EditConversation event for all messenger objects on all clients, including this one.
     *
     * @param {Array<ConversationParticipant>} participants - List of ConversationParticipant
     * @memberOf Voximplant.Messaging.Conversation
     */
    editParticipants(participants) {
        if (participants === undefined) {
            participants = [];
        }
        MessagingModule.editParticipants(this.uuid, participants);
    }

    /**
     * Remove participants from the conversation. Duplicated users are ignored. Will fail if any user does not exist.
     * Triggers the MessengerEvents.EditConversation event for all messenger objects on all clients, including this one.
     *
     * @param {Array<ConversationParticipant>} participants - List of ConversationParticipant to be removed from the conversation
     * @memberOf Voximplant.Messaging.Conversation
     */
    removeParticipants(participants) {
        if (participants === undefined) {
            participants = [];
        }
        MessagingModule.removeParticipants(this.uuid, participants);
    }

    /**
     * Send conversation changes to the server: title, public join flag, distinct flag and custom data.
     * Used to send all changes modified via properties.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    update() {
        MessagingModule.updateConversation(this.uuid, this.isUber, this.title, this.publicJoin, this.distinct, this.customData);
    }

    /**
     * Remove current conversation. All participants, including this one, will receive the MessengerEvents.RemoveConversation event.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    remove() {
        MessagingModule.removeConversation(this.uuid);
    }

    /**
     * Calling this method will inform backend that user is typing some text. Calls within 10s interval from the last call are discarded.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    typing() {
        MessagingModule.typing(this.uuid);
    }

    /**
     * Send message to the conversation. Triggers the MessengerEvents.SendMessage event for all messenger objects on all clients, including this one.
     *
     * @param {string} message - Message text
     * @param {Array<Voximplant.Messaging.Payload>} [payload] - Message payload
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    sendMessage(message, payload) {
        if (payload === undefined || payload === null) {
            payload = [];
        }
        MessagingModule.sendMessage(this.uuid, message, payload);
    }

    /**
     * Mark event as handled by current logged-in device. If single user is logged in on multiple devices,
     * this can be used to display delivery status by subscribing to the MessengerEvents.Delivered event.
     *
     * @param {number} sequence - Sequence number of the event to be marked as delivered
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    markAsDelivered(sequence) {
        if (sequence === undefined || sequence === null) {
            sequence = 0;
        }
        MessagingModule.markAsDelivered(this.uuid, sequence);
    }

    /**
     * Mark the event with the specified sequence as 'read'. This affects 'lastRead' and is used to display unread messages and events.
     * Triggers the MessengerEvents.Read event for all messenger objects on all connected clients, including this one.
     *
     * @param {number} sequence - Sequence number of the event to be marked as read
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    markAsRead(sequence) {
        if (sequence === undefined || sequence === null) {
            sequence = 0;
        }
        MessagingModule.markAsRead(this.uuid, sequence);
    }

    /**
     * Request events in the specified sequence range to be sent from server into this client. Used to get history or
     * get missed events in case of network disconnect.
     *
     * Please note that server will not push any events that was missed due to the client being offline.
     * Client should use this method to request all events based on the last event sequence received from the server and
     * last event sequence saved locally (if any).
     *
     * @param {number} eventsFrom - First event in range sequence, inclusive
     * @param {number} eventsTo - First event in range sequence, inclusive
     */
    retransmitEvents(eventsFrom, eventsTo) {
        // if (eventsFrom === undefined || eventsFrom === null) {
        //     eventsFrom = 0;
        // }
        // if (eventsTo === undefined || eventsTo === null) {
        //     eventsTo = 0;
        // }
        MessagingModule.retransmitEvents(this.uuid, eventsFrom, eventsTo);
    }
}