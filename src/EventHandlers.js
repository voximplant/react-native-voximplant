/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

/**
 * @module Voximplant.EventHandlers
 */

'use strict';

/**
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
 * @property {boolean} result - True in case of success, false - otherwise
 * @property {number} code - Error code
 * @property {Voximplant.LoginTokens} tokens - New tokens structure
 */
const AuthTokenResult = {

};

/**
 * @property {string} message - Failure reason description
 */
const ConnectionFailed = {

};

/**
 *
 */
const ConnectionEstablished = {

};

/**
 *
 */
const ConnectionClosed = {

};

/**
 * @property {Voximplant.Call} call - Incoming call instance. See {@link Call} methods for details
 * @property {object} headers - Optional SIP headers received with the event
 * @property {boolean} video - True if the caller initiated video call
 */
const IncomingCall = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 */
const CallEvent = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 */
const CallEventWithHeaders = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {boolean} answeredElsewhere True if the call was answered on another device via SIP forking, false otherwise
 */
const Disconnected = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {number} code Call status code
 * @property {string} reason Status message of a call failure (i.e. Busy Here)
 */
const Failed = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {object} headers Optional SIP headers are received with the event
 * @property {string} mimeType MIME type of INFO message
 * @property {string} body Content of the message
 */
const InfoReceived = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {string} text Content of the message
 */
const MessageReceived = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Local video stream
 */
const LocalVideoStreamAdded = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Local video stream
 */
const LocalVideoStreamRemoved = {

};

/**
 * @property {Voximplant.CallError} code - Error code
 * @property {string} message - Error description
 */
const CallOperationFailed = {

};

/**
 * @property {Voximplant.Call} call - Call that triggered the event
 * @property {Voximplant.Endpoint} endpoint - New endpoint
 */
const EndpointAdded = {

};

/**
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 */
const InfoUpdated = {

};

/**
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 */
const Removed = {

};

/**
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Remote video stream added
 */
const RemoteVideoStreamAdded = {

};

/**
 * @property {Voximplant.Call} call - Call which endpoint belongs to
 * @property {Voximplant.Endpoint} endpoint - Endpoint that triggered the event
 * @property {Voximplant.VideoStream} videoStream - Remote video stream removed
 */
const RemoteVideoStreamRemoved = {

};

/**
 * @property {Voximplant.Hardware.AudioDevice} currentDevice - Audio device to be used
 */
const DeviceChanged = {

};

/**
 * @property {Voximplant.Hardware.AudioDevice[]} newDeviceList - List of currently available audio devices.
 */
const DeviceListChanged = {

};

/**
 *
 */
const CameraDisconnected = {

};

/**
 * @property {string} error - Description of error occurred
 */
const CameraError = {

};

/**
 * @property {boolean} isFrontCamera - True if new camera is front facing camera
 */
const CameraSwitchDone = {

};

/**
 * @property {string} error - Description of error occurred.
 */
const CameraSwitchError = {

};