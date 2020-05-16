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

import AudioDeviceEvents from './AudioDeviceEvents';

const AudioDeviceModule = NativeModules.VIAudioDeviceModule;
const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(AudioDeviceModule),
    android: DeviceEventEmitter,
});

/**
 * @memberof Voximplant.Hardware
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
     * @returns {Voximplant.Hardware.AudioDeviceManager}
     * @memberof Voximplant.Hardware.AudioDeviceManager
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
     * Use the {@link Voximplant.Hardware.AudioDeviceManager#off} method to delete a handler.
     * @param {Voximplant.Hardware.AudioDeviceEvents} event
     * @param {function} handler
     * @memberof Voximplant.Hardware.AudioDeviceManager
     */
    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`AudioDeviceManager: on: handler is not a Function`);
            return;
        }
        if (Object.values(AudioDeviceEvents).indexOf(event) === -1) {
            console.warn(`AudioDeviceManager: on: AudioDeviceEvents does not contain ${event} event`);
            return;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified AudioDeviceManager event.
     * @param {Voximplant.Hardware.AudioDeviceEvents} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberof Voximplant.Hardware.AudioDeviceManager
     */
    off(event, handler) {
        if (!this.listeners[event]) {
            return;
        }
        if (Object.values(AudioDeviceEvents).indexOf(event) === -1) {
            console.warn(`AudioDeviceManager: off: AudioDeviceEvents does not contain ${event} event`);
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
                console.log(`AudioDeviceManager: emit event ${event}`);
                handler(...args);
            }
        } else {
            console.log(`AudioDeviceManager: emit: no handlers for event: ${event}`);
        }
    }

    /**
     * Returns active audio device during the call or audio device that will be used for a call if there is no calls at this moment.
     * @returns {Promise<Voximplant.Hardware.AudioDevice>}
     * @memberof Voximplant.Hardware.AudioDeviceManager
     */
    getActiveDevice() {
        return AudioDeviceModule.getActiveDevice();
    }

    /**
     * Returns the list of available audio devices.
     * @returns {Promise<Voximplant.Hardware.AudioDevice[]>}
     * @memberof Voximplant.Hardware.AudioDeviceManager
     */
    getAudioDevices() {
        return AudioDeviceModule.getAudioDevices();
    }

    /**
     * Changes selection of the current active audio device. Please see {@link https://voximplant.com/docs/references/androidsdk/iaudiodevicemanager Android}
     * and {@link https://voximplant.com/docs/references/iossdk/viaudiomanager#selectaudiodevice iOS} documentation for platform specific.
     * @param {Voximplant.Hardware.AudioDevice} audioDevice - Preferred audio device to use.
     * @memberof Voximplant.Hardware.AudioDeviceManager
     */
    selectAudioDevice(audioDevice) {
        AudioDeviceModule.selectAudioDevice(audioDevice);
    }

    /**
     * IOS ONLY. Required for the correct CallKit integration only. Otherwise don't use this method.
     *
     * Initialize AVAudioSession if the application uses CallKit.
     *
     * Should be called when:
     * 1. the provider performs [the specified start call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648260-provider?language=objc)
     * 2. the provider performs [the specified answer call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648270-provider?language=objc)
     *
     * @memberOf Voximplant.Hardware.AudioDeviceManager
     */
    callKitConfigureAudioSession() {
        if (Platform.OS === 'ios') {
            AudioDeviceModule.callKitConfigureAudioSession();
        }
        if (Platform.OS === 'android') {
            console.log('AudioDeviceManager.callKitConfigureAudioSession is available only on iOS');
        }
    }

    /**
     * IOS ONLY. Required for the correct CallKit integration only. Otherwise don't use this method.
     *
     * Restores default AVAudioSession initialization routines, MUST be called if CallKit becomes disabled.
     *
     * @memberOf Voximplant.Hardware.AudioDeviceManager
     */
    callKitReleaseAudioSession() {
        if (Platform.OS === 'ios') {
            AudioDeviceModule.callKitReleaseAudioSession();
        }
        if (Platform.OS === 'android') {
            console.log('AudioDeviceManager.callKitReleaseAudioSession is available only on iOS');
        }
    }

    /**
     * IOS ONLY. Required for the correct CallKit integration only. Otherwise don't use this method.
     *
     * Starts AVAudioSession.
     *
     * Should be called when:
     * 1. the provider’s audio session is [activated](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1833281-provider?language=objc)
     * 2. the provider performs [the specified set held call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc)
     *
     * @memberOf Voximplant.Hardware.AudioDeviceManager
     */
    callKitStartAudio() {
        if (Platform.OS === 'ios') {
            AudioDeviceModule.callKitStartAudio();
        }
        if (Platform.OS === 'android') {
            console.log('AudioDeviceManager.callKitStartAudio is available only on iOS');
        }
    }

    /**
     * IOS ONLY. Required for the correct CallKit integration only. Otherwise don't use this method.
     *
     * Stops AVAudioSession.
     *
     * Should be called when:
     * 1. the provider performs [the specified end call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648264-provider?language=objc)
     * 2. the provider performs [the specified set held call action](https://developer.apple.com/documentation/callkit/cxproviderdelegate/1648256-provider?language=objc)
     *
     * @memberOf Voximplant.Hardware.AudioDeviceManager
     */
    callKitStopAudio() {
        if (Platform.OS === 'ios') {
            AudioDeviceModule.callKitStopAudio();
        }
        if (Platform.OS === 'android') {
            console.log('AudioDeviceManager.callKitStopAudio is available only on iOS');
        }
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
