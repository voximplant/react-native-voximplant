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


    constructor() {}

    setText(text) {
        this.text = text;
    }

    setPayload(payload) {
        this.payload = payload;
    }

    update() {
        MessagingModule.updateMessage(this.conversation, this.uuid, this.text, this.payload);
    }


}