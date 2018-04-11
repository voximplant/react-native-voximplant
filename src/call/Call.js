/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

'use strict';
import React, { Component } from 'react';
import {
    Platform,
    NativeModules,
	NativeEventEmitter,
	DeviceEventEmitter,
} from 'react-native';
import CallEvents from './CallEvents';

const CallModule = NativeModules.CallModule;

const EventEmitter = Platform.select({
	ios: new NativeEventEmitter(CallModule),
	android: DeviceEventEmitter,
});

export default class Call {

    constructor(callId) {
        this.callId = callId;
        this.listeners = {};

        CallModule.internalSetup(this.callId);

        this._VICallConnectedCallback = (event) => this._onConnected(event);
        this._VICallDisconnectedCallback = (event) => this._onDisconnected(event);
        this._VICallEndpointAddedCallback = (event) => this._onEndpointAdded(event);
        this._VICallFailedCallback = (event) => this._onFailed(event);
        this._VICallICECompletedCallback = (event) => this._onICECompleted(event);
        this._VICallICETimeoutCallback = (event) => this._onICETimeout(event);
        this._VICallInfoReceivedCallback = (event) => this._onInfoReceived(event);
        this._VICallMessageReceivedCallback = (event) => this._onMessageReceived(event);
        this._VICallProgressToneStartCallback = (event) => this._onProgessToneStart(event);
        this._VICallProgressToneStopCallback = (event) => this._onProgressToneStop(event);
        this._VICallLocalVideoStreamAddedCallback = (event) => this._onLocalVideoStreamAdded(event);
        this._VICallLocalVideoStreamRemovedCallback = (event) => this._onLocalVideoStreamRemoved(event);

        this._addEventListeners();
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

    hangup(headers) {
        CallModule.hangup(this.callId, headers);
    }

    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _onConnected(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.Connected, event);
        }
    }

    _onDisconnected(event) {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.Disconnected, event);
        }
    }

    _onEndpointAdded(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.set('call', this);
            this._emit(CallEvents.EndpointAdded, event);
        }
    }

    _onFailed(event) {
        if (event.callId === this.callId) {
            this._removeEventListeners();
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.Failed, event);
        }
    }

    _onICETimeout(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.ICETimeout, event);
        }
    }

    _onICECompleted(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.ICECompleted, event);
        }
    }

    _onInfoReceived(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.InfoReceived, event);
        }
    }

    _onMessageReceived(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.MessageReceived, event);
        }
    }

    _onProgessToneStart(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.ProgressToneStart, event);
        }
    }

    _onProgressToneStop(event) {
        if (event.callId === this.callId) {
            delete event.callId;
            event.call = this;
            this._emit(CallEvents.ProgressToneStop, event);
        }
    }

    _onLocalVideoStreamAdded(event) {

    }

    _onLocalVideoStreamRemoved(event) {

    }

    _addEventListeners() {
        EventEmitter.addListener('VICallConnected', this._VICallConnectedCallback);
        EventEmitter.addListener('VICallDisconnected', this._VICallDisconnectedCallback);
        EventEmitter.addListener('VICallEndpointAdded', this._VICallEndpointAddedCallback);
        EventEmitter.addListener('VICallFailed', this._VICallFailedCallback);
        EventEmitter.addListener('VICallICECompleted', this._VICallICECompletedCallback);
        EventEmitter.addListener('VICallICETimeout', this._VICallICETimeoutCallback);
        EventEmitter.addListener('VICallInfoReceived', this._VICallInfoReceivedCallback);
        EventEmitter.addListener('VICallMessageReceived', this._VICallMessageReceivedCallback);
        EventEmitter.addListener('VICallProgressToneStart', this._VICallProgressToneStartCallback);
        EventEmitter.addListener('VICallProgressToneStop', this._VICallProgressToneStopCallback);
        EventEmitter.addListener('VICallLocalVideoStreamAdded', this._VICallLocalVideoStreamAddedCallback);
        EventEmitter.addListener('VICallLocalVideoStreamRemoved', this._VICallLocalVideoStreamRemovedCallback);
        //EventEmitter.addListener('VIUpdated', (event) => this._onUpdated(event));
    }

    _removeEventListeners() {
        EventEmitter.removeListener('VICallConnected', this._VICallConnectedCallback);
        EventEmitter.removeListener('VICallDisconnected', this._VICallDisconnectedCallback);
        EventEmitter.removeListener('VICallEndpointAdded', this._VICallEndpointAddedCallback);
        EventEmitter.removeListener('VICallFailed', this._VICallFailedCallback);
        EventEmitter.removeListener('VICallICECompleted', this._VICallICECompletedCallback);
        EventEmitter.removeListener('VICallICETimeout', this._VICallICETimeoutCallback);
        EventEmitter.removeListener('VICallInfoReceived', this._VICallInfoReceivedCallback);
        EventEmitter.removeListener('VICallMessageReceived', this._VICallMessageReceivedCallback);
        EventEmitter.removeListener('VICallProgressToneStart', this._VICallProgressToneStartCallback);
        EventEmitter.removeListener('VICallProgressToneStop', this._VICallProgressToneStopCallback);
        EventEmitter.removeListener('VICallLocalVideoStreamAdded', this._VICallLocalVideoStreamAddedCallback);
        EventEmitter.removeListener('VICallLocalVideoStreamRemoved', this._VICallLocalVideoStreamRemovedCallback);
    }

}