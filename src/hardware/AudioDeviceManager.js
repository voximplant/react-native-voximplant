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

/**
 * @class AudioDeviceManager
 * @classdesc Class may be used to manage audio devices, i.e. see current active device, select another active device and get the list of available devices.
 */
export default class AudioDeviceManager {
    /**
     * @private
     */
    static _instance = null;

    /**
     * Get AudioDeviceManager instance to control audio hardware settings
     * @returns {AudioDeviceManager}
     */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new AudioDeviceManager();
        }
        return this._instance;
    }

    /**
     * @ignore
     */
    constructor() {
        if (AudioDeviceManager._instance) {
            throw new Error('Error - use AudioDeviceManager.getInstance()');
        }
        this.listeners = {};
        EventEmitter.addListener('VIAudioDeviceChanged', this._onDeviceChanged);
        EventEmitter.addListener('VIAudioDeviceListChanged', this._onDeviceListChanged);
    }

    /**
     * Register a handler for the specified AudioDeviceManager event.
     * One event can have more than one handler.
     * Use the {@link AudioDeviceManager#off} method to delete a handler.
     * @param {AudioDeviceEvents} event
     * @param {function} handler
     */
    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified AudioDeviceManager event.
     * @param {AudioDeviceEvents} event
     * @param {function} handler
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
     * Returns active audio device during the call or audio device that will be used for a call if there is no calls at this moment.
     * @returns {Promise<AudioDevice>}
     */
    getActiveDevice() {
        return AudioDeviceModule.getActiveDevice();
    }

    /**
     * Returns the list of available audio devices.
     * @returns {Promise<AudioDevice[]>}
     */
    getAudioDevices() {
        return AudioDeviceModule.getAudioDevices();
    }

    /**
     * Changes selection of the current active audio device.
     * @param {AudioDevice} audioDevice
     */
    selectAudioDevice(audioDevice) {
        AudioDeviceModule.selectAudioDevice(audioDevice);
    }

    /**
     * @private
     */
    _onDeviceChanged = (event) => {
        console.log('AudioDeviceManager: _onDeviceChanged');
        this._emit(AudioDeviceEvents.DeviceChanged, event);
    };

    /**
     * @private
     */
    _onDeviceListChanged = (event) => {
        console.log('AudioDeviceManager: _onDeviceListChanged');
        this._emit(AudioDeviceEvents.DeviceListChanged, event);
    };
}