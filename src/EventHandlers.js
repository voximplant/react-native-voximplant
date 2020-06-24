/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

/**
 * @module Voximplant.EventHandlers
 */

'use strict';

/**
 * @property {string} name - Name of the event
 * @property {boolean} result - True in case of success, false - otherwise
 * @property {number} code - Auth result error code
 * @property {string} displayName - Authorized user's display name
 * @property {string} key - This parameter is used to calculate hash parameter for {@link Client.loginWithOneTimeKey} method.
 *                          AuthResult with the key dispatched after {@link Client.requestOneTimeLoginKey} method was called.
 * @property {Voximplant.LoginTokens} tokens - New tokens structure
 */
const AuthResult = {

};

/**
 * @property {string} name - Name of the event
 * @property {boolean} result - True in case of success, false - otherwise
 * @property {number} code - Error code
 * @property {Voximplant.LoginTokens} tokens - New tokens structure
 */
const AuthTokenResult = {

};

/**
 * @property {string} name - Name of the event
 * @property {string} message - Failure reason description
 */
const ConnectionFailed = {

};

/**
 * @property {string} name - Name of the event
 */
const ConnectionEstablished = {

};

/**
 * @property {string} name - Name of the event
 */
const ConnectionClosed = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Incoming call instance. See {@link Call} methods for details
 * @property {object} headers - Optional SIP headers received with the event
 * @property {boolean} video - True if the caller initiated video call
 */
const IncomingCall = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 */
const CallEvent = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 */
const CallEventWithHeaders = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {boolean} answeredElsewhere True if the call was answered on another device via SIP forking, false otherwise
 */
const Disconnected = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {number} code Call status code
 * @property {string} reason Status message of a call failure (i.e. Busy Here)
 */
const Failed = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {string} mimeType MIME type of INFO message
 * @property {string} body Content of the message
 */
const InfoReceived = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {string} text Content of the message
 */
const MessageReceived = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Local video stream
 */
const LocalVideoStreamAdded = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Local video stream
 */
const LocalVideoStreamRemoved = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.CallError} code - Error code
 * @property {string} message - Error description
 */
const CallOperationFailed = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.Endpoint} endpoint - New endpoint
 */
const EndpointAdded = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 */
const InfoUpdated = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 */
const Removed = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Remote video stream added
 */
const RemoteVideoStreamAdded = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Remote video stream removed
 */
const RemoteVideoStreamRemoved = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Hardware.AudioDevice} currentDevice - Audio device to be used
 */
const DeviceChanged = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Hardware.AudioDevice[]} newDeviceList - List of currently available audio devices.
 */
const DeviceListChanged = {

};

/**
 * @property {string} name - Name of the event
 */
const CameraDisconnected = {

};

/**
 * @property {string} name - Name of the event
 * @property {string} error - Description of error occurred
 */
const CameraError = {

};

/**
 * @property {string} name - Name of the event
 * @property {boolean} isFrontCamera - True if new camera is front facing camera
 */
const CameraSwitchDone = {

};

/**
 * @property {string} name - Name of the event
 * @property {string} error - Description of error occurred.
 */
const CameraSwitchError = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Hardware.AudioFile} audioFile - Audio file that triggered the event
 * @property {boolean} result - True if the audio file has started successfully
 * @property {string} error - Error code on iOS if the audio file failed to start
 */
const AudioFileStarted = {

};

/**
 * @property {string} name - Name of the event
 * @property {Voximplant.Hardware.AudioFile} audioFile - Audio file that triggered the event
 * @property {boolean} result - True if the audio file has stopped successfully
 * @property {string} error - Error code on iOS if the audio file failed to stop
 */
const AudioFileStopped = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {Voximplant.Messaging.User} user - Object with user information
 */
const UserEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {boolean} online - The user status.
 */
const StatusEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {Array<number>} users - Array of the IM user identifiers of the current (un)subscription.
 */
const SubscriptionEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {Voximplant.Messaging.Conversation} conversation - Object with conversation information
 * @property {number} sequence - Sequence number of this event
 * @property {number} timestamp - UNIX timestamp (seconds) that specifies the time the conversation event was provoked
 */
const ConversationEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {Array<string>} conversationList - Array of conversations UUIDs.
 */
const ConversationListEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {string} conversationUUID - The conversation UUID associated with this event.
 * @property {number} sequence - The sequence number of the event that was marked as read by the user initiated this event.
 * Only available for {@link Voximplant.Messaging.MessengerEventTypes.Read}.
 */
const ConversationServiceEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {Voximplant.Messaging.Message} message - Message object.
 * @property {number} sequence - The sequence number for this event.
 * @property {number} timestamp - The UNIX timestamp (seconds) that specifies the time the message event was provoked.
 */
const MessageEvent = {

};

/**
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} imUserId - The IM id for the user that initiated the event.
 * @property {number} from - The event sequence number from which the events were retransmitted.
 * @property {number} to - The event sequence number to which the events were retransmitted.
 * @property {Array<object>} events - The array of the event objects that were retransmitted ({@link EventHandlers.ConversationEvent}
 * or {@link EventHandlers.MessageEvent}).
 */
const RetransmitEvent = {

};

/**
 * Interface that represents error messenger events.
 *
 * @property {Voximplant.Messaging.MessengerAction} action - Action that triggered this event.
 * @property {Voximplant.Messaging.MessengerEventTypes} eventType - Messenger event type.
 * @property {number} code - Error code
 *
 * Error codes and their descriptions:
 * - 0 - Something went wrong. Please check your input or required parameters.
 * - 1 - Transport message structure is wrong.
 * - 2 - Event name is unknown.
 * - 3 - User is not authorized.
 * - 8 - Conversation does not exist
 * - 10 - Message with this UUID does not exist in the conversation.
 * - 11 - Message with this UUID is deleted from the conversation.
 * - 12 - ACL error.
 * - 13 - User is already in the participants list.
 * - 15 - Public join is not available for this conversation.
 * - 16 - Conversation with this UUID is deleted.
 * - 18 - User validation error.
 * - 19 - User is not in the participants list.
 * - 21 - Number of requested objects is 0 or larger than allowed by the service.
 * - 22 - Number of requested objects is larger than allowed by the service.
 * - 23 - Message size exceeds the limit of 5000 symbols.
 * - 24 - The 'seq' parameter value is greater than currently possible.
 * - 25 - User is not found.
 * - 26 - The notification event is incorrect.
 * - 28 - The 'from' field value is greater than the 'to' field value.
 * - 30 - IM service is not available. Try again later.
 * - 32 - N messages per second limit reached. Please try again later.
 * - 33 - N messages per minute limit reached. Please try again later.
 * - 34 - Direct conversation cannot be public or uber.
 * - 35 - Direct conversation is allowed between two users only.
 * - 36 - Passing the 'eventsFrom', 'eventsTo' and 'count' parameters simultaneously is not allowed. You should use only two of these parameters.
 * - 37 - Adding participant to direct conversation is not allowed.
 * - 38 - Removing participant from direct conversation is not allowed.
 * - 39 - Joining direct conversation is not allowed.
 * - 40 - Leaving direct conversation is not allowed.
 * - 41 - Specify at least two parameters: eventsFrom, eventsTo, count.
 * - 500 - Internal error.
 * - 10000 - Method calls within 10s interval from the last call are discarded.
 * - 10001 - Invalid argument(s). | Message text exceeds the length limit.
 * - 10002 - Response timeout.
 * - 10003 - Client is not logged in.
 * - 10004 - Failed to process response.
 *
 * @property {string} description - Error description
 */
const ErrorEvent = {

};
