/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { NativeEventEmitter, NativeModules } from "react-native";

import QualityEvents from "./QualityEvents";


const CallModule = NativeModules.RNVICallModule;

const EventEmitter = new NativeEventEmitter(CallModule);

export default class QualitySubscriber {
    /**
     * @private
     */
    _callId;

    /**
     * @private
     */
    _listeners;

    constructor(callId) {
        this._listeners = {};
        this._callId = callId;
        this._addEventListeners();
    }

    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`QualitySubscriber: on: handler is not a Function`);
            return;
        }
        if (Object.values(QualityEvents).indexOf(event) === -1) {
            console.warn(`QualitySubscriber: on: QualityEvents does not contain ${event} event`);
            return;
        }
        if (!this._listeners[event]) {
            this._listeners[event] = new Set();
        }
        this._listeners[event].add(handler);
    }

    off(event, handler) {
        if (!this._listeners[event]) {
            return;
        }
        if (Object.values(QualityEvents).indexOf(event) === -1) {
            console.warn(`QualitySubscriber: off: QualityEvents does not contain ${event} event`);
            return;
        }
        if (handler && handler instanceof Function) {
            this._listeners[event].delete(handler);
        } else {
            this._listeners[event] = new Set();
        }
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = this._listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                console.log(`QualitySubscriber: emit event ${event}`);
                handler(...args);
            }
        } else {
            console.log(`QualitySubscriber: emit: no handlers for event: ${event}`);
        }
    }

    /**
     * @private
     */
    _VIQualityIssuePacketLossCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.PacketLoss, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueCodecMismatchCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.CodecMismatch, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueLocalVideoDegradationCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.LocalVideoDegradation, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueIceDisconnectedCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.IceDisconnected, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueHighMediaLatencyCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.HighMediaLatency, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueNoAudioSignalCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.NoAudioSignal, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueNoAudioReceiveCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.NoAudioReceive, event);
        }
    }

    /**
     * @private
     */
    _VIQualityIssueNoVideoReceiveCallback = (event) => {
        if (event.callId === this._callId) {
            this._emit(QualityEvents.NoVideoReceive, event);
        }
    }

    /**
     * @private
     */
    _events = [
        'VIQualityIssuePacketLoss',
        'VIQualityIssueCodecMismatch',
        'VIQualityIssueLocalVideoDegradation',
        'VIQualityIssueIceDisconnected',
        'VIQualityIssueHighMediaLatency',
        'VIQualityIssueNoAudioSignal',
        'VIQualityIssueNoAudioReceive',
        'VIQualityIssueNoVideoReceive'
    ];

    /**
     * @private
     */
    _addEventListeners() {
      this._events.forEach((item) => {
            this[`_${item}Subscriber`] = EventEmitter.addListener(item, this[`_${item}Callback`]);
      });
    }

    /**
     * @private
     */
    _removeEventListeners() {
        this._events.forEach((item) => {
            if(this[`_${item}Subscriber`]) {
                this[`_${item}Subscriber`].remove();
                delete this[`_${item}Subscriber`];
            }
        });
    }
}