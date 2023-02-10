declare module 'react-native-voximplant' {
  import React from 'react';
  import { ViewProps } from 'react-native';

  namespace Voximplant.Messaging {
    export class Messenger {
      /**
       * Remove handler for specified event
       *
       * @param {Voximplant.Messaging.MessengerEventTypes} eventType
       * @param {function} event - Handler function. If not specified, all handlers for the event type will be removed.
       */
      public off<K extends MessengerEventTypes>(
        eventType: K,
        handler?: (event: MessengerHandlerEvents[K]) => void,
      ): void;

      /**
       * Register handler for specified messenger event.
       * Use {@link Voximplant.Messaging.Messenger.off} method to delete a handler.
       *
       * @param {Voximplant.Messaging.MessengerEventTypes} eventType
       * @param {function} event
       */
      public on<K extends MessengerEventTypes>(
        eventType: K,
        handler: (event: MessengerHandlerEvents[K]) => void,
      ): void;

      /**
       * Create a new conversation with the extended configuration.
       *
       * Other parties of the conversation (online participants and logged in clients) can be informed about
       * the conversation creation via the {@link Voximplant.Messaging.MessengerEventTypes.CreateConversation}.
       *
       * @param {Voximplant.Messaging.ConversationConfig} [conversationConfig] - ConversationConfig instance with extended conversation parameters
       * @return {Promise<EventHandlers.ConversationEvent|EventHandlers.ErrorEvent>}
       */
      public createConversation(
        conversationConfig?: ConversationConfig,
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public editUser(
        customData?: object,
        privateCustomData?: object,
      ): Promise<MessengerUserEvent | MessengerErrorEvent>;

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
       */
      public getConversation(
        uuid: string,
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public getConversations(
        uuids: string[],
      ): Promise<MessengerConversationEvent[] | MessengerErrorEvent>;

      /**
       * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
       *
       * @return {string}
       */
      public getMe(): string | null;

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
       */
      public getPublicConversations(): Promise<
        MessengerGetPublicConversationsEvent | MessengerErrorEvent
      >;

      /**
       * Get all current subscriptions, i.e., the array of users the current user is subscribed to.
       *
       * Only the client that called the method can be informed about getting subscriptions.
       *
       * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
       */
      public getSubscriptions(): Promise<
        MessengerSubscriptionEvent | MessengerErrorEvent
      >;

      /**
       * Get information for the user specified by the IM user id.
       *
       * It's possible to get any user of the main Voximplant developer account or its child accounts.
       *
       * Only the client that called the method can be informed about getting user information.
       *
       * @param {number} userId -  IM User id
       * @return {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
       */
      public getUserByIMId(
        userId: number,
      ): Promise<MessengerUserEvent | MessengerErrorEvent>;

      /**
       * Get information for the users specified by the array of the Voximplant user names. Maximum 50 users.
       *
       * It's possible to get any users of the main Voximplant developer account or its child accounts.
       *
       * Only the client that called the method can be informed about getting users information.
       *
       * @param {Array<string>} users - Array of Voximplant user identifiers
       * @return {Promise<Array<EventHandlers.UserEvent>|EventHandlers.ErrorEvent>}
       */
      public getUserByName(
        username: string,
      ): Promise<MessengerUserEvent | MessengerErrorEvent>;

      /**
       * Get information for the users specified by the array of the Voximplant user names. Maximum 50 users.
       *
       * It's possible to get any users of the main Voximplant developer account or its child accounts.
       *
       * Only the client that called the method can be informed about getting users information.
       *
       * @param {Array<string>} users - Array of Voximplant user identifiers
       * @return {Promise<Array<EventHandlers.UserEvent>|EventHandlers.ErrorEvent>}
       */
      public getUsersByName(
        users: string[],
      ): Promise<MessengerUserEvent[] | MessengerErrorEvent>;

      /**
       * Get information for the users specified by the array of the IM user ids. Maximum 50 users.
       *
       * It's possible to get any users of the main Voximplant developer account or its child accounts.
       *
       * Only the client that called the method can be informed about getting users information.
       * @param {Array<number>} users - Array of IM user ids
       * @return {Promise<Array<EventHandlers.UserEvent>|EventHandlers.ErrorEvent>}
       */
      public getUsersByIMId(
        users: number[],
      ): Promise<MessengerUserEvent[] | MessengerErrorEvent>;

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
       */
      public joinConversation(
        uuid: string,
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public leaveConversation(
        uuid: string,
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

      /**
       * Manage messenger push notification subscriptions for the current user.
       *
       * Other logged in clients (of the current user) can be informed about managing push notifications via
       * {@link Voximplant.Messaging.MessengerEventTypes.EditUser}
       *
       * @param {Array<Voximplant.Messaging.MessengerNotification>} notifications - Array of messenger notification types
       * @return {Promise<EventHandlers.UserEvent|EventHandlers.ErrorEvent>}
       */
      public managePushNotifications(
        notifications: MessengerNotification[],
      ): Promise<MessengerUserEvent | MessengerErrorEvent>;

      /**
       * Set the current user status.
       *
       * Other users (that are subscribed to the user) and other clients (of the current user) can be informed about
       * the status changing via the {@link Voximplant.Messaging.MessengerEventTypes.SetStatus} event.
       *
       * @param {boolean} online - True if user is available for messaging, false otherwise
       * @return {Promise<EventHandlers.StatusEvent|EventHandlers.ErrorEvent>}
       */
      public setStatus(
        online: boolean,
      ): Promise<MessengerSetStatusEvent | MessengerErrorEvent>;

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
       */
      public subscribe(
        users: number[],
      ): Promise<MessengerSubscriptionEvent | MessengerErrorEvent>;

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
       */
      public unsubscribe(
        users: number[],
      ): Promise<MessengerSubscriptionEvent | MessengerErrorEvent>;

      /**
       * Unsubscribe from all subscriptions.
       *
       * Other logged in clients (of the current user) can be informed about the unsubscription via
       * the {@link Voximplant.Messaging.MessengerEventTypes.Unsubscribe} event.
       *
       * Other users aren't informed about the unsubscription.
       * @return {Promise<EventHandlers.SubscriptionEvent|EventHandlers.ErrorEvent>}
       */
      public unsubscribeFromAll(): Promise<
        MessengerSubscriptionEvent | MessengerErrorEvent
      >;
    }

    export interface ConversationConfig {
      /**
       * Custom data of the conversation (up to 5kb).
       */
      customData?: object;

      /**
       * Specifies if the conversation is direct.
       * There can be only 2 participants in a direct conversation which is
       * unique and the only one for these participants.
       * There can't be more than 1 direct conversation for the same 2 users.
       * If one of these users tries to create a new direct conversation
       * with the same participant via Messenger.createConversation,
       * the method will return the UUID of the already existing direct conversation.
       * A direct conversation can't be uber and/or public.
       */
      direct?: boolean;

      /**
       * The conversation participants. The participants array can be changed via:
       * - Conversation.addParticipants
       * - Conversation.removeParticipants
       */
      participants: ConversationParticipant[];

      /**
       * The conversation to be public or not. It can be changed via [Conversation.publicJoin}.
       * If true, any user can join the conversation via Messenger.joinConversation
       * by specifying its UUID. Use the Messenger.getPublicConversations method to retrieve
       * all public conversations' UUIDs. A public conversation can't be direct.
       */
      publicJoin?: boolean;

      /**
       * The conversation title. It can be changed via Conversation.title.
       */
      title?: string;

      /**
       * Specifies if the conversation is a uber conversation.
       * Users in a uber conversation will not be able to retrieve
       * messages that were posted to the conversation after they quit.
       * A uber conversation can't be direct.
       */
      uber?: boolean;
    }

    export class Conversation {
      /**
       * UNIX timestamp (seconds) that specifies the time of the conversation creation.
       */
      public createdTime: number;

      /**
       * JavaScript object with custom data, up to 5kb.
       *
       * Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
       *
       */
      public customData: object;

      /**
       * Check if the conversation is direct.
       *
       * A direct conversation can't be uber and/or public.
       *
       * There can be only 2 participants in a direct conversation which is unique and the only one for these participants.
       * There can't be more than 1 direct conversation for the same 2 users.
       *
       * If one of these users tries to create a new direct conversation with the same participant via
       * {@link Voximplant.Messaging.Messenger#createConversation}, the method will return the UUID of the already existing direct conversation.
       *
       */
      public direct: boolean;

      /**
       * Sequence of the last event in the conversation.
       */
      public lastSequence: number;

      /**
       * UNIX timestamp (seconds) that specifies the time when one of
       * {@link EventHandlers.ConversationEvent} or {@link EventHandlers.MessageEvent} was the last provoked event in this conversation.
       */
      public lastUpdateTime: number;

      /**
       * Array of participants alongside with their permissions.
       */
      public participants: ConversationParticipant[];

      /**
       * Check if a conversation is public or not. If true, anyone can join the conversation by UUID.
       *
       * A public conversation can't be direct.
       *
       * Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
       */
      public publicJoin: boolean;

      /**
       * Th current conversation title.
       *
       * Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation.update} to send all changes at once.
       *
       */
      public title: string;

      /**
       * Universally unique identifier (UUID) of this conversation.
       */
      public uuid: string;

      /**
       * Check if the conversation is uber or not.
       *
       * A uber conversation can't be direct.
       *
       * Users in a uber conversation will not be able to retrieve messages that were posted to the conversation after they quit.
       */
      public uber: boolean;

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
       */
      public addParticipants(
        participants: ConversationParticipant[],
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public editParticipants(
        participants: ConversationParticipant[],
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public markAsRead(
        sequence: number,
      ): Promise<MessengerReadEvent | MessengerErrorEvent>;

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
       */
      public removeParticipants(
        participants: ConversationParticipant[],
      ): Promise<MessengerConversationEvent | MessengerErrorEvent>;

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
       */
      public retransmitEvents(
        from: number,
        to: number,
      ): Promise<MessengerRetransmitEventsEvent | MessengerErrorEvent>;

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
       */
      public retransmitEventsFrom(
        from: number,
        count: number,
      ): Promise<MessengerRetransmitEventsEvent | MessengerErrorEvent>;

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
       */
      public retransmitEventsTo(
        to: number,
        count: number,
      ): Promise<MessengerRetransmitEventsEvent | MessengerErrorEvent>;

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
       */
      public sendMessage(
        text: string,
        payload?: object[],
      ): Promise<MessengerMessageEvent | MessengerErrorEvent>;

      /**
       * Set the JS object custom data. Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
       *
       * @param {object} customData - New custom data of the conversation
       */
      public setCustomData(customData: object): void;

      /**
       * Set the public join flag. Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
       *
       * @param {boolean} publicJoin
       */
      public setPublicJoin(publicJoin: boolean): void;

      /**
       * Set the conversation title. Note that setting this property does not send changes to the server.
       * Use the {@link Voximplant.Messaging.Conversation#update} to send all changes at once.
       *
       * @param {string} title
       */
      public setTitle(title: string): void;

      /**
       * Inform the cloud that the user is typing some text.
       *
       * The promise will be rejected with {@link EventHandlers.ErrorEvent} for the method calls within 10s interval from the last call cause.
       *
       * Other parties of the conversation (online participants and logged in clients) can be informed about typing
       * via the {@link Voximplant.Messaging.MessengerEventTypes.Typing} event.
       *
       * @return {Promise<EventHandlers.ConversationServiceEvent|EventHandlers.ErrorEvent>}
       */
      public typing(): Promise<MessengerTypingEvent | MessengerErrorEvent>;

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
       */
      public update(): Promise<
        MessengerConversationEvent | MessengerErrorEvent
      >;
    }

    export interface ConversationParticipant {
      /**
       * Specify if the participant can edit messages other than its own.
       * It could be set only if the user that calls this method has
       * the ConversationParticipant.canManageParticipants permission.
       * If the user that calls this method has both canManageParticipants
       * and isOwner permissions, it can edit other owners.
       */
      canEditAllMessages?: boolean;

      /**
       * Specify if the participant can edit its own messages in the conversation.
       * The permission is given by default. It could be changed only if the user
       * that calls this method has the ConversationParticipant.canManageParticipants permission.
       * If the user that calls this method has both canManageParticipants and owner permissions,
       * it can edit other owners.
       */
      canEditMessages?: boolean;

      /**
       * Specify if the conversation participant can manage other participants in the conversation:
       * - add, remove and edit permissions
       * - add and remove participants It could be set only if the user that calls
       * this method has the ConversationParticipant.canManageParticipants permission.
       * If the user that calls this method has both canManageParticipants and isOwner permissions,
       * it can edit other owners.
       */
      canManageParticipants?: boolean;

      /**
       * Specify if the participant can remove messages other than its own.
       * It could be changed only if the user that calls this method
       * has the ConversationParticipant.canManageParticipants permission.
       * If the user that calls this method has both canManageParticipants and isOwner permissions,
       * it can edit other owners.
       */
      canRemoveAllMessages?: boolean;

      /**
       * Specify if the participant can remove its own messages in the conversation.
       * The permission is given by default. It could be changed only if the user
       * that calls this method has the ConversationParticipant.canManageParticipants permission.
       * If the user that calls this method has both canManageParticipants and
       * isOwner permissions, it can edit other owners.
       */
      canRemoveMessages?: boolean;

      /**
       * IM User id.
       */
      imUserId: number;

      /**
       * Sequence of the event that was last marked as read or 0,
       * if the participant didn't mark events as read.
       * Participants mark events as read via Conversation.markAsRead.
       */
      lastReadEventSequence?: number;

      /**
       * Specify if the conversation participant is the owner.
       * It could be set only if the user that calls this method
       * has the ConversationParticipant.canManageParticipants and
       * ConversationParticipant.owner permissions.
       * There could be more than one owner in the conversation.
       * If true, the participant can edit the conversation.
       * If true and canManageParticipants is true, the participant can manage other owners.
       */
      owner?: boolean;
    }

    export class Message {
      /**
       * The UUID of the conversation this message belongs to. The message can belong to the one conversation only.
       */
      public conversation: string;

      /**
       * The array of payload objects associated with the message.
       */
      public payload: { [key: string]: any }[];

      /**
       * The message sequence number in the conversation.
       */
      public sequence: number;

      /**
       * The text of this message.
       */
      public text: string;

      /**
       * The universally unique identifier (UUID) of the message.
       */
      public uuid: string;

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
       */
      public remove(): Promise<MessengerMessageEvent | MessengerErrorEvent>;

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
       */
      public update(
        text: string,
        payload: { [key: string]: any }[],
      ): Promise<MessengerMessageEvent | MessengerErrorEvent>;
    }

    export interface MessengerHandlerEvents {
      [MessengerEventTypes.CreateConversation]: MessengerConversationEvent;
      [MessengerEventTypes.GetConversation]: MessengerConversationEvent;
      [MessengerEventTypes.EditConversation]: MessengerConversationEvent;
      [MessengerEventTypes.RemoveConversation]: MessengerConversationEvent;

      [MessengerEventTypes.EditMessage]: MessengerMessageEvent;
      [MessengerEventTypes.RemoveMessage]: MessengerMessageEvent;
      [MessengerEventTypes.SendMessage]: MessengerMessageEvent;

      [MessengerEventTypes.GetUser]: MessengerUserEvent;
      [MessengerEventTypes.EditUser]: MessengerUserEvent;

      [MessengerEventTypes.GetSubscriptions]: MessengerSubscriptionEvent;
      [MessengerEventTypes.Subscribe]: MessengerSubscriptionEvent;
      [MessengerEventTypes.Unsubscribe]: MessengerSubscriptionEvent;

      [MessengerEventTypes.Error]: MessengerErrorEvent;
      [MessengerEventTypes.GetPublicConversations]: MessengerGetPublicConversationsEvent;
      [MessengerEventTypes.RetransmitEvents]: MessengerRetransmitEventsEvent;
      [MessengerEventTypes.SetStatus]: MessengerSetStatusEvent;
      [MessengerEventTypes.Typing]: MessengerTypingEvent;
      [MessengerEventTypes.Read]: MessengerReadEvent;
    }

    export interface User {
      /**
       * Array of UUIDs for the conversations the user currently belongs to.
       *  Only available if user queries information about himself.
       */
      conversationList: string[];

      /**
       * JavaScript object with public custom data, available to all users
       */
      customData: object;

      /**
       * User's display name which is specified during user creation.
       * The display name is available to all users.
       */
      displayName: string;

      /**
       * IM unique id that is used to identify users in events and specify in user-related methods
       */
      imId: number;

      /**
       * Check if the user is deleted or not
       */
      isDeleted: boolean;

      /**
       * Array of UUIDs for uber conversations that user was joined, but currently is not participating in.
       */
      leaveConversationList: string[];

      /**
       * Voximplant user identifier, for example 'username@appname.accname'
       */
      name: string;

      /**
       * Array of messenger notifications that current user is subscribed to.
       */
      notifications: object[];

      /**
       * JavaScript object with private custom data, available only to the user himself
       */
      privateCustomData: object;
    }

    /**
     * Types of messenger events.
     */
    export enum MessengerEventTypes {
      /**
       * Event is triggered when a conversation is created via {@link Voximplant.Messaging.Messenger#createConversation}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for participants that belong to the conversation.
       *
       * Handler function receives {@link Voximplant.EventHandlers.ConversationEvent} object as an argument.
       */
      CreateConversation = 'CreateConversation',
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
      EditConversation = 'EditConversation',
      /**
       * Event is triggered when a message was edited via {@link Voximplant.Messaging.Message#update} or analogous methods
       * from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for participants that belong to the conversation with the changed message.
       *
       * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
       */
      EditMessage = 'EditMessage',
      /**
       * Event is triggered as the result of {@link Voximplant.Messaging.Messenger#editUser} or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for the subscribers of the changed user. Use {@link Voximplant.Messaging.Messenger#subscribe} to subscribe for user's changes.
       *
       * Handler function receives {@link Voximplant.EventHandlers.UserEvent} object as an argument.
       */
      EditUser = 'EditUser',
      /**
       * Type of the event the promises of the Voximplant React Native Messaging methods are rejected with.
       *
       * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
       * handler function.
       */
      Error = 'Error',
      /**
       * Type of the event the promises of the following methods are resolved with:
       * - {@link Voximplant.Messaging.Messenger#getConversation}
       * - {@link Voximplant.Messaging.Messenger#getConversations}
       *
       * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
       * handler function.
       */
      GetConversation = 'GetConversation',
      /**
       * Type of the event the promise of {@link Voximplant.Messaging.Messenger#getPublicConversations} is resolved with.
       *
       * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
       * handler function.
       */
      GetPublicConversations = 'GetPublicConversations',
      /**
       * Type of the event the promise of {@link Voximplant.Messaging.Messenger#getSubscriptions} is resolved with.
       *
       * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
       * handler function.
       */
      GetSubscriptions = 'GetSubscriptions',
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
      GetUser = 'GetUser',
      /**
       * Event is triggered for all clients in the conversation as the result of {@link Voximplant.Messaging.Conversation#markAsRead}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Handler function receives {@link Voximplant.EventHandlers.ConversationServiceEvent} object as an argument.
       */
      Read = 'Read',
      /**
       * Event is triggered when a conversation was removed.
       *
       * Note that removing is possible via Voximplant Messaging API only.
       *
       * Triggered only for participants that belong to the conversation.
       *
       * Handler function receives {@link Voximplant.EventHandlers.ConversationEvent} object as an argument.
       */
      RemoveConversation = 'RemoveConversation',
      /**
       * Event is triggered when a message was removed from a conversation via {@link Voximplant.Messaging.Message#remove}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for participants that belong to the conversation with the deleted message.
       *
       * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
       */
      RemoveMessage = 'RemoveMessage',
      /**
       * Type of the event the promises of the following methods are resolved with:
       * - {@link Voximplant.Messaging.Conversation#retransmitEvents}
       * - {@link Voximplant.Messaging.Conversation#retransmitEventsFrom}
       * - {@link Voximplant.Messaging.Conversation#retransmitEventsTo}
       *
       * Subscription to this event via {@link Voximplant.Messaging.Messenger#on} will never cause the execution of the specified
       * handler function.
       */
      RetransmitEvents = 'RetransmitEvents',
      /**
       * Event is triggered when a new message was sent to a conversation via {@link Voximplant.Messaging.Conversation#sendMessage}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for participants that belong to the conversation.
       *
       * Handler function receives {@link Voximplant.EventHandlers.MessageEvent} object as an argument.
       */
      SendMessage = 'SendMessage',
      /**
       * Event is triggered after a user status was changed via {@link Voximplant.Messaging.Messenger#setStatus}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for the subscribers of the changed user. Use @link Voximplant.Messaging.Messenger#subscribe} to subscribe for a user's changes.
       *
       * Handler function receives {@link Voximplant.EventHandlers.UserEvent} object as an argument.
       */
      SetStatus = 'SetStatus',
      /**
       * Event is triggered as the result of {@link Voximplant.Messaging.Messenger#subscribe} or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered on all logged in clients of the current user.
       *
       * Handler function receives {@link Voximplant.EventHandlers.SubscriptionEvent} object as an argument.
       */
      Subscribe = 'Subscribe',
      /**
       * Event is triggered when some user is typing text in a conversation. Information about typing is received via
       * {@link Voximplant.Messaging.Conversation#typing} or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered only for participants that belong to the conversation where typing is performing.
       *
       * Handler function receives {@link Voximplant.EventHandlers.ConversationServiceEvent} object as an argument.
       */
      Typing = 'Typing',
      /**
       * Invoked as the result of {@link Voximplant.Messaging.Messenger#unsubscribe}, {@link Voximplant.Messaging.Messenger#unsubscribeFromAll}
       * or analogous methods from other Voximplant SDKs and Messaging API.
       *
       * Triggered on all logged in clients of the current user.
       *
       * Handler function receives {@link Voximplant.EventHandlers.SubscriptionEvent} object as an argument.
       */
      Unsubscribe = 'Unsubscribe',
    }

    /**
     * Enum that represents actions that trigger messenger events.
     * Each action is the reason for every triggered event.
     */
    export enum MessengerAction {
      addParticipants = 'addParticipants',
      createConversation = 'createConversation',
      editConversation = 'editConversation',
      editMessage = 'editMessage',
      editParticipants = 'editParticipants',
      editUser = 'editUser',
      getConversation = 'getConversation',
      getConversations = 'getConversations',
      getPublicConversations = 'getPublicConversations',
      getSubscriptions = 'getSubscriptions',
      getUser = 'getUser',
      getUsers = 'getUsers',
      joinConversation = 'joinConversation',
      leaveConversation = 'leaveConversation',
      manageNotifications = 'manageNotifications',
      read = 'read',
      removeConversation = 'removeConversation',
      removeMessage = 'removeMessage',
      removeParticipants = 'removeParticipants',
      retransmitEvents = 'retransmitEvents',
      sendMessage = 'sendMessage',
      setStatus = 'setStatus',
      subscribe = 'subscribe',
      typing = 'typing',
      unsubscribe = 'unsubscribe',
    }

    /**
     * Enum that represents events available for push notification subscriptions.
     */
    export enum MessengerNotification {
      EditMessage = 'EditMessage',
      SendMessage = 'SendMessage',
    }

    export interface MessengerReadEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * The conversation UUID associated with this event.
       */
      conversationUUID: string;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.Read;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      /**
       * Sequence number of this event.
       */
      sequence: number;
    }

    export interface MessengerTypingEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * The conversation UUID associated with this event.
       */
      conversationUUID: string;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.Typing;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
    }

    export interface MessengerSetStatusEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.SetStatus;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      online: boolean;
    }

    export interface MessengerRetransmitEventsEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.RetransmitEvents;
      events: object[];
      from: number;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      to: number;
    }

    export interface MessengerGetPublicConversationsEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      conversationList: string[];
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.GetPublicConversations;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
    }

    export interface MessengerErrorEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      code: number;
      description: string;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.Error;
    }

    export interface MessengerMessageEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Messenger event type.
       */
      eventType:
        | MessengerEventTypes.EditMessage
        | MessengerEventTypes.SendMessage
        | MessengerEventTypes.RemoveMessage;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      /**
       * Message object.
       */
      message: Message;
      /**
       * Sequence number of this event.
       */
      sequence: number;
      /**
       * UNIX timestamp (seconds) that specifies the time the conversation event was provoked.
       */
      timestamp: number;
    }

    export interface MessengerConversationEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Object with conversation information.
       */
      conversation: Conversation;
      /**
       * Messenger event type.
       */
      eventType:
        | MessengerEventTypes.CreateConversation
        | MessengerEventTypes.EditConversation
        | MessengerEventTypes.RemoveConversation
        | MessengerEventTypes.GetConversation;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      /**
       * Sequence number of this event.
       */
      sequence: number;
      /**
       * UNIX timestamp (seconds) that specifies the time the conversation event was provoked.
       */
      timestamp: number;
    }

    export interface MessengerUserEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Messenger event type.
       */
      eventType: MessengerEventTypes.EditUser | MessengerEventTypes.GetUser;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      /**
       * Object with user info.
       */
      user: User;
    }

    export interface MessengerSubscriptionEvent {
      /**
       * Action that triggered this event.
       */
      action: MessengerAction;
      /**
       * Messenger event type.
       */
      eventType:
        | MessengerEventTypes.GetSubscriptions
        | MessengerEventTypes.Subscribe
        | MessengerEventTypes.Unsubscribe;
      /**
       * The IM id for the user that initiated the event.
       */
      imUserId: number;
      /**
       * Array of the IM user identifiers of the current (un)subscription.
       */
      users: number[];
    }
  }

  namespace Voximplant.Hardware {
    export class AudioFile {
      /**
       * HTTP URL of the stream to play
       */
      public url: string;

      /**
       * Indicate if the audio file should be played repeatedly or once
       */
      public looped: boolean;

      /**
       * Local audio file name
       */
      public name: string;

      /**
       * Initialize AudioFile instance to play local audio file.
       *
       * On android, the audio file must be located in resources "raw" folder.
       *
       * @param {string} name - Local audio file name
       * @param {string} type - Local audio file type/format, for example ".mp3"
       * @param {Voximplant.Hardware.AudioFileUsage} usage - Audio file usage mode. ANDROID ONLY.
       * @return {Promise}
       */
      public initWithLocalFile(
        name: string,
        type: string,
        usage: AudioFileUsage,
      ): Promise<void>;

      /**
       * Initialize AudioFile to play a stream from a network.
       *
       * @param {string} url - HTTP URL of the stream to play
       * @param {Voximplant.Hardware.AudioFileUsage} usage usage - Audio file usage mode. ANDROID ONLY.
       * @return {Promise}
       */
      public loadFile(url: string, usage: AudioFileUsage): Promise<void>;

      /**
       * Start playing the audio file repeatedly or once.
       * @param {boolean} looped - Indicate if the audio file should be played repeatedly or once
       * @return {Promise<EventHandlers.AudioFileStarted>}
       */
      public play(looped: boolean): Promise<AudioFileEvent>;

      /**
       * Release all resources allocated to play the audio file.
       *
       * Must be called even if the audio file was not played.
       */
      public releaseResources(): void;

      /**
       * Stop playing of the audio file.
       *
       * @return {Promise<EventHandlers.AudioFileStopped>}
       */
      public stop(): Promise<AudioFileEvent>;

      /**
       * Register a handler for the specified AudioFile event.
       * One event can have more than one handler.
       * Use the {@link Voximplant.Hardware.AudioFile#off} method to delete a handler.
       * @param {Voximplant.Hardware.AudioFileEventTypes} event
       * @param {function} handler
       */
      public on(
        eventType: AudioFileEventTypes,
        handler: (event: AudioFileEvent) => void,
      ): void;

      /**
       * Remove a handler for the specified AudioFile event.
       * @param {Voximplant.Hardware.AudioFileEventTypes} event
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off(
        eventType: AudioFileEventTypes,
        handler?: (event: AudioFileEvent) => void,
      ): void;
    }

    export enum AudioFileUsage {
      IN_CALL = 'incall',
      NOTIFICATION = 'notification',
      RINGTONE = 'ringtone',
      UNKNOWN = 'unknown',
    }

    export interface AudioFileEvent {
      /**
       * Audio file that triggered the event
       */
      audioFile: AudioFile;
      /**
       * Error code on iOS if the audio file failed to start
       */
      error: string;
      /**
       * Name of the event
       */
      name: AudioFileEventTypes.Started | AudioFileEventTypes.Stopped;
      /**
       * True if the audio file has started or stopped successfully
       */
      result: boolean;
    }

    /**
     * Audio file events listener to be notified about audio file events
     */
    export enum AudioFileEventTypes {
      /**
       * Invoked when the audio file playing is started.
       * Handler function receives {@link EventHandlers.AudioFileStarted} object as an argument.
       */
      Started = 'Started',
      /**
       * Invoked when the audio file playing is stopped.
       * Handler function receives {@link EventHandlers.AudioFileStopped} object as an argument.
       */
      Stopped = 'Stopped',
    }

    export class AudioDeviceManager {
      /**
       * Get AudioDeviceManager instance to control audio hardware settings
       * @returns {Voximplant.Hardware.AudioDeviceManager}
       */
      public static getInstance(): AudioDeviceManager;

      /**
       * IOS ONLY.
       * Required for the correct CallKit integration only. Otherwise don't use this method.
       *
       * Initialize AVAudioSession if the application uses CallKit.
       *
       * Should be called when:
       * 1. the provider performs [the specified start call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648260-provider?language=objc)
       * 2. the provider performs [the specified answer call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648270-provider?language=objc)
       */
      public callKitConfigureAudioSession(): void;

      /**
       * IOS ONLY.
       * Required for the correct CallKit integration only. Otherwise don't use this method.
       *
       * Restores default AVAudioSession initialization routines, MUST be called if CallKit becomes disabled.
       */
      public callKitReleaseAudioSession(): void;

      /**
       * IOS ONLY.
       * Required for the correct CallKit integration only. Otherwise don't use this method.
       *
       * Starts AVAudioSession.
       *
       * Should be called when:
       * 1. the provider’s audio session is [activated](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1833281-provider?language=objc)
       * 2. the provider performs [the specified set held call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc)
       */
      public callKitStartAudio(): void;

      /**
       * IOS ONLY.
       * Required for the correct CallKit integration only. Otherwise don't use this method.
       *
       * Stops AVAudioSession.
       *
       * Should be called when:
       * 1. the provider performs [the specified end call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648264-provider?language=objc)
       * 2. the provider performs [the specified set held call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc)
       */
      public callKitStopAudio(): void;

      /**
       * Returns active audio device during the call or audio device that will be used for a call if there is no calls at this moment.
       * @returns {Promise<Voximplant.Hardware.AudioDevice>}
       */
      public getActiveDevice(): Promise<AudioDevice>;

      /**
       * Returns the list of available audio devices.
       * @returns {Promise<Voximplant.Hardware.AudioDevice[]>}
       */
      public getAudioDevices(): Promise<AudioDevice[]>;

      /**
       * Register a handler for the specified AudioDeviceManager event.
       * One event can have more than one handler.
       * Use the {@link Voximplant.Hardware.AudioDeviceManager#off} method to delete a handler.
       * @param {Voximplant.Hardware.AudioDeviceEvents} event
       * @param {function} handler
       */
      public on<K extends AudioDeviceEvents>(
        eventType: K,
        handler: (event: AudioDeviceHandlerEvents[K]) => void,
      ): void;

      /**
       * Remove a handler for the specified AudioDeviceManager event.
       * @param {Voximplant.Hardware.AudioDeviceEvents} event
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off<K extends AudioDeviceEvents>(
        eventType: K,
        handler?: (event: AudioDeviceHandlerEvents[K]) => void,
      ): void;

      /**
       * Changes selection of the current active audio device. Please see {@link https://voximplant.com/docs/references/androidsdk/iaudiodevicemanager Android}
       * and {@link https://voximplant.com/docs/references/iossdk/viaudiomanager#selectaudiodevice iOS} documentation for platform specific.
       * @param {Voximplant.Hardware.AudioDevice} audioDevice - Preferred audio device to use.
       */
      public selectAudioDevice(audioDevice: AudioDevice): void;
    }

    export interface AudioDeviceHandlerEvents {
      [AudioDeviceEvents.DeviceChanged]: AudioDeviceDeviceChangedEvent;
      [AudioDeviceEvents.DeviceListChanged]: AudioDeviceDeviceListChangedEvent;
    }

    export interface AudioDeviceDeviceChangedEvent {
      /**
       * Audio device to be used
       */
      currentDevice: AudioDevice;
      /**
       * Name of the event
       */
      name: AudioDeviceEvents.DeviceChanged;
    }

    export interface AudioDeviceDeviceListChangedEvent {
      /**
       * Name of the event
       */
      name: string;
      /**
       * List of currently available audio devices.
       */
      newDeviceList: AudioDevice[];
    }

    /**
     * Events that may be used to monitor and handle audio device change events
     */
    export enum AudioDeviceEvents {
      /**
       * Event is triggered when active audio device or audio device that will be used for a further call is changed.
       * Handler function receives {@link EventHandlers.DeviceChanged} object as an argument.
       */
      DeviceChanged = 'DeviceChanged',
      /**
       * Event is triggered when a new audio device is connected or previously connected audio device is disconnected.
       * Handler function receives {@link EventHandlers.DeviceListChanged} object as an argument.
       */
      DeviceListChanged = 'DeviceListChanged',
    }

    export class CameraManager {
      /**
       * Get CameraManager instance to control camera hardware settings
       * @returns {Voximplant.Hardware.CameraManager}
       */
      public static getInstance(): CameraManager;

      /**
       * Android only.
       * Register a handler for the specified call event.
       * One event can have more than one handler.
       * Use the {@link Voximplant.Call#off} method to delete a handler.
       * @param {Voximplant.CallEvents} event
       * @param {function} handler - Handler function. A single parameter is passed - object with event information
       */
      public on<K extends CameraEvents>(
        eventType: K,
        handler: (event: CameraHandlerEvents[K]) => void,
      ): void;

      /**
       * Android only.
       * Remove a handler for the specified call event.
       * @param {Voximplant.CallEvents} event
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off<K extends CameraEvents>(
        eventType: K,
        handler?: (event: CameraHandlerEvents[K]) => void,
      ): void;

      /**
       * Select camera
       * @param {Voximplant.Hardware.CameraType} cameraType - Preferred video camera
       */
      public switchCamera(cameraType: Voximplant.CameraType): void;

      /**
       * Set a local camera resolution
       * @param {number} width - Camera resolution width
       * @param {number} height - Camera resolution height
       */
      public setCameraResolution(width: number, height: number): void;
    }

    export enum AudioDevice {
      /** Bluetooth headset */
      BLUETOOTH = 'Bluetooth',
      /** Earpiece */
      EARPIECE = 'Earpiece',
      /** No audio device, generally indicates that something is wrong with audio device selection.
       * Should not be selected via {@link Voximplant.Hardware.AudioDeviceManager#selectAudioDevice}
       */
      NONE = 'None',
      /** Speaker */
      SPEAKER = 'Speaker',
      /** Wired headset */
      WIRED_HEADSET = 'WiredHeadset',
    }

    export interface CameraErrorEvent {
      /**
       * Description of error occurred.
       */
      error: string;
      /**
       * Name of the event
       */
      name: CameraEvents.CameraError | CameraEvents.CameraSwitchError;
    }

    export interface CameraDisconnectedEvent {
      /**
       * Name of the event
       */
      name: CameraEvents.CameraDisconnected | CameraEvents.CameraSwitchError;
    }

    export interface CameraSwitchDoneEvent {
      /**
       * Name of the event
       */
      name: CameraEvents.CameraSwitchDone;
      /**
       * True if new camera is front facing camera
       */
      isFrontCamera: boolean;
    }

    export interface CameraHandlerEvents {
      [CameraEvents.CameraError]: CameraErrorEvent;
      [CameraEvents.CameraSwitchError]: CameraErrorEvent;
      [CameraEvents.CameraDisconnected]: CameraDisconnectedEvent;
      [CameraEvents.CameraSwitchDone]: CameraSwitchDoneEvent;
    }

    /**
     * Android only.
     * Camera events listener to be notified about camera events
     */
    export enum CameraEvents {
      /**
       * Invoked when camera is disconnected. ANDROID ONLY.
       * Handler function receives {@link EventHandlers.CameraDisconnected} object as an argument.
       */
      CameraDisconnected = 'CameraDisconnected',
      /**
       * Invoked when camera can not be opened or any camera exception happens. ANDROID ONLY.
       * Handler function receives {@link EventHandlers.CameraError} object as an argument.
       */
      CameraError = 'CameraError',
      /**
       * Invoked when camera switch was successful. ANDROID ONLY.
       * Handler function receives {@link EventHandlers.CameraSwitchDone} object as an argument.
       */
      CameraSwitchDone = 'CameraSwitchDone',
      /**
       * Invoked when camera switch is failed, e.g. camera is stopped or only one camera is available. ANDROID ONLY.
       * Handler function receives {@link EventHandlers.CameraSwitchError} object as an argument.
       */
      CameraSwitchError = 'CameraSwitchError',
    }
  }

  namespace Voximplant {
    /**
     * Get Voximplant.Client instance to use platform functions
     * @param {ClientConfig} clientConfig Configuration for new Client instance.
     * @returns {Voximplant.Client}
     */
    export function getInstance(clientConfig?: ClientConfig): Client;

    /**
     * Get instance of messaging subsystem
     * @returns {Voximplant.Messaging.Messenger}
     * @memberOf Voximplant
     * @kind function
     */
    export function getMessenger(): Messaging.Messenger;

    export enum CameraType {
      /**
       * The facing of the camera is the same as that of the screen
       */
      FRONT = 'front',
      /**
       * The facing of the camera is opposite to that of the screen
       */
      BACK = 'back',
    }

    export interface VideoViewProps extends ViewProps {
      /**
       * Type of video render scale
       */
      scaleType: RenderScaleType;

      /**
       * Id of the video stream that will be rendered to the video view
       */
      videoStreamId?: string | null;

      /**
       * Android only.
       * Specify if the video view should be shown on top of other video views.
       */
      showOnTop?: boolean;
    }

    /**
     * A React component to render video streams.
     */
    export class VideoView extends React.Component<VideoViewProps> {}

    /**
     * The Client class is used to control platform functions.
     * Can't be instantiated directly (singleton), so use the Voximplant.getInstance method to get the class instance.
     */
    export class Client {
      public static getInstance(clientConfig?: ClientConfig): Client;

      /**
       * Create outgoing call.
       *
       * Important: There is a difference between resolving the Voximplant.Client.call promise and handling Voximplant.CallEvents.
       * If the promise is resolved, the SDK sends a call to the cloud. However, it doesn't mean that a call is connected;
       * to catch this call state, subscribe to the Voximplant.CallEvents.Connected event.
       * If the promise is rejected, that indicates the issues in the application's code (e.g., a try to make a call without login to the Voximplant cloud);
       * in case of the CallFailed event is triggered, that means a telecom-related issue (e.g., another participant rejects a call).
       *
       * @param {string} number - The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
       * @param {Voximplant.CallSettings} [callSettings] - Optional call settings
       * @returns {Promise<Voximplant.Call>}
       */
      public call(number: string, callSettings?: CallSettings): Promise<Call>;

      /**
       * Create call to a dedicated conference without proxy session. For details see [the video conferencing guide](https://voximplant.com/blog/video-conference-through-voximplant-media-servers).
       *
       * Important: There is a difference between resolving the Voximplant.Client.callConference promise and handling Voximplant.CallEvents.
       * If the promise is resolved, the SDK sends a call to the cloud. However, it doesn't mean that a call is connected;
       * to catch this call state, subscribe to the Voximplant.CallEvents.Connected event.
       * If the promise is rejected, that indicates the issues in the application's code (e.g., a try to make a call without login to the Voximplant cloud);
       * in case of the CallFailed event is triggered, that means a telecom-related issue (e.g., another participant rejects a call).
       *
       * @param {string} number - The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
       * @param {Voximplant.CallSettings} [callSettings] - Optional call settings
       * @returns {Promise<Voximplant.Call>}
       */
      public callConference(
        number: string,
        callSettings?: CallSettings,
      ): Promise<Call>;

      /**
       * Connect to the Voximplant Cloud
       * @param {Voximplant.ConnectOptions} [options] - Connection options
       * @returns {Promise<EventHandlers.ConnectionEstablished|EventHandlers.ConnectionFailed>}
       */
      public connect(
        options?: ConnectOptions,
      ): Promise<ClientConnectionEvent | ClientConnectionFailedEvent>;

      /**
       * Disconnect from the Voximplant Cloud
       * @returns {Promise<EventHandlers.ConnectionClosed>}
       */
      public disconnect(): Promise<ClientConnectionEvent>;

      /**
       * Get current client state
       * @returns {Promise<Voximplant.ClientState>}
       */
      public getClientState(): Promise<ClientState>;

      /**
       * Handle incoming push notification
       * @param {object} notification - Incoming push notification
       */
      public handlePushNotification(notification: object): void;

      /**
       * Login to specified Voximplant application with password.
       * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
       * @param {string} password - User password
       * @returns {Promise<EventHandlers.AuthResult>}
       */
      public login(
        username: string,
        password: string,
      ): Promise<ClientAuthResultEvent>;

      /**
       * Login to specified Voximplant application using 'onetimekey' auth method. Hash should be calculated with the key received in AuthResult event.
       * Please, read {@link http://voximplant.com/docs/quickstart/24/automated-login/ howto page}
       * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
       * @param {string} hash - Hash that was generated using following formula: MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)).
       * Please note that here user is just a user name, without app name, account name or anything else after "@".
       * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
       * @returns {Promise<EventHandlers.AuthResult>}
       */
      public loginWithOneTimeKey(
        username: string,
        hash: string,
      ): Promise<ClientAuthResultEvent>;

      /**
       * Login to specified Voximplant application using accessToken
       * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
       * @param {string} token - Access token that was obtained in AuthResult event
       * @returns {Promise<EventHandlers.AuthResult>}
       */
      public loginWithToken(
        username: string,
        token: string,
      ): Promise<ClientAuthResultEvent>;

      /**
       * Remove handler for specified event
       * @param {Voximplant.ClientEvents} event
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off<K extends ClientEvents>(
        eventType: K,
        handler?: (event: ClientHandlerEvents[K]) => void,
      ): void;

      /**
       * Register handler for specified client event.
       * Use {@link Voximplant.Client#off} method to delete a handler.
       * @param {Voximplant.ClientEvents} event
       * @param {function} handler - Handler function
       */
      public on<K extends ClientEvents>(
        eventType: K,
        handler: (event: ClientHandlerEvents[K]) => void,
      ): void;

      /**
       * IOS only.
       * Register Apple Push Notifications token for IM push notifications.
       *
       * See [React Native PushNotificationIOS](https://facebook.github.io/react-native/docs/pushnotificationios#addeventlistener)
       * for more details.
       *
       * IM push notification token for Android is the same as VoIP push notification token and should be registered once via
       * {@link Voximplant.Client#registerPushNotificationsToken}
       *
       * @param {string} token - The APNS token for IM push notifications.
       */
      public registerIMPushNotificationsTokenIOS(token: string): void;

      /**
       * Register for VoIP push notifications. Only PushKit VoIP tokens are acceptable.
       *
       * Application will receive push notifications from the Voximplant Server after the first login.
       * @param {string} token - Push registration token
       */
      public registerPushNotificationsToken(token: string): void;

      /**
       * Request a key for 'onetimekey' auth method. Server will send the key in AuthResult event with code 302
       * @param {string} username Fully - qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
       * @returns {Promise<EventHandlers.AuthResult>}
       */
      public requestOneTimeLoginKey(
        username: string,
      ): Promise<ClientAuthResultEvent>;

      /**
       * Set outer logging callback. The method allows integrating logging pipeline of the Voximplant React Native SDK into
       * your own logger i.e. the method call sends all events to your function.
       * @param {function} callback - Callback function with two arguments: {@link Voximplant.LogLevel} and message
       */
      public setLoggerCallback(callback: () => void): void;

      /**
       * Refresh expired access token
       * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
       * @param {string} refreshToken - Refresh token that was obtained in AuthResult event
       * @returns {Promise<EventHandlers.RefreshTokenResult>}
       */
      public tokenRefresh(
        username: string,
        refreshToken: string,
      ): Promise<ClientRefreshTokenResultEvent>;

      /**
       * IOS only.
       * Unregister from IM push notifications. Application will no longer receive IM push notifications from the Voximplant server
       *
       * @param {string} token - The APNS token for IM push notifications.
       * @memberOf Voximplant.Client
       */
      public unregisterIMPushNotificationsTokenIOS(token: string): void;

      /**
       * Unregister from push notifications. Application will no longer receive push notifications from the Voximplant server
       * @param {string} token - Push registration token for VoIP calls
       */
      public unregisterPushNotificationsToken(token: string): void;
    }

    export enum ClientState {
      /** The client is currently disconnected */
      DISCONNECTED = 'disconnected',
      /** The client is currently connecting */
      CONNECTING = 'connecting',
      /** The client is currently connected */
      CONNECTED = 'connected',
      /** The client is currently logging in */
      LOGGING_IN = 'logging_in',
      /** The client is currently logged in */
      LOGGED_IN = 'logged_in',
      /** The client is currently reconnecting */
      RECONNECTING = 'reconnecting',
    }

    export interface ClientHandlerEvents {
      [ClientEvents.AuthResult]: ClientAuthResultEvent;
      [ClientEvents.ConnectionClosed]: ClientConnectionEvent;
      [ClientEvents.ConnectionEstablished]: ClientConnectionEvent;
      [ClientEvents.Reconnected]: ClientConnectionEvent;
      [ClientEvents.Reconnecting]: ClientConnectionEvent;
      [ClientEvents.ConnectionFailed]: ClientConnectionFailedEvent;
      [ClientEvents.IncomingCall]: ClientIncomingCallEvent;
      [ClientEvents.RefreshTokenResult]: ClientRefreshTokenResultEvent;
    }

    export interface ClientAuthResultEvent {
      /**
       * Auth result error code
       */
      code: number;
      /**
       * Authorized user's display name
       */
      displayName: string;
      /**
       * This parameter is used to calculate hash parameter for [Client.loginWithOneTimeKey] method.
       * AuthResult with the key dispatched after Client.requestOneTimeLoginKey method was called.
       */
      key: string;
      /**
       * Name of the event
       */
      name: ClientEvents.AuthResult;
      /**
       * True in case of success, false - otherwise
       */
      result: boolean;
      /**
       * New tokens structure
       */
      tokens: LoginTokens;
    }

    export interface ClientConnectionEvent {
      /**
       * Name of the event
       */
      name:
        | ClientEvents.ConnectionClosed
        | ClientEvents.ConnectionEstablished
        | ClientEvents.Reconnected
        | ClientEvents.Reconnecting;
    }

    export interface ClientConnectionFailedEvent {
      /**
       * Name of the event
       */
      name: ClientEvents.ConnectionFailed;
      /**
       * Failure reason description
       */
      message: string;
    }

    export interface ClientIncomingCallEvent {
      /**
       * Name of the event
       */
      name: ClientEvents.IncomingCall;
      /**
       * Incoming call instance. See Call methods for details
       */
      call: Call;
      /**
       * Optional SIP headers received with the event
       */
      headers: object;
      /**
       * True if the caller initiated video call
       */
      video: boolean;
    }

    export interface ClientRefreshTokenResultEvent {
      /**
       * Name of the event
       */
      name: ClientEvents.RefreshTokenResult;
      /**
       * Auth result error code
       */
      code: number;
      /**
       * True in case of success, false - otherwise
       */
      result: boolean;
      /**
       * New tokens structure
       */
      tokens: LoginTokens;
    }

    export interface LoginTokens {
      /**
       * Seconds to access token expire
       */
      accessExpire: number;
      /**
       * Access token that can be used to login before accessExpire
       */
      accessToken: string;
      /**
       * Seconds to refresh token expire
       */
      refreshExpire: number;
      /**
       * Refresh token that can be used one time before refresh token expired
       */
      refreshToken: string;
    }

    export enum ClientEvents {
      /**
       * The event is triggered after connection to the Voximplant Cloud was established successfully. See {@link Client#connect} method.
       * Handler function receives {@link EventHandlers.ConnectionEstablished} object as an argument.
       */
      ConnectionEstablished = 'ConnectionEstablished',
      /**
       * The event is triggered if a connection to the Voximplant Cloud couldn't be established. See {@link Client#connect} method.
       * Handler function receives {@link EventHandlers.ConnectionFailed} object as an argument.
       */
      ConnectionFailed = 'ConnectionFailed',
      /**
       * The event is triggered if a connection to the Voximplant Cloud was closed because of network problems. See {@link Client#connect} method.
       * Handler function receives {@link EventHandlers.ConnectionClosed} object as an argument.
       */
      ConnectionClosed = 'ConnectionClosed',
      /**
       * Event is triggered after {@link Client#login}, {@link Client#loginWithOneTimeKey}, {@link Client#requestOneTimeLoginKey}
       * or {@link Client#loginWithToken} methods.
       * Handler function receives {@link EventHandlers.AuthResult} object as an argument.
       */
      AuthResult = 'AuthResult',
      /**
       * The event is triggered after the {@link Client#tokenRefresh} method call.
       * Handler function receives {@link EventHandlers.AuthTokenResult} object as an argument.
       */
      RefreshTokenResult = 'RefreshTokenResult',
      /**
       * The event is triggered when there is a new incoming call to current user.
       * Handler function receives {@link EventHandlers.IncomingCall} object as an argument.
       */
      IncomingCall = 'IncomingCall',
      /**
       * The event is triggered when the connection to the Voximplant Cloud is lost during a call and the client tries to restore it
       * Handler function receives {@link EventHandlers.Reconnecting} object as an argument.
       */
      Reconnecting = 'Reconnecting',
      /**
       * The event is triggered when the the connection to the Voximplant Cloud is restored.
       * After the client is reconnected, state is changed from {@link ClientState#RECONNECTING} to {@link ClientState#LOGGED_IN}.
       * Handler function receives {@link EventHandlers.Reconnected} object as an argument.
       */
      Reconnected = 'Reconnected',
    }

    export interface ConnectOptions {
      connectivityCheck?: boolean;
      servers?: string[];
    }

    /**
     * Class that may be used for call operations like answer, reject,
     * hang up abd mid-call operations like hold, start/stop video and others.
     */
    export class Call {
      /**
       * The call id
       */
      public callId: string;

      /**
       * Local video streams
       */
      public localVideoStreams: VideoStream[];

      /**
       * IOS only.
       * The CallKit UUID that may be used to match an incoming call with a push notification received before
       * Always nil for outgoing calls on Call instance creation.
       * For outgoing calls it is recommended to set CXStartCallAction.callUUID value to this property on
       * handling CXStartCallAction
       */
      public callKitUUID?: string | null;

      /**
       * Answer the incoming call.
       * @param {Voximplant.CallSettings} [callSettings] - Optional set of call settings.
       */
      public answer(callSettings?: CallSettings): void;

      /**
       * Reject incoming call on the part of Web SDK.
       * If a call is initiated from the PSTN, the network will receive "reject" command.
       * In case of a call from another Web SDK client, it will receive the CallEvents.Failed event with the 603 code.
       * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
       */
      public decline(headers?: object): void;

      /**
       * Get the call duration in seconds
       * @returns {Promise<number|CallError>}
       */
      public getDuration(): Promise<number | CallError>;

      /**
       * Get all current Endpoints in the call.
       * @returns {Voximplant.Endpoint[]}
       */
      public getEndpoints(): Endpoint[];

      /**
       * Hangup the call
       * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after disconnecting/cancelling call. Parameter names must start with "X-" to be processed by application
       */
      public hangup(headers?: object): void;

      /**
       * Hold or unhold the call
       * @param {boolean} enable - True if the call should be put on hold, false for unhold
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public hold(enable: boolean): Promise<void | CallOperationFailedEvent>;

      /**
       * Remove a handler for the specified call event.
       * @param {Voximplant.CallEvents} event If not specified, all handlers will be removed.
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off<K extends CallEvents>(
        eventType?: K,
        handler?: (event: CallHandlerEvents[K]) => void,
      ): void;

      /**
       * Register a handler for the specified call event.
       * One event can have more than one handler.
       * Use the {@link Voximplant.Call#off} method to delete a handler.
       * @param {Voximplant.CallEvents} event
       * @param {function} handler - Handler function. A single parameter is passed - object with event information
       */
      public on<K extends CallEvents>(
        eventType: K,
        handler: (event: CallHandlerEvents[K]) => void,
      ): void;

      /**
       * Start receive video if video receive was disabled before. Stop receiving video during the call is not supported.
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public receiveVideo(): Promise<void | CallOperationFailedEvent>;

      /**
       * Reject incoming call on the part of Web SDK.
       * If a call is initiated from the PSTN, the network will receive "reject" command.
       * In case of a call from another Web SDK client, it will receive the CallEvents.Failed event with the 603 code.
       * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
       */
      public reject(headers?: object): void;

      /**
       * Enables or disables audio transfer from microphone into the call.
       * @param {boolean} enable - True if audio should be sent, false otherwise
       */
      public sendAudio(enable: boolean): void;

      /**
       * Send Info (SIP INFO) message inside the call.
       * You can get this message via the Voxengine {@link https://voximplant.com/docs/references/websdk/voximplant/callevents#inforeceived CallEvents.InfoReceived}
       * event in the Voximplant cloud.
       * You can get this message in Web SDK on other side via the {@link CallEvents.InfoReceived} event; see the similar
       * events for the {@link https://voximplant.com/docs/references/websdk Web},
       * {@link https://voximplant.com/docs/references/iossdk iOS} and {@link https://voximplant.com/docs/references/androidsdk Android} SDKs.
       * @param {string} mimeType -  MIME type of the message, for example "text/plain", "multipart/mixed" etc.
       * @param {string} body - Message content
       * @param {object} [extraHeaders] - Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
       */
      public sendInfo(
        mimeType: string,
        body: string,
        extraHeaders?: object,
      ): void;

      /**
       * Send text message. It is a special case of the {@link Voximplant.Call#sendInfo} method as it allows to send messages only of "text/plain" type.
       * You can get this message via the Voxengine {@link https://voximplant.com/docs/references/websdk/voximplant/callevents#messagereceived CallEvents.MessageReceived} event in our cloud.
       * You can get this message in Web SDK on other side via the {@link CallEvents#MessageReceived} event; see the similar
       * events for the {@link https://voximplant.com/docs/references/websdk Web},
       * {@link https://voximplant.com/docs/references/iossdk iOS} and {@link https://voximplant.com/docs/references/androidsdk Android} SDKs.
       * @param {string} message - Message text
       */
      public sendMessage(message: string): void;

      /**
       * Send tone (DTMF). It triggers the {@link https://voximplant.com/docs/references/appengine/CallEvents.html#CallEvents_ToneReceived CallEvents.ToneReceived} event in the Voximplant cloud.
       * @param {string} key - Send tone according to pressed key: 0-9 , * , #
       */
      public sendTone(key: string): void;

      /**
       * Start/stop sending video from a call.
       * In case of a remote participant uses a React Native SDK client, it will receive either
       * the {@link EndpointEvents#RemoteVideoStreamAdded} or {@link EndpointEvents#RemoteVideoStreamRemoved} event accordingly.
       * @param {boolean} enable - True if video should be sent, false otherwise
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public sendVideo(
        enable: boolean,
      ): Promise<void | CallOperationFailedEvent>;
    }

    /**
     * Class that represents any remote media unit in a call.
     * Current endpoints can be retrieved via the Call.getEndpoints method.
     */
    export class Endpoint {
      /**
       *  The endpoint id
       */
      public id: string;

      /**
       * User display name of the endpoint.
       */
      public displayName: string;

      /**
       * SIP URI of the endpoint
       */
      public sipUri: string;

      /**
       * User name of the endpoint.
       */
      public userName: string;

      /**
       * Video streams of the endpoint.
       */
      public videoStreams: VideoStream[];

      /**
       * Remove a handler for the specified endpoint event.
       * @param {Voximplant.EndpointEvents} event If not specified, all handlers will be removed.
       * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
       */
      public off<K extends EndpointEvents>(
        eventType?: K,
        handler?: (event: EndpointHandlerEvents[K]) => void,
      ): void;

      /**
       * Register a handler for the specified endpoint event.
       * One event can have more than one handler.
       * Use the {@link Voximplant.Endpoint#off} method to delete a handler.
       * @param {Voximplant.EndpointEvents} event
       * @param {function} handler
       */
      public on<K extends EndpointEvents>(
        eventType: K,
        handler: (event: EndpointHandlerEvents[K]) => void,
      ): void;

      /**
       * Requests the specified video size for the video stream.
       * The stream resolution may be changed to the closest to the specified width and height.
       * Valid only for conferences.
       * @param {string} streamId - Remote video stream id
       * @param {number} width - Requested width of the video stream
       * @param {number} height - Requested height of the video stream
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public requestVideoSize(
        streamId: string,
        width: number,
        height: number,
      ): Promise<void | CallOperationFailedEvent>;

      /**
       * Starts receiving video on the video stream.
       * @param {string} streamId - Remote video stream id
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public startReceiving(
        streamId: string,
      ): Promise<void | CallOperationFailedEvent>;

      /**
       * Stops receiving video on the video stream.
       * @param {string} streamId - Remote video stream id
       * @returns {Promise<void|EventHandlers.CallOperationFailed>}
       */
      public stopReceiving(
        streamId: string,
      ): Promise<void | CallOperationFailedEvent>;
    }

    export interface CallHandlerEvents {
      [CallEvents.ICECompleted]: CallDefaultEvent;
      [CallEvents.ICETimeout]: CallDefaultEvent;
      [CallEvents.CallReconnected]: CallDefaultEvent;
      [CallEvents.CallReconnecting]: CallDefaultEvent;
      [CallEvents.ProgressToneStop]: CallDefaultEvent;
      [CallEvents.Connected]: CallHeadersEvent;
      [CallEvents.ProgressToneStart]: CallHeadersEvent;
      [CallEvents.CallOperationFailed]: CallOperationFailedEvent;
      [CallEvents.Disconnected]: CallDisconnectedEvent;
      [CallEvents.EndpointAdded]: CallEndpointAddedEvent;
      [CallEvents.Failed]: CallFailedEvent;
      [CallEvents.InfoReceived]: CallInfoReceivedEvent;
      [CallEvents.LocalVideoStreamAdded]: CallLocalVideoStreamEvent;
      [CallEvents.LocalVideoStreamRemoved]: CallLocalVideoStreamEvent;
      [CallEvents.MessageReceived]: CallMessageReceivedEvent;
    }

    export interface CallMessageReceivedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.MessageReceived;
      /**
       * Content of the message
       */
      text: string;
    }

    export interface CallLocalVideoStreamEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name:
        | CallEvents.LocalVideoStreamAdded
        | CallEvents.LocalVideoStreamRemoved;
      /**
       * Local video stream
       */
      videoStream: VideoStream;
    }

    export interface CallInfoReceivedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.InfoReceived;
      /**
       * Optional SIP headers are received with the event
       */
      headers: object;
      /**
       * MIME type of INFO message
       */
      mimeType: string;
      /**
       * Content of the message
       */
      body: string;
    }

    export interface CallFailedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.Failed;
      /**
       * Optional SIP headers are received with the event
       */
      headers: object;
      /**
       * Call status code
       */
      code: number;
      /**
       * Status message of a call failure (i.e. Busy Here)
       */
      reason: string;
    }

    export interface CallEndpointAddedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.EndpointAdded;
      /**
       * New endpoint
       */
      endpoint: Endpoint;
    }

    export interface CallDisconnectedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.Disconnected;
      /**
       * Optional SIP headers are received with the event
       */
      headers: object;
      /**
       * True if the call was answered on another device via SIP forking, false otherwise
       */
      answeredElsewhere: boolean;
    }

    export interface CallOperationFailedEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.CallOperationFailed;
      /**
       * Error description
       */
      message: string;
    }

    export interface CallHeadersEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name: CallEvents.Connected | CallEvents.ProgressToneStart;
      /**
       * Optional SIP headers are received with the event
       */
      headers: object;
    }

    export interface CallDefaultEvent {
      /**
       * Call that triggered the event
       */
      call: Call;
      /**
       * Name of the event
       */
      name:
        | CallEvents.CallReconnected
        | CallEvents.CallReconnecting
        | CallEvents.ICECompleted
        | CallEvents.ICETimeout
        | CallEvents.ProgressToneStop;
    }

    export enum CallError {
      /** The call is already in requested state */
      ALREADY_IN_THIS_STATE = 'ALREADY_IN_THIS_STATE',
      /** Requested functionality is disabled */
      FUNCTIONALITY_IS_DISABLED = 'FUNCTIONALITY_IS_DISABLED',
      /** Operation is incorrect, for example reject outgoing call */
      INCORRECT_OPERATION = 'INCORRECT_OPERATION',
      /** Internal error occurred */
      INTERNAL_ERROR = 'INTERNAL_ERROR',
      /** Operation can't be performed due to the call is on hold. Unhold the call and repeat the operation */
      MEDIA_IS_ON_HOLD = 'MEDIA_IS_ON_HOLD',
      /** Operation can't be performed due to missing permission */
      MISSING_PERMISSION = 'MISSING_PERMISSION',
      /** Operation can't be performed due to the client is not logged in */
      NOT_LOGGED_IN = 'NOT_LOGGED_IN',
      /** Operation is rejected */
      REJECTED = 'REJECTED',
      /** Operation is not completed in time */
      TIMEOUT = 'TIMEOUT',
      /** Operation cannot be performed due to the call is reconnecting. */
      RECONNECTING = 'RECONNECTING',
    }

    /**
     * The events that are triggered by Call instance. Use Call.on to subscribe on any of these events.
     */
    export enum CallEvents {
      /**
       * Event is triggered when a realible connection is established for the call.
       * Depending on network conditions there can be a 2-3 seconds delay between first audio data and this event.
       * Handler function receives {@link EventHandlers.CallEventWithHeaders} object as an argument.
       */
      Connected = 'Connected',
      /**
       * Event is triggered when a call was disconnected.
       * Handler function receives {@link EventHandlers.Disconnected} object as an argument.
       */
      Disconnected = 'Disconnected',
      /**
       * Event is triggered when a new Endpoint is created. {@link Voximplant.Endpoint} represents an another participant in your call or conference.
       * Handler function receives {@link EventHandlers.EndpointAdded} object as an argument.
       */
      EndpointAdded = 'EndpointAdded',
      /**
       * Event is triggered due to a call failure.
       * Handler function receives {@link EventHandlers.Failed} object as an argument.
       */
      Failed = 'Failed',
      /**
       * Event is triggered when ICE connection is complete.
       * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
       */
      ICECompleted = 'ICECompleted',
      /**
       * Event is triggered when connection was not established due to a network connection problem between 2 peers.
       * Handler function receives {@link EventHandlers.CallEvent} object as an argument
       */
      ICETimeout = 'ICETimeout',
      /**
       * Event is triggered when INFO message is received.
       * Handler function receives {@link EventHandlers.InfoReceived} object as an argument.
       */
      InfoReceived = 'InfoReceived',
      /**
       * Event is triggered when local video is added to the call.
       * Handler function receives {@link EventHandlers.LocalVideoStreamAdded} object as an argument.
       */
      LocalVideoStreamAdded = 'LocalVideoStreamAdded',
      /**
       * Event is triggered when local video is removed from the call.
       * Handler function receives {@link EventHandlers.LocalVideoStreamRemoved} object as an argument.
       */
      LocalVideoStreamRemoved = 'LocalVideoStreamRemoved',
      /**
       * Event is triggered when a text message is received.
       * Handler function receives {@link EventHandlers.MessageReceived} object as an argument.
       */
      MessageReceived = 'MessageReceived',
      /**
       * Event is triggered when a progress tone playback starts.
       * Handler function receives {@link EventHandlers.CallEventWithHeaders} object as an argument.
       */
      ProgressToneStart = 'ProgressToneStart',
      /**
       * Event is triggered when a progress tone playback stops.
       * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
       */
      ProgressToneStop = 'ProgressToneStop',
      /**
       * Event is triggered when the connection to the Voximplant Cloud is lost due to a network issue and media streams may be interrupted in the call.
       * Until {@link CallReconnected} event is invoked, the following API calls will fail with {@link CallError#RECONNECTING} error:
       * {@link Voximplant.Call#sendVideo}
       * {@link Voximplant.Call#receiveVideo}
       * {@link Voximplant.Call#hold}
       * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
       */
      CallReconnecting = 'CallReconnecting',
      /**
       * Event is triggered when the connection to the Voximplant Cloud is restored and media stream are active in the call.
       * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
       */
      CallReconnected = 'CallReconnected',
      /**
       * Event is triggered due to a call operation failure by the Call.hold, Call.sendVideo and Call.receiveVideo methods.
       * The handler function receives an event with the following parameters as an argument.
       */
      CallOperationFailed = 'CallOperationFailed',
    }

    /**
     * Class that represents a video stream within a call.
     */
    export class VideoStream {
      /**
       * Video stream id.
       */
      public id: string;

      /**
       * True if video stream is local, false otherwise.
       */
      public isLocal: boolean;

      /**
       * Video stream type
       */
      public type: VideoStreamType;
    }

    export enum VideoStreamType {
      /**
       * Indicates that video stream source is camera
       */
      VIDEO = 'Video',
      /**
       * Indicates that video stream source is screen sharing
       */
      SCREEN_SHARING = 'ScreenSharing',
    }

    export enum RenderScaleType {
      /**
       * Video frame is scaled to fill the size of the view by maintaining the aspect ratio.
       * Some portion of the video frame may be clipped.
       */
      SCALE_FILL = 'fill',
      /**
       * Video frame is scaled to be fit the size of
       * the view by maintaining the aspect ratio (black borders may be displayed).
       */
      SCALE_FIT = 'fit',
    }

    export interface EndpointHandlerEvents {
      [EndpointEvents.InfoUpdated]: EndpointDefaultEvent;
      [EndpointEvents.Removed]: EndpointDefaultEvent;
      [EndpointEvents.VoiceActivityStarted]: EndpointDefaultEvent;
      [EndpointEvents.VoiceActivityStopped]: EndpointDefaultEvent;
      [EndpointEvents.RemoteVideoStreamAdded]: EndpointVideoStreamEvent;
      [EndpointEvents.RemoteVideoStreamRemoved]: EndpointVideoStreamEvent;
    }

    export interface EndpointVideoStreamEvent {
      /**
       * Call which endpoint belongs to
       */
      call: Call;
      /**
       * Endpoint that triggered the event
       */
      endpoint: Endpoint;
      /**
       * Name of the event
       */
      name:
        | EndpointEvents.RemoteVideoStreamAdded
        | EndpointEvents.RemoteVideoStreamRemoved;
      /**
       * Remote video stream removed
       */
      videoStream: VideoStream;
    }

    export interface EndpointDefaultEvent {
      /**
       * Call which endpoint belongs to
       */
      call: Call;
      /**
       * Endpoint that triggered the event
       */
      endpoint: Endpoint;
      /**
       * Name of the event
       */
      name:
        | EndpointEvents.InfoUpdated
        | EndpointEvents.Removed
        | EndpointEvents.VoiceActivityStarted
        | EndpointEvents.VoiceActivityStopped;
    }

    /**
     * Events that are triggered when Endpoint is updated/edited,
     * removed or started/stopped to receive stream from another Endpoint.
     */
    export enum EndpointEvents {
      /**
       * Event is triggered when endpoint information such as display name, user name and sip uri is updated.
       * Handler function receives {@link EventHandlers.InfoUpdated} object as an argument.
       */
      InfoUpdated = 'InfoUpdated',
      /**
       * Event is triggered after endpoint added video stream to the call.
       * Handler function receives {@link EventHandlers.RemoteVideoStreamAdded} object as an argument.
       */
      RemoteVideoStreamAdded = 'RemoteVideoStreamAdded',
      /**
       * Event is triggered after endpoint removed video stream from the call. Event is not triggered on call end.
       * Handler function receives {@link EventHandlers.RemoteVideoStreamRemoved} object as an argument.
       */
      RemoteVideoStreamRemoved = 'RemoteVideoStreamRemoved',
      /**
       * Event is triggered when an Endpoint is removed.
       * Handler function receives {@link EventHandlers.Removed} object as an argument.
       */
      Removed = 'Removed',
      /**
       * Event is triggered when a voice activity of the endpoint is detected in a conference call.
       */
      VoiceActivityStarted = 'VoiceActivityStarted',
      /**
       * Event is triggered when a voice activity of the endpoint is stopped in a conference call.
       */
      VoiceActivityStopped = 'VoiceActivityStopped',
    }

    export enum CallError {
      /** The call is already in requested state */
      ALREADY_IN_THIS_STATE = 'ALREADY_IN_THIS_STATE',
      /** Requested functionality is disabled */
      FUNCTIONALITY_IS_DISABLED = 'FUNCTIONALITY_IS_DISABLED',
      /** Operation is incorrect, for example reject outgoing call */
      INCORRECT_OPERATION = 'INCORRECT_OPERATION',
      /** Internal error occurred */
      INTERNAL_ERROR = 'INTERNAL_ERROR',
      /** Operation can't be performed due to the call is on hold. Unhold the call and repeat the operation */
      MEDIA_IS_ON_HOLD = 'MEDIA_IS_ON_HOLD',
      /** Operation can't be performed due to missing permission */
      MISSING_PERMISSION = 'MISSING_PERMISSION',
      /** Operation can't be performed due to the client is not logged in */
      NOT_LOGGED_IN = 'NOT_LOGGED_IN',
      /** Operation is rejected */
      REJECTED = 'REJECTED',
      /** Operation is not completed in time */
      TIMEOUT = 'TIMEOUT',
      /** Operation cannot be performed due to the call is reconnecting. */
      RECONNECTING = 'RECONNECTING',
    }

    export interface CallSettings {
      /**
       * Custom string associated with the call session.
       * It can be passed to the cloud to be obtained from the CallAlerting event
       * or Call History using HTTP API. Maximum size is 200 bytes.
       * Use the Call.sendMessage method to pass a string over the limit;
       * in order to pass a large data use media_session_access_url on your backend.
       */
      customData?: string | null;
      /**
       * Specify if simulcast feature should be enabled in the conference call.
       */
      enableSimulcast?: boolean;
      /**
       * Optional custom parameter (SIP headers) that should be passes with call (INVITE) message.
       * Parameter names must start with "X-" to be processed. Headers size limit is 200 bytes
       */
      extraHeaders?: { [key: string]: string } | null;
      /**
       * Preferred video codec for a particular call that this CallSettings are applied to.
       * VideoCodec.AUTO by default. For android, overrides ClientConfig.preferredVideoCodec global configuration.
       */
      preferredVideoCodec?: VideoCodec;
      /**
       * IOS only.
       * Specify if the outgoing call on iOS will be made with CallKit. Applicable only for outgoing calls.
       */
      setupCallKit?: boolean;
      /**
       * Tells if video should be supported for the call
       */
      video: VideoFlags;
    }

    export interface VideoFlags {
      /**
       * Set true if video receive is enabled for a call. True by default.
       */
      receiveVideo?: boolean;
      /**
       * Set true if video send is enabled for a call. False by default.
       */
      sendVideo?: boolean;
    }

    export enum VideoCodec {
      /**
       * VP8 video codec
       */
      VP8 = 'VP8',
      /**
       * H264 video codec
       */
      H264 = 'H264',
      /**
       * Video codec for call will be chosen automatically
       */
      AUTO = 'AUTO',
    }

    export interface ClientConfig {
      /**
       * Application bundle id/package name for iOS/Android respectively.
       * You need to set this only if you are going to send push notifications across several
       * mobile apps on a specific platform (Android or iOS) using a single Voximplant application.
       */
      bundledId?: string | null;
      /**
       * Android only.
       * Enable/disable front facing camera mirroring. True by default.
       */
      enableCameraMirroring?: boolean;
      /**
       * Android only.
       * Enable debug logging. Set to false by default.
       */
      enableDebugLogging?: boolean;
      /**
       * Android only.
       * Enable log output to logcat. True by default.
       */
      enableLogcatLogging?: boolean;
      /**
       * Android only.
       * Enable video functionality. Set to true by default.
       */
      enableVideo?: boolean;
      /**
       * Force traffic to go through TURN servers. False by default.
       */
      forceRelayTraffic?: boolean;
      /**
       * IOS only.
       * Enable experimental packet recovery mode to decode broken h264 streams.
       */
      h264RecoveryMode?: boolean;
      /**
       * IOS only.
       * Log levels.
       */
      logLevel: LogLevel;
    }

    export enum LogLevel {
      /**
       * Log verbosity level, to include only error messages
       */
      ERROR = 'error',
      /**
       * Log verbosity level to include warning messages
       */
      WARNING = 'warning',
      /**
       * Default log verbosity level, to include informational messages
       */
      INFO = 'info',
      /**
       * Log verbosity level to include debug messages
       */
      DEBUG = 'debug',
      /**
       * Log verbosity level to include verbose messages
       */
      VERBOSE = 'verbose',
    }

    export enum RequestAudioFocusMode {
      /**
       * Request of audio focus is performed when a call is started.
       * @memberOf Voximplant.RequestAudioFocusMode
       */
      REQUEST_ON_CALL_START = 'REQUEST_ON_CALL_START',
      /**
       * Request of audio focus is performed when a call is established.
       * @memberOf Voximplant.RequestAudioFocusMode
       */
      REQUEST_ON_CALL_CONNECTED = 'REQUEST_ON_CALL_CONNECTED',
    }
  }
}
