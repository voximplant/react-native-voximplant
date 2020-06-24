/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import AudioFileEventTypes from "./AudioFileEventTypes";

const AudioFileModule = NativeModules.VIAudioFileModule;
const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(AudioFileModule),
    android: DeviceEventEmitter,
});

/**
 * @memberof Voximplant.Hardware
 * @class AudioFile
 * @classdesc Class may be used to play audio files.
 */
export default class AudioFile {
    /**
     * @member {string} url - HTTP URL of the stream to play
     * @memberOf Voximplant.Hardware.AudioFile
     */
    url;
    /**
     * @member {boolean} looped - Indicate if the audio file should be played repeatedly or once
     * @memberOf Voximplant.Hardware.AudioFile
     */
    looped;
    /**
     * @member {string} url - Local audio file name
     * @memberOf Voximplant.Hardware.AudioFile
     */
    name;

    /**
     * @ignore
     */
    constructor() {
        this.listeners = {};
        this.fileId = null;
        EventEmitter.addListener('VIAudioFileStarted', this._VIAudioFileStarted);
        EventEmitter.addListener('VIAudioFileStopped', this._VIAudioFileStopped);
    }

    /**
     * Initialize AudioFile instance to play local audio file.
     *
     * On android, the audio file must be located in resources "raw" folder.
     *
     * @param {string} name - Local audio file name
     * @param {string} type - Local audio file type/format, for example ".mp3"
     * @param {Voximplant.Hardware.AudioFileUsage} usage - Audio file usage mode. ANDROID ONLY.
     * @return {Promise}
     * @memberof Voximplant.Hardware.AudioFile
     */
    initWithLocalFile(name, type, usage) {
        return new Promise((resolve, reject) => {
            this.name = name;
            AudioFileModule.initWithFile({
                name: name,
                type: type,
                usage: usage,
            }, (fileId, error) => {
                if (error) {
                    reject(error);
                } else {
                    this.fileId = fileId;
                    resolve();
                }
            });
        })
    }

    /**
     * Initialize AudioFile to play a stream from a network.
     *
     * @param {string} url - HTTP URL of the stream to play
     * @param {Voximplant.Hardware.AudioFileUsage} usage usage - Audio file usage mode. ANDROID ONLY.
     * @return {Promise}
     * @memberof Voximplant.Hardware.AudioFile
     */
    loadFile(url, usage) {
        return new Promise((resolve, reject) => {
            this.url = url;
            AudioFileModule.loadFile({
                url: url,
                usage: usage,
            }, (fileId, error) => {
                if (error) {
                    reject(error);
                } else {
                    this.fileId = fileId;
                    resolve();
                }
            });
        });
    }

    /**
     * Start playing the audio file repeatedly or once.
     * @param {boolean} looped - Indicate if the audio file should be played repeatedly or once
     * @return {Promise<EventHandlers.AudioFileStarted>}
     * @memberof Voximplant.Hardware.AudioFile
     */
    play(looped) {
        this.looped = looped;
        return new Promise((resolve, reject) => {
            let started = (event) => {
                this.off(AudioFileEventTypes.Started, started);
                console.log(`AudioFile: received event in start`);
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
            };
            this.on(AudioFileEventTypes.Started, started);
            AudioFileModule.play(this.fileId, looped);
        });
    }

    /**
     * Stop playing of the audio file.
     *
     * @return {Promise<EventHandlers.AudioFileStopped>}
     * @memberof Voximplant.Hardware.AudioFile
     */
    stop() {
        return new Promise((resolve, reject) => {
            let stopped = (event) => {
                console.log(`AudioFile: received event in stop`);
                this.off(AudioFileEventTypes.Stopped, stopped);
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
            };
            this.on(AudioFileEventTypes.Stopped, stopped);
            AudioFileModule.stop(this.fileId);
        });
    }

    /**
     * Release all resources allocated to play the audio file.
     *
     * Must be called even if the audio file was not played.
     *
     * @memberof Voximplant.Hardware.AudioFile
     */
    releaseResources() {
        EventEmitter.removeListener('VIAudioFileStarted', this._VIAudioFileStarted);
        EventEmitter.removeListener('VIAudioFileStopped', this._VIAudioFileStopped);
        AudioFileModule.releaseResources(this.fileId);
    }

    /**
     * Register a handler for the specified AudioFile event.
     * One event can have more than one handler.
     * Use the {@link Voximplant.Hardware.AudioFile#off} method to delete a handler.
     * @param {Voximplant.Hardware.AudioFileEventTypes} event
     * @param {function} handler
     * @memberof Voximplant.Hardware.AudioFile
     */
    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`AudioFile: on: handler is not a Function`);
            return;
        }
        if (Object.values(AudioFileEventTypes).indexOf(event) === -1) {
            console.warn(`AudioFile: on: AudioFileEventTypes does not contain ${event} event`);
            return;
        }
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(handler);
    }

    /**
     * Remove a handler for the specified AudioFile event.
     * @param {Voximplant.Hardware.AudioFileEventTypes} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberof Voximplant.Hardware.AudioFile
     */
    off(event, handler) {
        if (!this.listeners[event]) {
            return;
        }
        if (Object.values(AudioFileEventTypes).indexOf(event) === -1) {
            console.warn(`AudioFile: off: AudioFileEventTypes does not contain ${event} event`);
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

    _VIAudioFileStarted = (event) => {
        console.log(`AudioFile: received started event in general handler: ${event.fileId}`);
        if (event.fileId === this.fileId) {
            delete event.fileId;
            event.audioFile = this;
            this._emit(AudioFileEventTypes.Started, event);
        }
    };

    _VIAudioFileStopped = (event) => {
        console.log(`AudioFile: received stopped event in general handler: ${event.fileId}`);
        if (event.fileId === this.fileId) {
            delete event.fileId;
            event.audioFile = this;
            this._emit(AudioFileEventTypes.Stopped, event);
        }
    };
}
