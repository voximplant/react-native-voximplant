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

import CameraEvents from './CameraEvents';

const CameraModule = NativeModules.CameraModule;
const EventEmitter = Platform.select({
	android: DeviceEventEmitter,
});

export default class CameraManager {
    static _instance = null;

    static getInstance() {
        if (this._instance === null) {
            this._instance = new CameraManager();
        }
        return this._instance;
    }

    constructor() {
        this.listeners = {};
        if (Platform.OS === 'android') {
            this._VICameraDisconnectedCallback = (event) => this._onCameraDisconnected(event);
            this._VICameraErrorCallback = (event) => this._onCameraError(event);
            this._VICameraSwitchDoneCallback = (event) => this._onCameraSwitchDone(event);
            this._VICameraSwitchErrorCallback = (event) => this._onCameraSwitchError(event);
            EventEmitter.addListener('VICameraDisconnected', this._VICameraDisconnectedCallback);
            EventEmitter.addListener('VICameraError', this._VICameraErrorCallback);
            EventEmitter.addListener('VICameraSwitchDone', this._VICameraSwitchDoneCallback);
            EventEmitter.addListener('VICameraSwitchError', this._VICameraSwitchErrorCallback);
        }  
    }

    switchCamera(cameraType) {
        CameraModule.switchCamera(cameraType);
    }

    setCameraResolution(width, height) {
        CameraModule.setCameraResolution(width, height);
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

    _onCameraDisconnected(event) {
        this._emit(CameraEvents.CameraDisconnected, event);
    }

    _onCameraError(event) {
        this._emit(CameraEvents.CameraError, event);
    }

    _onCameraSwitchDone(event) {
        this._emit(CameraEvents.CameraSwitchDone, event);
    }

    _onCameraSwitchError(event) {
        this._emit(CameraEvents.CameraSwitchError, event);
    }

}