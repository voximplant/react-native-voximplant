/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    NativeModules,
} from 'react-native';

const MessagingModule = NativeModules.VIMessagingModule;

/**
 * @memberOf Voximplant.Messaging
 * @class Message
 * @classdesc Interface that represents a message within a conversation.
 */
export default class Message {

    /**
     * @member {string} conversation - The UUID of the conversation this message belongs to. The message can belong to the one conversation only.
     * @memberOf Voximplant.Messaging.Message
     */
    conversation;

    /**
     * @member {Array<object>} payload - The array of payload objects associated with the message.
     * @memberOf Voximplant.Messaging.Message
     */
    payload;

    /**
     * @member {number} sequence - The message sequence number in the conversation.
     * @memberOf Voximplant.Messaging.Message
     */
    sequence;

    /**
     * @member {string} text - The text of this message.
     * @memberOf Voximplant.Messaging.Message
     */
    text;

    /**
     * @member {string} uuid - The universally unique identifier (UUID) of the message.
     * @memberOf Voximplant.Messaging.Message
     */
    uuid;

    /**
     * @ignore
     */
    constructor() {}

    /**
     * Send text and payload changes to the cloud.
     *
     * The participant that calls this method should have:
     * - the {@link Voximplant.Messaging.ConversationParticipant#canEditMessages} permission to update its own messages
     * - the {@link Voximplant.Messaging.ConversationParticipant#canEditAllMessages} permission to update other participants' messages
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about the message
     * updating via the {@link Voximplant.Messaging.MessengerEventTypes.EditMessage} event.
     *
     * To be informed about the message updating while being offline, participants can subscribe
     * to the {@link Voximplant.Messaging.MessengerNotification.EditMessage} messenger push notification.
     *
     * @param {string} text - New text of this message, maximum 5000 characters. If null, message text will not be updated.
     * @param {Array<object>} payload - New payload of this message. If null, message payload will not be updated.
     * @return {Promise<EventHandlers.MessageEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Message
     */
    update(text, payload) {
        if (text === undefined) {
            text = this.text;
        }
        if (payload === undefined) {
            payload = this.payload;
        }
        return new Promise((resolve, reject) => {
            MessagingModule.updateMessage(this.conversation, this.uuid, text, payload, (messageEvent, errorEvent) => {
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
     * Remove the message from the conversation.
     *
     * The participant that calls this method should have:
     * - the {@link Voximplant.Messaging.ConversationParticipant#canRemoveMessages} permission to remove its own messages
     * - the {@link Voximplant.Messaging.ConversationParticipant#canRemoveAllMessages} permission to remove other participants' messages
     *
     * Other parties of the conversation (online participants and logged in clients) can be informed about
     * the message removing via the {@link Voximplant.Messaging.MessengerEventTypes.RemoveMessage} event.
     *
     * @return {Promise<EventHandlers.MessageEvent|EventHandlers.ErrorEvent>}
     * @memberOf Voximplant.Messaging.Message
     */
    remove() {
        return new Promise((resolve, reject) => {
            MessagingModule.removeMessage(this.conversation, this.uuid, (messageEvent, errorEvent) => {
                if (messageEvent) {
                    Message._processMessageEvent(messageEvent);
                    resolve(messageEvent);
                } else {
                    reject(errorEvent);
                }
            });
        });
    }

    static _processMessageEvent(event) {
        let message = new Message();
        message.conversation = event.message.conversation;
        message.payload = event.message.payload;
        message.sequence = event.message.sequence;
        message.text = event.message.text;
        message.uuid = event.message.uuid;
        delete event.message;
        event.message = message;
    }
}