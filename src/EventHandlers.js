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