/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import CallEvents from './CallEvents';
import CallManager from './CallManager';
import Endpoint from './Endpoint';
import VideoStream from './VideoStream';
import {VideoCodec} from "../Enums";

const CallModule = NativeModules.VICallModule;

const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(CallModule),
    android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant
 * @class Call
 * @classdesc Class that may be used for call operations like answer, reject, hang up abd mid-call operations like hold, start/stop video and others.
 */
export default class Call {
    /**
     * @member {string} callId - The call id
     * @memberOf Voximplant.Call
     */
    callId;

    /**
     * @member {VideoStream[]} localVideoStreams - Local video streams
     * @memberOf Voximplant.Call
     */
    localVideoStreams;

    /**
     * @memberOf {string} callKitUUID - The CallKit UUID that may be used to match an incoming call with a push notification received before
     *                                  Always nil for outgoing calls on Call instance creation.
     *                                  For outgoing calls it is recommended to set CXStartCallAction.callUUID value to this property on
     *                                  handling CXStartCallAction
     * @memberOf Voximplant.Call
     */
    callKitUUID;

    /**
     * @ignore
     */
    constructor(callId) {
        this.callId = callId;
        this.callKitUUID = null;
        this.listeners = {};
        this.localVideoStreams = [];

        this._addEventListeners();
        CallModule.internalSetup(this.callId);

        CallManager.getInstance().addCall(this);
    }

    /**
     * Register a handler for the specified call event.
     * One event can have more than one handler.
     * Use the {@link Voximplant.Call#off} method to delete a handler.
     * @param {Voximplant.CallEvents} event
     * @param {function} handler - Handler function. A single parameter is passed - object with event information
     * @memberOf Voximplant.Call
     */
    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`Call: on: handler is not a Function`);
            return;
        }
        if (Object.values(CallEvents).indexOf(event) === -1) {
            console.warn(`Call: on: CallEvents does not contain ${event} event`);
            return;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified call event.
     * @param {Voximplant.CallEvents} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberOf Voximplant.Call
     */
    off(event, handler) {
        if (!this.listeners[event]) {
            return;
        }
        if (Object.values(CallEvents).indexOf(event) === -1) {
            console.warn(`Call: off: CallEvents does not contain ${event} event`);
            return;
        }
        if (handler && handler instanceof Function) {
            this.listeners[event].delete(handler);
        } else {
            this.listeners[event] = new Set();
        }
    }

    /**
     * Answer the incoming call.
     * @param {Voximplant.CallSettings} [callSettings] - Optional set of call settings.
     * @memberOf Voximplant.Call
     */
    answer(callSettings) {
        if (!callSettings) {
            callSettings = {};
        }
        if (callSettings.preferredVideoCodec === undefined) {
            callSettings.preferredVideoCodec = VideoCodec.AUTO;
        }
        if (callSettings.video === undefined) {
            callSettings.video = {};
            callSettings.video.sendVideo = false;
            callSettings.video.receiveVideo = true;
        }
        if (callSettings.customData === undefined) {
            callSettings.customData = null;
        }
        if (callSettings.extraHeaders === undefined) {
            callSettings.extraHeaders = null;
        }

        CallModule.answer(this.callId, callSettings.video, callSettings.preferredVideoCodec, callSettings.customData, callSettings.extraHeaders);
    }

    /**
     * Reject incoming call on all devices, where this user logged in.
     * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
     * @memberOf Voximplant.Call
     */
    decline(headers) {
        CallModule.decline(this.callId, headers);
    }

    /**
     * Reject incoming call on the part of Web SDK.
     * If a call is initiated from the PSTN, the network will receive "reject" command.
     * In case of a call from another Web SDK client, it will receive the CallEvents.Failed event with the 603 code.
     * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
     * @memberOf Voximplant.Call
     */
    reject(headers) {
        CallModule.reject(this.callId, headers);
    }

    /**
     * Enables or disables audio transfer from microphone into the call.
     * @param {boolean} enable - True if audio should be sent, false otherwise
     * @memberOf Voximplant.Call
     */
    sendAudio(enable) {
        CallModule.sendAudio(this.callId, enable);
    }

    /**
     * Send tone (DTMF). It triggers the {@link https://voximplant.com/docs/references/appengine/CallEvents.html#CallEvents_ToneReceived CallEvents.ToneReceived} event in the Voximplant cloud.
     * @param {string} key - Send tone according to pressed key: 0-9 , * , #
     * @memberOf Voximplant.Call
     */
    sendTone(key) {
        CallModule.sendDTMF(this.callId, key);
    }

    /**
     * Start/stop sending video from a call.
     * In case of a remote participant uses a React Native SDK client, it will receive either
     * the {@link EndpointEvents#RemoteVideoStreamAdded} or {@link EndpointEvents#RemoteVideoStreamRemoved} event accordingly.
     * @param {boolean} enable - True if video should be sent, false otherwise
     * @returns {Promise<void|EventHandlers.CallOperationFailed>}
     * @memberOf Voximplant.Call
     */
    sendVideo(enable) {
        return CallModule.sendVideo(this.callId, enable);
    }

    /**
     * Hold or unhold the call
     * @param {boolean} enable - True if the call should be put on hold, false for unhold
     * @returns {Promise<void|EventHandlers.CallOperationFailed>}
     * @memberOf Voximplant.Call
     */
    hold(enable) {
        return CallModule.hold(this.callId, enable);
    }

    /**
     * Start receive video if video receive was disabled before. Stop receiving video during the call is not supported.
     * @returns {Promise<void|EventHandlers.CallOperationFailed>}
     * @memberOf Voximplant.Call
     */
    receiveVideo() {
        return CallModule.receiveVideo(this.callId);
    }

    /**
     * Hangup the call
     * @param {object} [headers] - Optional custom parameters (SIP headers) that should be sent after disconnecting/cancelling call. Parameter names must start with "X-" to be processed by application
     * @memberOf Voximplant.Call
     */
    hangup(headers) {
        CallModule.hangup(this.callId, headers);
    }

    /**
     * Send text message. It is a special case of the {@link Voximplant.Call#sendInfo} method as it allows to send messages only of "text/plain" type.
     * You can get this message via the Voxengine {@link https://voximplant.com/docs/references/websdk/voximplant/callevents#messagereceived CallEvents.MessageReceived} event in our cloud.
     * You can get this message in Web SDK on other side via the {@link CallEvents#MessageReceived} event; see the similar
     * events for the {@link https://voximplant.com/docs/references/websdk Web},
     * {@link https://voximplant.com/docs/references/iossdk iOS} and {@link https://voximplant.com/docs/references/androidsdk Android} SDKs.
     * @param {string} message - Message text
     * @memberOf Voximplant.Call
     */
    sendMessage(message) {
        CallModule.sendMessage(this.callId, message);
    }

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
     * @memberOf Voximplant.Call
     */
    sendInfo(mimeType, body, extraHeaders) {
        CallModule.sendInfo(this.callId, mimeType, body, extraHeaders);
    }

    /**
     * Get all current Endpoints in the call.
     * @returns {Voximplant.Endpoint[]}
     * @memberOf Voximplant.Call
     */
    getEndpoints() {
        let endpoints = CallManager.getInstance().getCallEndpoints(this.callId);
        if (endpoints) {
            return [...endpoints];
        }
        return [];
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                console.log(`Call: emit event ${event}`);
                handler(...args);
            }
        } else {
            console.log(`Call: emit: no handlers for event: ${event}`);
        }
    }

    //Call events

    /**
     * @private
     */
    _VICallConnectedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.Connected, event);
        }
    };

    /**
     * @private
     */
    _VICallDisconnectedCallback = (event) => {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            CallManager.getInstance().removeCall(this);
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.Disconnected, event);
        }
    };

    /**
     * @private
     */
    _VICallEndpointAddedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let endpoint = CallManager.getInstance().getEndpointById(event.endpointId);
            if (!endpoint) {
                endpoint = new Endpoint(event.endpointId, event.displayName, event.sipUri, event.endpointName);
                CallManager.getInstance().addEndpoint(this.callId, endpoint);
            }
            event.endpoint = endpoint;
            this._emit(CallEvents.EndpointAdded, event);
        }
    };

    /**
     * @private
     */
    _VICallFailedCallback = (event) => {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            this._replaceCallIdWithCallInEvent(event);
            CallManager.getInstance().removeCall(this);
            this._emit(CallEvents.Failed, event);
        }
    };

    /**
     * @private
     */
    _VICallICETimeoutCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ICETimeout, event);
        }
    };

    /**
     * @private
     */
    _VICallICECompletedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ICECompleted, event);
        }
    };

    /**
     * @private
     */
    _VICallInfoReceivedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.InfoReceived, event);
        }
    };

    /**
     * @private
     */
    _VICallMessageReceivedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.MessageReceived, event);
        }
    };

    /**
     * @private
     */
    _VICallProgressToneStartCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ProgressToneStart, event);
        }
    };

    /**
     * @private
     */
    _VICallProgressToneStopCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ProgressToneStop, event);
        }
    };

    /**
     * @private
     */
    _VICallLocalVideoStreamAddedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let videoStream = new VideoStream(event.videoStreamId, true, event.videoStreamType);
            CallManager.getInstance().addVideoStream(this.callId, videoStream);
            this.localVideoStreams.push(videoStream);
            delete event.videoStreamId;
            delete event.videoStreamType;
            event.videoStream = videoStream;
            this._emit(CallEvents.LocalVideoStreamAdded, event);
        }
    };

    /**
     * @private
     */
    _VICallLocalVideoStreamRemovedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let videoStream = CallManager.getInstance().getVideoStreamById(event.videoStreamId);
            CallManager.getInstance().removeVideoStream(this.callId, videoStream);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            let videoStreamPos;
            this.localVideoStreams.forEach(function (item, index) {
                if (item.id === videoStream.id) {
                    videoStreamPos = index;
                }
            });
            this.localVideoStreams.splice(videoStreamPos, 1);
            this._emit(CallEvents.LocalVideoStreamRemoved, event);
        }
    };

    /**
     * @private
     */
    _replaceCallIdWithCallInEvent(event) {
        delete event.callId;
        event.call = this;
    }

    /**
     * @private
     */
    _events = ['VICallConnected',
        'VICallDisconnected',
        'VICallEndpointAdded',
        'VICallFailed',
        'VICallICECompleted',
        'VICallICETimeout',
        'VICallInfoReceived',
        'VICallMessageReceived',
        'VICallProgressToneStart',
        'VICallProgressToneStop',
        'VICallLocalVideoStreamAdded',
        'VICallLocalVideoStreamRemoved'];

    /**
     * @private
     */
    _addEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.addListener(item, this[`_${item}Callback`]);
        });
    }

    /**
     * @private
     */
    _removeEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.removeListener(item, this[`_${item}Callback`]);
        });
    }

}
