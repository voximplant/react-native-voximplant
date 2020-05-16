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
     * @member {VideoStream[]} videoStreams - Video streams of the endpoint.
     * @memberOf Voximplant.Endpoint
     */
    videoStreams;

    /**
     * @ignore
     */
    constructor(id, displayName, sipUri, userName) {
        this.id = id;
        this.displayName = displayName;
        this.sipUri = sipUri;
        this.userName = userName;
        this.listeners = {};
        this.videoStreams = [];

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
        if (!handler || !(handler instanceof Function)) {
            console.warn(`Endpoint: on: handler is not a Function`);
            return;
        }
        if (Object.values(EndpointEvents).indexOf(event) === -1) {
            console.warn(`Endpoint: on: EndpointEvents does not contain ${event} event`);
            return;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified endpoint event.
     * @param {Voximplant.EndpointEvents} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberOf Voximplant.Endpoint
     */
    off(event, handler) {
        if (!this.listeners[event]) {
            return;
        }
        if (Object.values(EndpointEvents).indexOf(event) === -1) {
            console.warn(`Endpoint: off: EndpointEvents does not contain ${event} event`);
            return;
        }
        if (handler && handler instanceof Function) {
            this.listeners[event].delete(handler);
        } else {
            this.listeners[event] = new Set();
        }
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = this.listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                console.log(`Endpoint: emit event ${event}`);
                handler(...args);
            }
        } else {
            console.log(`Endpoint: emit: no handlers for event: ${event}`);
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
            let videoStream = new VideoStream(event.videoStreamId, false, event.videoStreamType);
            CallManager.getInstance().addVideoStream(CallManager.getInstance().getCallIdByEndpointId(this.id), videoStream);
            delete event.videoStreamId;
            delete event.videoStreamType;
            event.videoStream = videoStream;
            this.videoStreams.push(videoStream);
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
            let videoStreamPos;
            this.videoStreams.forEach(function (item, index) {
                if (item.id === videoStream.id) {
                    videoStreamPos = index;
                }
            });
            this.videoStreams.splice(videoStreamPos, 1);
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
