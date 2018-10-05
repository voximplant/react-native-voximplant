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

const CallModule = NativeModules.VICallModule;

const EventEmitter = Platform.select({
	ios: new NativeEventEmitter(CallModule),
	android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant
 * @class Endpoint
 * @classdesc Class that represents any remote media unit in a call. Current endpoints can be retrieved via the {@link Call#getEndpoints} method.
 */
export default class Endpoint {
    /**
     * @member {string} id - The endpoint id
     * @memberOf Voximplant.Endpoint
     */
    id;

    /**
     * @member {string} displayName - User display name of the endpoint.
     * @memberOf Voximplant.Endpoint
     */
    displayName;

    /**
     * @member {string} sipUri - SIP URI of the endpoint
     * @memberOf Voximplant.Endpoint
     */
    sipUri;

    /**
     * @member {string} userName - User name of the endpoint.
     * @memberOf Voximplant.Endpoint
     */
    userName;

    /**
     * @ignore
     */
    constructor(id, displayName, sipUri, userName) {
        this.id = id;
        this.displayName = displayName;
        this.sipUri = sipUri;
        this.userName = userName;
        this.listeners = {};

        this._addEventListeners();
    }

    /**
     * Register a handler for the specified endpoint event.
     * One event can have more than one handler.
     * Use the {@link Voximplant.Endpoint#off} method to delete a handler.
     * @param {Voximplant.EndpointEvents} event
     * @param {function} handler
     * @memberOf Voximplant.Endpoint
     */
    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified endpoint event.
     * @param {Voximplant.EndpointEvents} event
     * @param {function} handler
     * @memberOf Voximplant.Endpoint
     */
    off(event, handler) {
        if (this.listeners[event]) {
            this.listeners[event].delete(handler);
        }
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    /**
     * @private
     */
    _prepareEvent(event) {
        delete event.endpointId;
        event.endpoint = this;
        event.call = CallManager.getInstance().getCallById(event.callId);
        delete event.callId;
    }

    //Endpoint events
    /**
     *
     * @private
     */
    _VIEndpointInfoUpdated = (event) => {
        if (event.endpointId === this.id) {
            this.displayName = event.displayName;
            this.sipUri = event.sipUri;
            this.userName = event.endpointName;
            delete event.displayName;
            delete event.sipUri;
            delete event.endpointName;
            delete event.endpointName;
            this._prepareEvent(event);
            this._emit(EndpointEvents.InfoUpdated, event);
        }
    };

    /**
     * @private
     */
    _VIEndpointRemoved = (event) => {
        if (event.endpointId === this.id) {
            CallManager.getInstance().removeEndpoint(event.callId, this);
            this._removeEventListeners();
            this._prepareEvent(event);
            this._emit(EndpointEvents.Removed, event);
        }
    };

    /**
     * @private
     */
    _VIEndpointRemoteVideoStreamAdded = (event) => {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            let videoStream = new VideoStream(event.videoStreamId, false);
            CallManager.getInstance().addVideoStream(CallManager.getInstance().getCallIdByEndpointId(this.id), videoStream);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(EndpointEvents.RemoteVideoStreamAdded, event);
        }
    };

    /**
     * @private
     */
    _VIEndpointRemoteVideoStreamRemoved = (event) => {
        if (event.endpointId === this.id) {
            this._prepareEvent(event);
            let videoStream = CallManager.getInstance().getVideoStreamById(event.videoStreamId);
            CallManager.getInstance().removeVideoStream(CallManager.getInstance().getCallIdByEndpointId(this.id), videoStream);
            delete event.videoStreamId;
            event.videoStream = videoStream;
            this._emit(EndpointEvents.RemoteVideoStreamRemoved, event);
        }
    };

    /**
     * @private
     */
    _events = ['VIEndpointInfoUpdated',
        'VIEndpointRemoved',
        'VIEndpointRemoteVideoStreamAdded',
        'VIEndpointRemoteVideoStreamRemoved'];

    /**
     * @private
     */
    _addEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.addListener(item, this[`_${item}`]);
        });
    }

    /**
     * @private
     */
    _removeEventListeners() {
        this._events.forEach((item) => {
            EventEmitter.removeListener(item, this[`_${item}`]);
        });
    }
}