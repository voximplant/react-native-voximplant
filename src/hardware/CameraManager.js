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

import CameraEvents from './CameraEvents';

const CameraModule = NativeModules.VICameraModule;
const EventEmitter = Platform.select({
	android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant.Hardware
 * @class CameraManager
 * @classdesc Class that may be used to manage cameras on a device.
 */
export default class CameraManager {
    /**
     * @private
     */
    static _instance = null;

    /**
     * Get CameraManager instance to control camera hardware settings
     * @returns {Voximplant.Hardware.CameraManager}
     * @memberOf Voximplant.Hardware.CameraManager
     */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new CameraManager();
        }
        return this._instance;
    }

    /**
     * @ignore
     */
    constructor() {
        if (CameraManager._instance) {
            throw new Error('Error - use CameraManager.getInstance()');
        }
        this.listeners = {};
        if (Platform.OS === 'android') {
            EventEmitter.addListener('VICameraDisconnected', this._onCameraDisconnected);
            EventEmitter.addListener('VICameraError', this._onCameraError);
            EventEmitter.addListener('VICameraSwitchDone', this._onCameraSwitchDone);
            EventEmitter.addListener('VICameraSwitchError', this._onCameraSwitchError);
        }  
    }

    /**
     * Select camera
     * @param {Voximplant.Hardware.CameraType} cameraType - Preferred video camera
     * @memberOf Voximplant.Hardware.CameraManager
     */
    switchCamera(cameraType) {
        CameraModule.switchCamera(cameraType);
    }

    /**
     * Set a local camera resolution
     * @param {number} width - Camera resolution width
     * @param {number} height - Camera resolution height
     * @memberOf Voximplant.Hardware.CameraManager
     */
    setCameraResolution(width, height) {
        CameraModule.setCameraResolution(width, height);
    }

    /**
     * Register a handler for the specified camera event.
     * One event can have more than one handler.
     * Use the {@link CameraManager#off} method to delete a handler. ANDROID ONLY.
     * @param {Voximplant.Hardware.CameraEvents} event
     * @param {function} handler
     * @memberOf Voximplant.Hardware.CameraManager
     */
    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`CameraManager: on: handler is not a Function`);
            return;
        }
        if (Object.values(CameraEvents).indexOf(event) === -1) {
            console.warn(`CameraManager: on: CameraEvents does not contain ${event} event`);
            return;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified camera event. ANDROID ONLY.
     * @param {Voximplant.Hardware.CameraEvents} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberOf Voximplant.Hardware.CameraManager
     */
    off(event, handler) {
        if (!this.listeners[event]) {
            return;
        }
        if (Object.values(CameraEvents).indexOf(event) === -1) {
            console.warn(`CameraManager: off: CameraEvents does not contain ${event} event`);
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
                handler(...args);
            }
        }
    }

    /**
     * @private
     */
    _onCameraDisconnected = (event) => {
        this._emit(CameraEvents.CameraDisconnected, event);
    };

    /**
     * @private
     */
    _onCameraError = (event) => {
        this._emit(CameraEvents.CameraError, event);
    };

    /**
     * @private
     */
    _onCameraSwitchDone = (event) => {
        this._emit(CameraEvents.CameraSwitchDone, event);
    };

    /**
     * @private
     */
    _onCameraSwitchError = (event) => {
        this._emit(CameraEvents.CameraSwitchError, event);
    };

}