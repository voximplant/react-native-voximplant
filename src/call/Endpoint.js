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

        this._VIEndpointInfoUpdatedCallback = (event) => this._onEndpointInfoUpdated(event);
        this._VIEndpointRemovedCallback = (event) => this._onEndpointRemoved(event);
        this._VIRemoteVideoStreamAddedCallback = (event) => this._onRemoteVideoStreamAdded(event);
        this._VIRemoteVideoStreamRemovedCallback = (event) => this._onRemoteVideoStreamRemoved(event);

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

    _onEndpointInfoUpdated(event) {
        if (event.endpointId === this.id) {
            this.displayName = event.displayName;
            this.sipUri = event.sipUri;
            this.userName = event.endpointName;
            this._prepareEvent(event);
            this._emit(EndpointEvents.InfoUpdated, event);
        }
    }

    _onEndpointRemoved(event) {
        if (event.endpointId === this.id) {
            CallManager.getInstance().removeEndpoint(event.callId, this);
            this._removeEventListeners();
            this._prepareEvent(event);
            this._emit(EndpointEvents.Removed, event);
        }
    }

    _onRemoteVideoStreamAdded(event) {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            this._emit(EndpointEvents.RemoteVideoStreamAdded, event);
        }
    }

    _onRemoteVideoStreamRemoved(event) {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            this._emit(EndpointEvents.RemoteVideoStreamRemoved, event);
        }
    }

    _addEventListeners() {
        EventEmitter.addListener('VIEndpointInfoUpdated', this._VIEndpointInfoUpdatedCallback);
        EventEmitter.addListener('VIEnpointRemoved', this._VIEndpointRemovedCallback);
        EventEmitter.addListener('VIEnpointRemoteVideoStreamAdded', this._VIRemoteVideoStreamAddedCallback);
        EventEmitter.addListener('VIEnpointRemoteVideoStreamRemoved', this._VIRemoteVideoStreamRemovedCallback);
    }

    _removeEventListeners() {
        EventEmitter.removeListener('VIEndpointInfoUpdated', this._VIEndpointInfoUpdatedCallback);
        EventEmitter.removeListener('VIEnpointRemoved', this._VIEndpointRemovedCallback);
        EventEmitter.removeListener('VIEnpointRemoteVideoStreamAdded', this._VIRemoteVideoStreamAddedCallback);
        EventEmitter.removeListener('VIEnpointRemoteVideoStreamRemoved', this._VIRemoteVideoStreamRemovedCallback);
    }
}