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
 * @class Message
 * @classdesc Describes single message. Received via the 'onSendMessage' or 'onEditMessage' events and used to edit the message.
 */
export default class Message {

    /**
     * @member {string} conversation - UUID of the conversation this message belongs to.
     * @memberOf Voximplant.Messaging.Message
     */
    conversation;

    /**
     * @member {Array<Payload>} payload - Array of 'Payload' objects associated with the message.
     * @memberOf Voximplant.Messaging.Message
     */
    payload;

    /**
     * @member {string} sender - User id of the sender of this message.
     * @memberOf Voximplant.Messaging.Message
     */
    sender;

    /**
     * @member {number} sequence - Message sequence number.
     * @memberOf Voximplant.Messaging.Message
     */
    sequence;

    /**
     * @member {string} text - Text of this message.
     * @memberOf Voximplant.Messaging.Message
     */
    text;

    /**
     * @member {string} uuid - Universally unique identifier of message.
     * @memberOf Voximplant.Messaging.Message
     */
    uuid;

    /**
     * @ignore
     */
    constructor() {}

    /**
     * New text of this message.
     *
     * @param {number} text
     *
     * @memberOf Voximplant.Messaging.Message
     */
    setText(text) {
        this.text = text;
    }

    /**
     * New payload of the message
     *
     * @param {Array<Voximplant.Messaging.Payload>} payload
     *
     * @memberOf Voximplant.Messaging.Message
     */
    setPayload(payload) {
        this.payload = payload;
    }

    /**
     * Sends text and payload changes to the server.
     *
     * @memberOf Voximplant.Messaging.Message
     */
    update() {
        MessagingModule.updateMessage(this.conversation, this.uuid, this.text, this.payload);
    }

    /**
     * Remove the message. Triggers the MessengerEvents.RemoveMessage event for all messenger objects on all clients, including this one.
     *
     * @memberOf Voximplant.Messaging.Message
     */
    remove() {
        MessagingModule.removeMessage(this.conversation, this.uuid);
    }


}