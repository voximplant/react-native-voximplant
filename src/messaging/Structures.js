/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Interface that represents user information. Voximplant users are created via the Voximplant control panel or
 * [HTTP API](https://voximplant.com/docs/references/httpapi/managing_users#adduser).
 *
 * @property {string} name - Voximplant user identifier, for example 'username@appname.accname'
 * @property {number} imId - IM unique id that is used to identify users in events and specify in user-related methods
 * @property {string} displayName - User's display name which is specified during user creation. The display name is available to all users.
 * @property {object} customData - JavaScript object with public custom data, available to all users
 * @property {object} privateCustomData - JavaScript object with private custom data, available only to the user himself
 * @property {array} conversationList - Array of UUIDs for the conversations the user currently belongs to.
 * Only available if user queries information about himself.
 * @property {array} leaveConversationList - Array of UUIDs for uber conversations that user was joined, but currently is not participating in.
 * @property {array} notifications - Array of messenger notifications that current user is subscribed to
 * @property {boolean} isDeleted - Check if the user is deleted or not
 *
 * @memberOf Voximplant.Messaging
 */
const User = {

};

/**
 * Interface that represents a conversation participant and its permissions.
 *
 * @property {number} imUserId - IM User id
 *
 * @property {boolean} [canWrite] - Specify if the participant can write in the conversation.
 *
 * The permission is given by default.
 *
 * It could be changed only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * @property {boolean} [canManageParticipants] - Specify if the conversation participant can manage other participants in the conversation:
 * - add, remove and edit permissions
 * - add and remove participants
 *
 * It could be set only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * If the user that calls this method has both canManageParticipants and isOwner permissions, it can edit other owners.
 *
 * @property {boolean} [canEditMessages] - Specify if the participant can edit its own messages in the conversation.
 *
 * The permission is given by default.
 *
 * It could be changed only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * If the user that calls this method has both canManageParticipants and owner permissions, it can edit other owners.
 *
 * @property {boolean} [canEditAllMessages] - Specify if the participant can edit messages other than its own.
 *
 * It could be set only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * If the user that calls this method has both canManageParticipants and isOwner permissions, it can edit other owners.
 *
 * @property {boolean} [canRemoveMessages] - Specify if the participant can remove its own messages in the conversation.
 *
 * The permission is given by default.
 *
 * It could be changed only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * If the user that calls this method has both canManageParticipants and isOwner permissions, it can edit other owners.
 *
 * @property {boolean} [canRemoveAllMessages] - Specify if the participant can remove messages other than its own.
 *
 * It could be changed only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} permission.
 *
 * If the user that calls this method has both canManageParticipants and isOwner permissions, it can edit other owners.
 *
 * @property {boolean} [owner] - Specify if the conversation participant is the owner.
 *
 * It could be set only if the user that calls this method has
 * the {@link Voximplant.Messaging.ConversationParticipant#canManageParticipants} and
 * {@link Voximplant.Messaging.ConversationParticipant#owner} permissions.
 *
 * There could be more than one owner in the conversation.
 *
 * If true, the participant can edit the conversation. If true and canManageParticipants is true, the participant can manage other owners.
 *
 * @property {number} [lastReadEventSequence] - Sequence of the event that was last marked as read or 0,
 * if the participant didn't mark events as read.
 *
 * Participants mark events as read via {@link Voximplant.Messaging.Conversation#markAsRead}.
 *
 * @memberOf Voximplant.Messaging
 */
const ConversationParticipant = {

};

/**
 * Configuration either to create a new conversation or restore a previously created conversation.
 *
 * @property {object} [customData] - Custom data of the conversation (up to 5kb).
 *
 *
 * @property {boolean} [direct] - Set if the conversation is direct.
 *
 * There can be only 2 participants in a direct conversation which is unique and the only one for these participants.
 * There can't be more than 1 direct conversation for the same 2 users.
 *
 * If one of these users tries to create a new direct conversation with the same participant via {@link Voximplant.Messaging.Messenger#createConversation},
 * the method will return the UUID of the already existing direct conversation.
 *
 * A direct conversation can't be uber and/or public.
 *
 *
 * @property {boolean} [publicJoin] - Set the conversation to be public or not.
 *
 * It can be later changed via {@link Voximplant.Messaging.Conversation#publicJoin}.
 *
 * If true, any user can join the conversation via {@link Voximplant.Messaging.Messenger#joinConversation} by specifying its UUID.
 * Use the {@link Voximplant.Messaging.Messenger.getPublicConversations} method to retrieve all public conversations' UUIDs.
 *
 * A public conversation can't be direct.
 *
 *
 * @property {Array<Voximplant.Messaging.ConversationParticipant>} [participants] - Set the conversation participants.
 *
 * The participants array can be later changed via:
 * 1. {@link Voximplant.Messaging.Conversation.addParticipants}
 * 2. {@link Voximplant.Messaging.Conversation.removeParticipants}
 *
 * @property {string} [title] - Set the conversation title.
 *
 * It can be later changed via {@link Voximplant.Messaging.Conversation#title}.
 *
 *
 * @property {boolean} [uber] - Set if the conversation is a uber conversation.
 *
 * Users in a uber conversation will not be able to retrieve messages that were posted to the conversation after they quit.
 *
 * A uber conversation can't be direct.
 *
 * @memberOf Voximplant.Messaging
 */
const ConversationConfig = {

};