/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import React, { Component } from 'react';
import {
    Platform,
    NativeModules
} from 'react-native';
import { ClientConfig, LogLevel } from './Structures';
import ClientEvents from './ClientEvents';
import ClientEventEmitter from './ClientEventEmitter';

const ClientModule = NativeModules.ClientModule;

const listeners = {};

export default class Client {
    static clientInstance = null;

    constructor(clientConfig) {
        if (!clientConfig) clientConfig = {};
        if (Platform.OS === 'android') {
            if (clientConfig.enableVideo === undefined) clientConfig.enableVideo = true;
            if (clientConfig.enableHWAcceleration === undefined) clientConfig.enableHWAcceleration = true;
            if (clientConfig.provideLocalFramesInByteBuffer === undefined) clientConfig.provideLocalFramesInByteBuffer = false;
            if (clientConfig.enableDebugLogging === undefined) clientConfig.enableDebugLogging = false;
            ClientModule.init(clientConfig.enableVideo,
                clientConfig.enableHWAcceleration,
                clientConfig.provideLocalFramesInByteBuffer,
                clientConfig.enableDebugLogging);
        }
        if (Platform.OS === 'ios') {
            if (clientConfig.logLevel === undefined) clientConfig.logLevel = LogLevel.INFO;
            ClientModule.init(clientConfig.logLevel);
        }
        ClientEventEmitter.addListener('VIConnectionEstablished', (event) => this._onConnectionEstablished(event));
        ClientEventEmitter.addListener('VIConnectionClosed', (event) => this._onConnectionClosed(event));
        ClientEventEmitter.addListener('VIConnectionFailed', (event) => this._onConnectionFailed(event));
        ClientEventEmitter.addListener('VIAuthResult', (event) => this._onAuthResult(event));
        ClientEventEmitter.addListener('VIAuthTokenResult', (event) => this._onAuthTokenResult(event));
    }

    static getInstnce(clientConfig) {
        if (this.clientInstance === null) {
            this.clientInstance = new Client();
        }
        return this.clientInstance;
    }

    on(event, handler) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(handler);

    }

    off(event, handler) {
        if (listeners[event]) {
            listeners[event] = listeners[event].filter(v => v !== handler);
        }
    }

    connect(options) {
        return new Promise((resolve, reject) => {
            if (!options) options = {};
            if (options.connectivityCheck === undefined) options.connectivityCheck = false;
            if (options.servers === undefined) options.servers = [];
            let connected = (event) => {
                resolve(event);
                ClientEventEmitter.removeListener('VIConnectionEstablished', connected);
            }
            let failed = (event) => {
                reject(event);
                ClientEventEmitter.removeListener('VIConnectionFailed', failed);
            }
            ClientEventEmitter.addListener('VIConnectionEstablished', connected);
            ClientEventEmitter.addListener('VIConnectionFailed', failed);
            ClientModule.connect(options.connectivityCheck, options.servers, (isValidState) => {
                if (!isValidState) {
                    ClientEventEmitter.removeListener('VIConnectionEstablished', connected);
                    ClientEventEmitter.removeListener('VIConnectionFailed', failed);
                    reject({'name': ClientEvents.ConnectionFailed, 'message': 'ALREADY_CONNECTED_TO_VOXIMPLANT'});
                }
            });
        });
    };

    disconnect() {
        return new Promise((resolve, reject) => {
            let disconnected = (event) => {
                resolve(event);
                ClientEventEmitter.removeListener('VIConnectionClosed', disconnected);
            }
            ClientEventEmitter.addListener('VIConnectionClosed', disconnected);
            ClientModule.disconnect();
        });
    }

    getClientState() {
        return ClientModule.getClientState();
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                ClientEventEmitter.removeListener('VIAuthResult', loginResult);
            }
            ClientEventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.login(username, password);
        });
    }

    loginWithOneTimeKey(username, hash) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                ClientEventEmitter.removeListener('VIAuthResult', loginResult);
            }
            ClientEventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.loginWithOneTimeKey(username, hash);
        });
    }

    loginWithToken(username, token) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                ClientEventEmitter.removeListener('VIAuthResult', loginResult);
            }
            ClientEventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.loginWithToken(username, token);
        });
    }

    requestOneTimeLoginKey(username) {
        return new Promise((resolve, reject) => {
            let requestResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                ClientEventEmitter.removeListener('VIAuthResult', requestResult);
            }
            ClientEventEmitter.addListener('VIAuthResult', requestResult);
            ClientModule.requestOneTimeLoginKey(username);
        });
    }

    tokenRefresh(username, refreshToken) {
        return new Promise((resolve, reject) => {
            let refreshResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                ClientEventEmitter.removeListener('VIAuthTokenResult', refreshResult);
            }
            ClientEventEmitter.addListener('VIAuthTokenResult', refreshResult);
            CLientModule.refreshToken(username, refreshToken);
        });
    }

    registerPushNotificationsToken(token) {
        ClientModule.registerPushNotificationsToken(token);
    }

    unregisterPushNotificationsToken(token) {
        ClientModule.unregisterPushNotificationsToken(token);
    }

    handlePushNotification(notification) {
        ClientModule.handlePushNotification(notification);
    }

    _emit(event, ...args) {
        const handlers = listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    _onConnectionEstablished(event) {
        this._emit(ClientEvents.ConnectionEstablished, event);
    }

    _onConnectionFailed(event) {
        this._emit(ClientEvents.ConnectionFailed, event);
    }

    _onConnectionClosed(event) {
        this._emit(ClientEvents.ConnectionClosed, event);
    }

    _onAuthResult(event) {
        this._emit(ClientEvents.AuthResult, event);
    }
    
    _onAuthTokenResult(event) {
        this._emit(ClientEvents.RefreshTokenResult, event);
    }
} 
