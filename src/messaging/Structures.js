/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * @memberOf Voximplant.Messaging
 * @property {string} userId - Voximplant user identifier, for example 'username@appname.accname'
 * @property {object} customData - Public JavaScript object custom data, available to all users
 * @property {object} privateCustomData - Private JavaScript object custom data, available only to the user himself
 * @property {array} conversationsList - List of UUIDs for the conversations the user is joined. Only available if user queries information about himself.
 * @property {array} leaveConversationList - List of UUIDs for uber conversations that user was joined, but currently is not participating in.
 * @property {array} messengerNotifications - List of messenger notifications that current user is subscribed to
 */
const User = {

};

/**
 * @memberOf Voximplant.Messaging
 * @property {boolean} online - True if user is online
 * @property {number} timestamp - UNIX timestamp integer that specifies the time event was triggered
 */
const UserStatus = {

};

/**
 * @memberOf Voximplant.Messaging
 * @property {boolean} canManageParticipants - If 'true', user can add, remove and edit access rights for conversation participants (but not conversation moderators)
 * @property {boolean} canWrite - If 'true', user can write to the conversation
 * @property {string} userId - Voximplant user identifier, ex 'username@appname.accname'
 */
const ConversationParticipant = {

};

/**
 * @memberOf Voximplant.Messaging
 * @property {string} title - Payload fragment unique title. Used to identifier fragment in the list of fragments associated with the message.
 * @property {string} type - Arbitrary payload type string.
 * @property {object} data - JavaScript object payload data.
 */
const Payload = {

};