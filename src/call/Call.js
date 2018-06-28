/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
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

const CallModule = NativeModules.CallModule;

const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(CallModule),
    android: DeviceEventEmitter,
});

export default class Call {

    constructor(callId) {
        this.callId = callId;
        this.listeners = {};

        this._addEventListeners();
        CallModule.internalSetup(this.callId);

        CallManager.getInstance().addCall(this);
    }

    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    off(event, handler) {
        if (this.listeners[event]) {
            this.listeners[event].delete(handler);
        }
    }

    answer(callSettings) {
        //TODO(yulia): add H264First parameter for ios module call
        if (!callSettings) {
            callSettings = {};
        }
        if (callSettings.H264First === undefined) {
            callSettings.H264First = false;
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

        CallModule.answer(this.callId, callSettings.video, callSettings.customData, callSettings.extraHeaders);
    }

    decline(headers) {
        CallModule.decline(this.callId, headers);
    }

    reject(headers) {
        CallModule.reject(this.callId, headers);
    }

    sendAudio(enable) {
        CallModule.sendAudio(this.callId, enable);
    }

    sendTone(key) {
        CallModule.sendDTMF(this.callId, key);
    }

    sendVideo(enable) {
        return CallModule.sendVideo(this.callId, enable);
    }

    hold(enable) {
        return CallModule.hold(this.callId, enable);
    }

    receiveVideo() {
        return CallModule.receiveVideo(this.callId);
    }

    hangup(headers) {
        CallModule.hangup(this.callId, headers);
    }

    sendMessage(message) {
        CallModule.sendMessage(this.callId, message);
    }

    sendInfo(mimeType, body, extraHeaders) {
        CallModule.sendInfo(this.callId, mimeType, body, extraHeaders);
    }

    getEndpoints() {
        return [...CallManager.getInstance().getCallEndpoints(this.callId)];
    }

    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    //Call events

    _VICallConnectedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.Connected, event);
        }
    };

    _VICallDisconnectedCallback = (event) => {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            this._replaceCallIdWithCallInEvent(event);
            CallManager.getInstance().removeCall(this);
            this._emit(CallEvents.Disconnected, event);
        }
    };

    _VICallEndpointAddedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let endpoint = new Endpoint(event.endpointId, event.displayName, event.sipUri, event.endpointName);
            CallManager.getInstance().addEndpoint(this.callId, endpoint);
            event.endpoint = endpoint;
            this._emit(CallEvents.EndpointAdded, event);
        }
    };

    _VICallFailedCallback = (event) => {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            this._replaceCallIdWithCallInEvent(event);
            CallManager.getInstance().removeCall(this);
            this._emit(CallEvents.Failed, event);
        }
    };

    _VICallICETimeoutCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ICETimeout, event);
        }
    };

    _VICallICECompletedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ICECompleted, event);
        }
    };

    _VICallInfoReceivedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.InfoReceived, event);
        }
    };

    _VICallMessageReceivedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.MessageReceived, event);
        }
    };

    _VICallProgressToneStartCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ProgressToneStart, event);
        }
    };

    _VICallProgressToneStopCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            this._emit(CallEvents.ProgressToneStop, event);
        }
    };

    _VICallLocalVideoStreamAddedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let videoStream = new VideoStream(event.videoStreamId, true);
            CallManager.getInstance().addVideoStream(videoStream);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(CallEvents.LocalVideoStreamAdded, event);
        }
    };

    _VICallLocalVideoStreamRemovedCallback = (event) => {
        if (event.callId === this.callId) {
            this._replaceCallIdWithCallInEvent(event);
            let videoStream = CallManager.getInstance().getVideoStreamById(event.videoStreamId);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(CallEvents.LocalVideStreamRemoved, event);
        }
    };

    _replaceCallIdWithCallInEvent(event) {
        delete event.callId;
        event.call = this;
    }

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

    _addEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.addListener(item, this[`_${item}Callback`]);
        });
    }

    _removeEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.removeListener(item, this[`_${item}Callback`]);
        });
    }

}