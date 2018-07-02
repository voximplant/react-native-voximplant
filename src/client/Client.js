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
import { LogLevel } from './../Enums';
import ClientEvents from './ClientEvents';
import Call from './../call/Call';

const ClientModule = NativeModules.ClientModule;

const listeners = {};

const EventEmitter = Platform.select({
	ios: new NativeEventEmitter(ClientModule),
	android: DeviceEventEmitter,
});

/**
 * @class Client
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton), so use the {@link Voximplant#getInstance} method to get the class instance.
 */
export default class Client {
    /**
     * @private
     */
    static _clientInstance = null;

    /**
     * @ignore
     */
    constructor(clientConfig) {
        if (Client._clientInstance) {
            throw new Error('Error - use Voximplant.getInstance()');
        }
        if (!clientConfig) clientConfig = {};
        if (Platform.OS === 'android') {
            if (clientConfig.enableVideo === undefined) clientConfig.enableVideo = true;
            if (clientConfig.enableHWAcceleration === undefined) clientConfig.enableHWAcceleration = true;
            if (clientConfig.provideLocalFramesInByteBuffer === undefined) clientConfig.provideLocalFramesInByteBuffer = false;
            if (clientConfig.enableDebugLogging === undefined) clientConfig.enableDebugLogging = false;
            if (clientConfig.enableCameraMirroring === undefined) clientConfig.enableCameraMirroring = true;
            if (clientConfig.enableLogcatLogging === undefined) clientConfig.enableLogcatLogging = true;
            if (clientConfig.H264first === undefined) clientConfig.H264first = false;
            ClientModule.init(clientConfig.enableVideo,
                clientConfig.enableHWAcceleration,
                clientConfig.provideLocalFramesInByteBuffer,
                clientConfig.enableDebugLogging,
                clientConfig.enableCameraMirroring,
                clientConfig.enableLogcatLogging,
                clientConfig.H264first);
        }
        if (Platform.OS === 'ios') {
            if (clientConfig.logLevel === undefined) clientConfig.logLevel = LogLevel.INFO;
            if (clientConfig.saveLogsToFile === undefined) clientConfig.saveLogsToFile = false;
            ClientModule.initWithOptions(clientConfig.logLevel, clientConfig.saveLogsToFile);
        }
        EventEmitter.addListener('VIConnectionEstablished', this._onConnectionEstablished);
        EventEmitter.addListener('VIConnectionClosed', this._onConnectionClosed);
        EventEmitter.addListener('VIConnectionFailed', this._onConnectionFailed);
        EventEmitter.addListener('VIAuthResult', this._onAuthResult);
        EventEmitter.addListener('VIAuthTokenResult', this._onAuthTokenResult);
        EventEmitter.addListener('VIIncomingCall', this._onIncomingCall);
    }

    /**
     * @ignore
     */
    static getInstance(clientConfig) {
        if (this._clientInstance === null) {
            this._clientInstance = new Client(clientConfig);
        }
        return this._clientInstance;
    }

    /**
     * Register handler for specified client event.
     * Use {@link Client#off} method to delete a handler.
     * @param {ClientEvents} event
     * @param {function} handler Handler function
     */
    on(event, handler) {
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(handler);
    }

    /**
     * Remove handler for specified event
     * @param {ClientEvents} event
     * @param {function} handler Handler function
     */
    off(event, handler) {
        if (listeners[event]) {
            listeners[event].delete(handler);
        }
    }

    /**
     * Connect to the Voximplant Cloud
     * @param {ConnectOptions} options
     * @returns {Promise<any>}
     */
    connect(options) {
        return new Promise((resolve, reject) => {
            if (!options) options = {};
            if (options.connectivityCheck === undefined) options.connectivityCheck = false;
            if (options.servers === undefined) options.servers = [];
            let connected = (event) => {
                resolve(event);
                EventEmitter.removeListener('VIConnectionEstablished', connected);
            };
            let failed = (event) => {
                reject(event);
                EventEmitter.removeListener('VIConnectionFailed', failed);
            };
            EventEmitter.addListener('VIConnectionEstablished', connected);
            EventEmitter.addListener('VIConnectionFailed', failed);
            ClientModule.connect(options.connectivityCheck, options.servers, (isValidState) => {
                if (!isValidState) {
                    EventEmitter.removeListener('VIConnectionEstablished', connected);
                    EventEmitter.removeListener('VIConnectionFailed', failed);
                    reject({'name': ClientEvents.ConnectionFailed, 'message': 'ALREADY_CONNECTED_TO_VOXIMPLANT'});
                }
            });
        });
    };

    /**
     * Disconnect from the Voximplant Cloud
     * @returns {Promise<any>}
     * @todo promise
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            let disconnected = (event) => {
                resolve(event);
                EventEmitter.removeListener('VIConnectionClosed', disconnected);
            };
            EventEmitter.addListener('VIConnectionClosed', disconnected);
            ClientModule.disconnect();
        });
    }

    /**
     * Get current client state
     * @returns {Promise<ClientState>}
     */
    getClientState() {
        return ClientModule.getClientState();
    }

    /**
     * Login to specified Voximplant application with password.
     * @param {string} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} password User password
     * @returns {Promise<any>}
     */
    login(username, password) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                EventEmitter.removeListener('VIAuthResult', loginResult);
            };
            EventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.login(username, password);
        });
    }

    /**
     * Login to specified Voximplant application using 'onetimekey' auth method. Hash should be calculated with the key received in AuthResult event.
     * Please, read {@link http://voximplant.com/docs/quickstart/24/automated-login/ howto page}
     * @param {string} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} hash Hash that was generated using following formula: MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)).
     * Please note that here user is just a user name, without app name, account name or anything else after "@".
     * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
     * @returns {Promise<any>}
     */
    loginWithOneTimeKey(username, hash) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                EventEmitter.removeListener('VIAuthResult', loginResult);
            };
            EventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.loginWithOneTimeKey(username, hash);
        });
    }

    /**
     * Login to specified Voximplant application using accessToken
     * @param {string} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} token Access token that was obtained in AuthResult event
     * @returns {Promise<any>}
     */
    loginWithToken(username, token) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                EventEmitter.removeListener('VIAuthResult', loginResult);
            };
            EventEmitter.addListener('VIAuthResult', loginResult);
            ClientModule.loginWithToken(username, token);
        });
    }

    /**
     * Request a key for 'onetimekey' auth method. Server will send the key in AuthResult event with code 302
     * @param {string} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @returns {Promise<any>}
     */
    requestOneTimeLoginKey(username) {
        return new Promise((resolve, reject) => {
            let requestResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                EventEmitter.removeListener('VIAuthResult', requestResult);
            };
            EventEmitter.addListener('VIAuthResult', requestResult);
            ClientModule.requestOneTimeLoginKey(username);
        });
    }

    /**
     * Refresh expired access token
     * @param {string} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} refreshToken Refresh token that was obtained in AuthResult event
     * @returns {Promise<any>}
     */
    tokenRefresh(username, refreshToken) {
        return new Promise((resolve, reject) => {
            let refreshResult = (event) => {
                if (event.result) {
                    resolve(event);
                } else {
                    reject(event);
                }
                EventEmitter.removeListener('VIAuthTokenResult', refreshResult);
            };
            EventEmitter.addListener('VIAuthTokenResult', refreshResult);
            CLientModule.refreshToken(username, refreshToken);
        });
    }

    /**
     * Register for push notifications. Application will receive push notifications from the Voximplant Server after first log in
     * @param {string} token Push registration token
     */
    registerPushNotificationsToken(token) {
        ClientModule.registerPushNotificationsToken(token);
    }

    /**
     * Unregister from push notifications. Application will no longer receive push notifications from the Voximplant server
     * @param {string} token Push registration token
     */
    unregisterPushNotificationsToken(token) {
        ClientModule.unregisterPushNotificationsToken(token);
    }

    /**
     * Handle incoming push notification
     * @param {object} notification Incoming push notification
     */
    handlePushNotification(notification) {
        ClientModule.handlePushNotification(notification);
    }

    /**
     * Create outgoing call
     * @param {string} number The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
     * @param {CallSettings} callSettings
     * @returns {Promise<Call>}
     */
    call(number, callSettings) {
        if (!callSettings) {
            callSettings = {};
        }
        if (callSettings.H264First === undefined) {
            callSettings.H264First = false;
        }
        if (callSettings.video === undefined) {
            callSettings.video = {};
            callSettings.video.sendVideo = false;
            callSettings.video.receiveVideo = true;
        }
        if (callSettings.customData === undefined) {
            callSettings.customData = null;
        }
        if (callSettings.extraHeaders === undefined) {
            callSettings.extraHeaders = null;
        }
        return new Promise((resolve, reject) => {
            if (Platform.OS === 'android') {
                ClientModule.createAndStartCall(number, callSettings.video, callSettings.customData, callSettings.extraHeaders, (callId) => {
                    if (callId) {
                        let call = new Call(callId);
                        resolve(call);
                    } else {
                        reject();
                    }
                });
            }
            if (Platform.OS === 'ios') {
                ClientModule.createAndStartCall(number, callSettings.video, callSettings.H264First, callSettings.customData, callSettings.extraHeaders, (callId) => {
                    if (callId) {
                        let call = new Call(callId);
                        resolve(call);
                    } else {
                        reject();
                    }
                });
            }
        });
    }

    /**
     * @private
     */
    _emit(event, ...args) {
        const handlers = listeners[event];
        if (handlers) {
            for (const handler of handlers) {
                handler(...args);
            }
        }
    }

    /**
     * @private
     */
    _onConnectionEstablished = (event) => {
        this._emit(ClientEvents.ConnectionEstablished, event);
    };

    /**
     * @private
     */
    _onConnectionFailed = (event) => {
        this._emit(ClientEvents.ConnectionFailed, event);
    };

    /**
     * @private
     */
    _onConnectionClosed = (event) => {
        this._emit(ClientEvents.ConnectionClosed, event);
    };

    /**
     * @private
     */
    _onAuthResult = (event) => {
        this._emit(ClientEvents.AuthResult, event);
    };

    /**
     * @private
     */
    _onAuthTokenResult = (event) => {
        this._emit(ClientEvents.RefreshTokenResult, event);
    };

    /**
     * @private
     */
    _onIncomingCall = (event) => {
        event.call = new Call(event.callId);
        delete event.callId;
        this._emit(ClientEvents.IncomingCall, event);
    };
} 
