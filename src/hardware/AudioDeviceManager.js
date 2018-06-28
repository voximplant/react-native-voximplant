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

import AudioDeviceEvents from './AudioDeviceEvents';

const AudioDeviceModule = NativeModules.AudioDeviceModule;
const EventEmitter = Platform.select({
	ios: new NativeEventEmitter(AudioDeviceModule),
	android: DeviceEventEmitter,
});

export default class AudioDeviceManager {
    static _instance = null;

    /**
     *
     * @returns {AudioDeviceManager}
     */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new AudioDeviceManager();
        }
        return this._instance;
    }

    constructor() {
        if (AudioDeviceManager._instance) {
            throw new Error('Error - use AudioDeviceManager.getInstance()');
        }
        this.listeners = {};
        EventEmitter.addListener('VIAudioDeviceChanged', this._onDeviceChanged);
        EventEmitter.addListener('VIAudioDeviceListChanged', this._onDeviceListChanged);
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

    getActiveDevice() {
        return AudioDeviceModule.getActiveDevice();
    }

    getAudioDevices() {
        return AudioDeviceModule.getAudioDevices();
    }

    selectAudioDevice(audioDevice) {
        AudioDeviceModule.selectAudioDevice(audioDevice);
    }

    _onDeviceChanged = (event) => {
        console.log('AudioDeviceManager: _onDeviceChanged');
        this._emit(AudioDeviceEvents.DeviceChanged, event);
    };

    _onDeviceListChanged = (event) => {
        console.log('AudioDeviceManager: _onDeviceListChanged');
        this._emit(AudioDeviceEvents.DeviceListChanged, event);
    };
}