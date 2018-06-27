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

import EndpointEvents from './EndpointEvents';
import CallManager from './CallManager';
import VideoStream from './VideoStream';

const CallModule = NativeModules.CallModule;

const EventEmitter = Platform.select({
	ios: new NativeEventEmitter(CallModule),
	android: DeviceEventEmitter,
});

export default class Endpoint {
    constructor(id, displayName, sipUri, userName) {
        this.id = id;
        this.displayName = displayName;
        this.sipUri = sipUri;
        this.userName = userName;
        this.listeners = {};

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

    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _prepareEvent(event) {
        delete event.endpointId;
        event.endpoint = this;
        event.call = CallManager.getInstance().getCallById(event.callId);
        delete event.callId;
    }

    //Endpoint events

    _VIEndpointInfoUpdated = (event) => {
        if (event.endpointId === this.id) {
            this.displayName = event.displayName;
            this.sipUri = event.sipUri;
            this.userName = event.endpointName;
            this._prepareEvent(event);
            this._emit(EndpointEvents.InfoUpdated, event);
        }
    };

    _VIEndpointRemoved = (event) => {
        if (event.endpointId === this.id) {
            CallManager.getInstance().removeEndpoint(event.callId, this);
            this._removeEventListeners();
            this._prepareEvent(event);
            this._emit(EndpointEvents.Removed, event);
        }
    };

    _VIEndpointRemoteVideoStreamAdded = (event) => {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            let videoStream = new VideoStream(event.videoStreamId, false);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(EndpointEvents.RemoteVideoStreamAdded, event);
        }
    };

    _VIEndpointRemoteVideoStreamRemoved = (event) => {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            let videoStream = CallManager.getInstance().getVideoStreamById(event.videoStreamId);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(EndpointEvents.RemoteVideoStreamRemoved, event);
        }
    };

    _events = ['VIEndpointInfoUpdated',
        'VIEndpointRemoved',
        'VIEndpointRemoteVideoStreamAdded',
        'VIEndpointRemoteVideoStreamRemoved'];

    _addEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.addListener(item, this[`_${item}`]);
        });
    }

    _removeEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.removeListener(item, this[`_${item}`]);
        });
    }
}