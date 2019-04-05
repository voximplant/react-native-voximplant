/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    NativeModules,
} from 'react-native';

import Message from './Message';
import MessagingShared from "./MessagingShared";
import MessengerEventTypes from "./MessengerEventTypes";
const MessagingModule = NativeModules.VIMessagingModule;

/**
 * @memberOf Voximplant.Messaging
 * @class Conversation
 * @classdesc Class that may be used to manage a conversation.
 */
export default class Conversation {

    /**
     * @member {number} createdTime - UNIX timestamp (seconds) that specifies the time of the conversation creation.
     * @memberOf Voximplant.Messaging.Conversation
     */
    createdTime;

    /**
     * @member {object} customData - JavaScript object with custom data, up to 5kb.
     *
     * Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    customData;

    /**
     * @member {boolean} direct - Check if the conversation is direct.
     *
     * A direct conversation can't be uber and/or public.
     *
     * There can be only 2 participants in a direct conversation which is unique and the only one for these participants.
     * There can't be more than 1 direct conversation for the same 2 users.
     *
     * If one of these users tries to create a new direct conversation with the same participant via
     * {@link Voximplant.Messaging.Messenger#createConversation}, the method will return the UUID of the already existing direct conversation.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    direct;

    /**
     * @member {number} lastSequence - Sequence of the last event in the conversation.
     * @memberOf Voximplant.Messaging.Conversation
     */
    lastSequence;

    /**
     * @member {number} lastUpdateTime - UNIX timestamp (seconds) that specifies the time when one of
     * {@link EventHandlers.ConversationEvent} or {@link EventHandlers.MessageEvent} was the last provoked event in this conversation.
     * @memberOf Voximplant.Messaging.Conversation
     */
    lastUpdateTime;

    /**
     * @member {Array<Voximplant.Messaging.ConversationParticipant>} participants - Array of participants alongside with their permissions.
     * @memberOf Voximplant.Messaging.Conversation
     */
    participants;

    /**
     * @member {boolean} publicJoin - Check if a conversation is public or not. If true, anyone can join the conversation by UUID.
     *
     * A public conversation can't be direct.
     *
     * Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
     * @memberOf Voximplant.Messaging.Conversation
     */
    publicJoin;

    /**
     * @member {string} title - Th current conversation title.
     *
     * Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    title;

    /**
     * @member {string} uuid - Universally unique identifier (UUID) of this conversation.
     * @memberOf Voximplant.Messaging.Conversation
     */
    uuid;

    /**
     * @member {boolean} uber - Check if the conversation is uber or not.
     *
     * A uber conversation can't be direct.
     *
     * Users in a uber conversation will not be able to retrieve messages that were posted to the conversation after they quit.
     * @memberOf Voximplant.Messaging.Conversation
     */
    uber;

    /**
     * @ignore
     */
    constructor() {

    }

    /**
     * Set the JS object custom data. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
     *
     * @param {object} customData - New custom data of the conversation
     * @memberOf Voximplant.Messaging.Conversation
     */
    setCustomData(customData) {
        this.customData = customData;
    }

    /**
     * Set the public join flag. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
     *
     * @param {boolean} publicJoin
     * @memberOf Voximplant.Messaging.Conversation
     */
    setPublicJoin(publicJoin) {
        this.publicJoin = publicJoin;
    }

    /**
     * Set the conversation title. Note that setting this property does not send changes to the server.
     * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
     *
     * @param {string} title
     * @memberOf Voximplant.Messaging.Conversation
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Add new participants to the conversation.
     *
     * It's possible only on the following conditions:
     * - the participants are users of the main Voximplant developer account or its child accounts
     * - the current user can manage other participants ({@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} is true)
     * - the conversation is not a direct one ({@link Voximplant.Messaging.Conversation#direct} is false)
     *
     * Duplicated users are ignored. The promise will be rejected with {@link EventHandlers.ErrorEvent} if at least one user does not exist
     * or already belongs to the conversation.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about adding
     * participants via the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @param {Array<Voximplant.Messaging.ConversationParticipant>} participants - Array of ConversationParticipant to be added to the conversation.
     * Should not be null or empty array
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    addParticipants(participants) {
        return new Promise((resolve, reject) => {
            MessagingModule.addParticipants(this.uuid, participants, (conversationEvent, errorEvent) => {
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
     * Edit participants' permissions. It's possible only if the current user can manage other participants
     * ({@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} is true).
     *
     * Duplicated users are ignored. The list of participants must contain all participants.
     * Other parties of the conversation (online participants and logged in clients) can be informed about editing
     * participants via the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @param {Array<Voximplant.Messaging.ConversationParticipant>} participants - Array of ConversationParticipant to be edited in the conversation.
     * Should not be null or empty array
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    editParticipants(participants) {
        return new Promise((resolve, reject) => {
            MessagingModule.editParticipants(this.uuid, participants, (conversationEvent, errorEvent) => {
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
     * Remove participants from the conversation.
     * It's possible only on two conditions:
     * - the current user can manage other participants ({@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} is true).
     * - the conversation is not a direct one ({@link Voximplant.Messaging.Conversation#direct} is false)
     *
     * Duplicated users are ignored. The promise will be rejected with {@link EventHandlers.ErrorEvent} if at least one user:
     * - does not exist
     * - is already removed
     *
     * Note that you can remove participants that are marked as deleted ({@link Voximplant.Messaging.User#isDeleted} is true).
     *
     * The removed participants can later get this conversation's UUID via the {@link Voximplant.Messaging.User#leaveConversationList}.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about removing participants
     * via the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @param {Array<Voximplant.Messaging.ConversationParticipant>} participants - Array of ConversationParticipant to be removed from the conversation.
     * Should not be null or empty array
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    removeParticipants(participants) {
        return new Promise((resolve, reject) => {
            MessagingModule.removeParticipants(this.uuid, participants, (conversationEvent, errorEvent) => {
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
     * Send conversation changes to the cloud. The sent changes are: title, public join flag and custom data.
     *
     * Successful update will happen if a participant is the owner ({@link Voximplant.Messaging.ConversationParticipant#owner} is true).
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about changing
     * the title or custom data and enabling/disabling public join via
     * the {@link Voximplant.Messaging.MessengerEventTypes.EditConversation} event.
     *
     * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    update() {
        return new Promise((resolve, reject) => {
            MessagingModule.updateConversation(this.uuid, this.title, this.publicJoin,
                this.customData, this.uber, this.direct, (conversationEvent, errorEvent) => {
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
     * Inform the cloud that the user is typing some text.
     *
     * The promise will be rejected with {@link EventHandlers.ErrorEvent} for the method calls within 10s interval from the last call cause.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about typing
     * via the {@link Voximplant.Messaging.MessengerEventTypes.Typing} event.
     *
     * @return {Promise<EventHandlers.ConversationServiceEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    typing() {
        return new Promise((resolve, reject) => {
            MessagingModule.typing(this.uuid, (conversationServiceEvent, errorEvent) => {
                if (conversationServiceEvent) {
                    resolve(conversationServiceEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Send a message to the conversation.
     *
     * Sending messages is available only for participants that have write permissions
     * ({@link Voximplant.Messaging.ConversationParticipant#canWrite} is true).
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about
     * sending messages to the conversation via the {@link Voximplant.Messaging.MessengerEventTypes.SendMessage} event.
     *
     * To be informed about sending messages while being offline, participants can subscribe
     * to the {@link Voximplant.Messaging.MessengerNotification.SendMessage} messenger push notification.
     *
     * @param {string} text - Message text, maximum 5000 characters
     * @param {Array<object>} [payload] - Message payload
     * @return {Promise<EventHandlers.MessageEvent|EventHandlers.ErrorEvent>}
     *
     * @memberOf Voximplant.Messaging.Conversation
     */
    sendMessage(text, payload) {
        return new Promise((resolve, reject) => {
            MessagingModule.sendMessage(this.uuid, text, payload, (messageEvent, errorEvent) => {
                if (messageEvent) {
                    Message._processMessageEvent(messageEvent);
                    resolve(messageEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Mark the event with the specified sequence as read.
     *
     * A method call with the specified sequence makes the {@link Voximplant.Messaging.ConversationParticipant#lastReadEventSequence}
     * return this sequence, i.e., such sequences can be get for each participant separately.
     *
     * If the sequence parameter specified less than 1, the method will mark all the events as unread (for this participant)
     * except the event with the sequence equals to '1'.
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about marking events
     * as read via the {@link Voximplant.Messaging.MessengerEventTypes.Read} event.
     *
     * @param {number} sequence - Sequence number of the event in the conversation to be marked as read. Shouldn't be greater than currently possible.
     * @return {Promise<EventHandlers.ConversationServiceEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    markAsRead(sequence) {
        return new Promise((resolve, reject) => {
            MessagingModule.markAsRead(this.uuid, sequence, (conversationServiceEvent, errorEvent) => {
                if (conversationServiceEvent) {
                    resolve(conversationServiceEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Request events in the specified sequence range to be sent from the cloud to this client.
     *
     * Only {@link EventHandlers.ConversationEvent} and {@link EventHandlers.MessageEvent} events can be retransmitted;
     * any other events can't be retransmitted.
     *
     * The method is used to get history or missed events in case of network disconnect. Client should use this method
     * to request all events based on the last event sequence received from the cloud and last event sequence saved locally (if any).
     *
     * The maximum amount of retransmitted events per method call is 100. The promise will be rejected with {@link EventHandlers.ErrorEvent}
     * if more than 100 events are requested.
     *
     * If the current user quits a {@link Voximplant.Messaging.Conversation#uber} conversation, messages that are posted
     * during the user's absence will not be retransmitted later.
     *
     * @param {number} from - First event in range sequence, inclusive
     * @param {number} to - Last event in sequence range, inclusive
     * @return {Promise<EventHandlers.RetransmitEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    retransmitEvents(from, to) {
        return new Promise((resolve, reject) => {
            MessagingModule.retransmitEvents(this.uuid, from, to, (retransmitEvent, errorEvent) => {
                if (retransmitEvent) {
                    Conversation._processRetransmitEvent(retransmitEvent);
                    resolve(retransmitEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Request a number of events starting with the specified sequence to be sent from the cloud to this client.
     *
     * Only {@link EventHandlers.ConversationEvent} and {@link EventHandlers.MessageEvent} events can be retransmitted;
     * any other events can't be retransmitted.
     *
     * The method is used to get history or missed events in case of network disconnect. Client should use this method
     * to request all events based on the last event sequence received from the cloud and last event sequence saved locally (if any).
     *
     * The maximum amount of retransmitted events per method call is 100. The promise will be rejected with {@link EventHandlers.ErrorEvent}
     * if more than 100 events are requested.
     *
     * If the current user quits a {@link Voximplant.Messaging.Conversation#uber} conversation, messages that are posted
     * during the user's absence will not be retransmitted later.
     *
     * The result contains maximum available events for the current user even if it's less than the specified count value.
     *
     * @param {number} from - First event in sequence range, inclusive
     * @param {number} count - Number of events
     * @return {Promise<EventHandlers.RetransmitEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    retransmitEventsFrom(from, count) {
        return new Promise((resolve, reject) => {
            MessagingModule.retransmitEventsFrom(this.uuid, from, count, (retransmitEvent, errorEvent) => {
                if (retransmitEvent) {
                    Conversation._processRetransmitEvent(retransmitEvent);
                    resolve(retransmitEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    /**
     * Request a number of events up to the specified sequence to be sent from the cloud to this client.
     *
     * Only {@link EventHandlers.ConversationEvent} and {@link EventHandlers.MessageEvent} events can be retransmitted;
     * any other events can't be retransmitted.
     *
     * The method is used to get history or missed events in case of network disconnect. Client should use this method
     * to request all events based on the last event sequence received from the cloud and last event sequence saved locally (if any).
     *
     * The maximum amount of retransmitted events per method call is 100. The promise will be rejected with {@link EventHandlers.ErrorEvent}
     * if more than 100 events are requested.
     *
     * If the current user quits a {@link Voximplant.Messaging.Conversation#uber} conversation, messages that are posted
     * during the user's absence will not be retransmitted later.
     *
     * The result contains maximum available events for the current user even if it's less than the specified count value.
     *
     * @param {number} to - Last event in sequence range, inclusive
     * @param {number} count - Number of events
     * @return {Promise<EventHandlers.RetransmitEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Conversation
     */
    retransmitEventsTo(to, count) {
        return new Promise((resolve, reject) => {
            MessagingModule.retransmitEventsTo(this.uuid, to, count, (retransmitEvent, errorEvent) => {
                if (retransmitEvent) {
                    Conversation._processRetransmitEvent(retransmitEvent);
                    resolve(retransmitEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    static _processConversationEvent(event) {
        // console.log('_processConversationEvent start');
        let conversation = new Conversation();
        conversation.createdTime = event.conversation.createdTime;
        conversation.uuid = event.conversation.uuid;
        conversation.participants = event.conversation.participants;
        conversation.uber = event.conversation.uber;
        conversation.lastSequence = event.conversation.lastSequence;
        conversation.publicJoin = event.conversation.publicJoin;
        conversation.direct = event.conversation.direct;
        conversation.lastUpdateTime = event.conversation.lastUpdateTime;
        conversation.customData = event.conversation.customData;
        conversation.title = event.conversation.title;
        delete event.conversation;
        event.conversation = conversation;
        // console.log('_processConversationEvent end');
    }

    static _processRetransmitEvent(event) {
        if (event.events) {
            for (let retransmitEvent of event.events) {
                if (retransmitEvent.hasOwnProperty('conversation')) {
                    Conversation._processConversationEvent(retransmitEvent);
                }
                if (retransmitEvent.hasOwnProperty('message')) {
                    Message._processMessageEvent(retransmitEvent);
                }
            }
        }
    }
}