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
import {LogLevel, RequestAudioFocusMode, VideoCodec} from './../Enums';
import ClientEvents from './ClientEvents';
import Call from './../call/Call';
import Endpoint from './../call/Endpoint';
import CallManager from "../call/CallManager";
import MessagingShared from "../messaging/MessagingShared";

const ClientModule = NativeModules.VIClientModule;

const listeners = {};

const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(ClientModule),
    android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant
 * @class Client
 * @classdesc The Client class is used to control platform functions. Can't be instantiated directly (singleton), so use the {@link Voximplant#getInstance} method to get the class instance.
 */
export default class Client {
    /**
     * @private
     */
    static _clientInstance = null;
    _loggerCallback = null;

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
            if (clientConfig.enableDebugLogging === undefined) clientConfig.enableDebugLogging = false;
            if (clientConfig.enableCameraMirroring === undefined) clientConfig.enableCameraMirroring = true;
            if (clientConfig.enableLogcatLogging === undefined) clientConfig.enableLogcatLogging = true;
            if (clientConfig.preferredVideoCodec === undefined) clientConfig.preferredVideoCodec = VideoCodec.VP8;
            if (clientConfig.bundleId === undefined) clientConfig.bundleId = null;
            if (clientConfig.requestAudioFocusMode === undefined) clientConfig.requestAudioFocusMode = RequestAudioFocusMode.REQUEST_ON_CALL_START;
            if (clientConfig.logLevel !== undefined) console.log('logLevel is iOS only option');
            if (clientConfig.h264RecoveryMode !== undefined) console.log('h264RecoveryMode is iOS only option');
            ClientModule.init(clientConfig.enableVideo,
                clientConfig.enableDebugLogging,
                clientConfig.enableCameraMirroring,
                clientConfig.enableLogcatLogging,
                clientConfig.preferredVideoCodec,
                clientConfig.bundleId,
                clientConfig.requestAudioFocusMode);
        }
        if (Platform.OS === 'ios') {
            if (clientConfig.logLevel === undefined) clientConfig.logLevel = LogLevel.INFO;
            if (clientConfig.bundleId === undefined) clientConfig.bundleId = null;
            if (clientConfig.h264RecoveryMode === undefined) clientConfig.h264RecoveryMode = false;
            if (clientConfig.enableVideo !== undefined) console.log('enableVideo is Android only option');
            if (clientConfig.enableDebugLogging !== undefined) console.log('enableDebugLogging is Android only option');
            if (clientConfig.enableCameraMirroring !== undefined) console.log('enableCameraMirroring is Android only option');
            if (clientConfig.enableLogcatLogging !== undefined) console.log('enableLogcatLogging is Android only option');
            if (clientConfig.preferredVideoCodec !== undefined) console.log('preferredVideoCodec is Android only option');
            if (clientConfig.requestAudioFocusMode !== undefined) console.log('requestAudioFocusMode is Android only option');
            ClientModule.initWithOptions(clientConfig.logLevel, clientConfig.bundleId, clientConfig.h264RecoveryMode);
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
     * Set outer logging callback. The method allows integrating logging pipeline of the Voximplant React Native SDK into
     * your own logger i.e. the method call sends all events to your function.
     * @param {function} callback - Callback function with two arguments: {@link Voximplant.LogLevel} and message
     * @memberOf Voximplant.Client
     */
    setLoggerCallback(callback) {
        if (!callback || !(callback instanceof Function)) {
            console.warn('Client: setLoggerCallback: callback is not a Function');
            EventEmitter.removeListener('VILogMessage', this._onLogMessage);
            return;
        }
        EventEmitter.addListener('VILogMessage', this._onLogMessage);
        this._loggerCallback = callback;
    }

    /**
     * Register handler for specified client event.
     * Use {@link Voximplant.Client#off} method to delete a handler.
     * @param {Voximplant.ClientEvents} event
     * @param {function} handler - Handler function
     * @memberOf Voximplant.Client
     */
    on(event, handler) {
        if (!handler || !(handler instanceof Function)) {
            console.warn(`Client: on: handler is not a Function`);
            return;
        }
        if (Object.values(ClientEvents).indexOf(event) === -1) {
            console.warn(`Client: on: ClientEvents does not contain ${event} event`);
            return;
        }
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(handler);
    }

    /**
     * Remove handler for specified event
     * @param {Voximplant.ClientEvents} event
     * @param {function} handler - Handler function. If not specified, all handlers for the event will be removed.
     * @memberOf Voximplant.Client
     */
    off(event, handler) {
        if (!listeners[event]) {
            return;
        }
        if (Object.values(ClientEvents).indexOf(event) === -1) {
            console.warn(`Client: off: ClientEvents does not contain ${event} event`);
            return;
        }
        if (handler && handler instanceof Function) {
            listeners[event].delete(handler);
        } else {
            listeners[event] = new Set();
        }
    }

    /**
     * Connect to the Voximplant Cloud
     * @param {Voximplant.ConnectOptions} [options] - Connection options
     * @returns {Promise<EventHandlers.ConnectionEstablished|EventHandlers.ConnectionFailed>}
     * @memberOf Voximplant.Client
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
     * @returns {Promise<EventHandlers.ConnectionClosed>}
     * @memberOf Voximplant.Client
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
     * @returns {Promise<Voximplant.ClientState>}
     * @memberOf Voximplant.Client
     */
    getClientState() {
        return ClientModule.getClientState();
    }

    /**
     * Login to specified Voximplant application with password.
     * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} password - User password
     * @returns {Promise<EventHandlers.AuthResult>}
     * @memberOf Voximplant.Client
     */
    login(username, password) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    MessagingShared.getInstance().setCurrentUser(username);
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
     * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} hash - Hash that was generated using following formula: MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)).
     * Please note that here user is just a user name, without app name, account name or anything else after "@".
     * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
     * @returns {Promise<EventHandlers.AuthResult>}
     * @memberOf Voximplant.Client
     */
    loginWithOneTimeKey(username, hash) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    MessagingShared.getInstance().setCurrentUser(username);
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
     * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} token - Access token that was obtained in AuthResult event
     * @returns {Promise<EventHandlers.AuthResult>}
     * @memberOf Voximplant.Client
     */
    loginWithToken(username, token) {
        return new Promise((resolve, reject) => {
            let loginResult = (event) => {
                if (event.result) {
                    MessagingShared.getInstance().setCurrentUser(username);
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
     * @param {string} username Fully - qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @returns {Promise<EventHandlers.AuthResult>}
     * @memberOf Voximplant.Client
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
     * @param {string} username - Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param {string} refreshToken - Refresh token that was obtained in AuthResult event
     * @returns {Promise<EventHandlers.AuthTokenResult>}
     * @memberOf Voximplant.Client
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
            ClientModule.refreshToken(username, refreshToken);
        });
    }

    /**
     * Register for VoIP push notifications. Only PushKit VoIP tokens are acceptable.
     *
     * Application will receive push notifications from the Voximplant Server after the first login.
     * @param {string} token - Push registration token
     * @memberOf Voximplant.Client
     */
    registerPushNotificationsToken(token) {
        ClientModule.registerPushNotificationsToken(token);
    }

    /**
     * Register Apple Push Notifications token for IM push notifications.
     *
     * See [React Native PushNotificationIOS](https://facebook.github.io/react-native/docs/pushnotificationios#addeventlistener)
     * for more details.
     *
     * IM push notification token for Android is the same as VoIP push notification token and should be registered once via
     * {@link Voximplant.Client#registerPushNotificationsToken}
     * IOS ONLY.
     *
     * @param {string} token - The APNS token for IM push notifications.
     * @memberOf Voximplant.Client
     */
    registerIMPushNotificationsTokenIOS(token) {
        if (Platform.OS === 'ios') {
            ClientModule.registerIMPushNotificationsTokenIOS(token);
        } else {
            console.warn('Client.registerIMPushNotificationTokenIOS is available only on ios. Please check the docs');
        }
    }

    /**
     * Unregister from push notifications. Application will no longer receive push notifications from the Voximplant server
     * @param {string} token - Push registration token
     * @memberOf Voximplant.Client
     */
    unregisterPushNotificationsToken(token) {
        ClientModule.unregisterPushNotificationsToken(token);
    }

    /**
     * Handle incoming push notification
     * @param {object} notification - Incoming push notification
     * @memberOf Voximplant.Client
     */
    handlePushNotification(notification) {
        ClientModule.handlePushNotification(notification);
    }

    /**
     * Create outgoing call.
     *
     * Important: There is a difference between resolving the Voximplant.Client.call promise and handling Voximplant.CallEvents.
     * If the promise is resolved, the SDK sends a call to the cloud. However, it doesn't mean that a call is connected;
     * to catch this call state, subscribe to the Voximplant.CallEvents.Connected event.
     * If the promise is rejected, that indicates the issues in the application's code (e.g., a try to make a call without login to the Voximplant cloud);
     * in case of the CallFailed event is triggered, that means a telecom-related issue (e.g., another participant rejects a call).
     *
     * @param {string} number - The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
     * @param {Voximplant.CallSettings} [callSettings] - Optional call settings
     * @returns {Promise<Voximplant.Call>}
     * @memberOf Voximplant.Client
     */
    call(number, callSettings) {
        if (!callSettings) {
            callSettings = {};
        }
        if (callSettings.preferredVideoCodec === undefined) {
            callSettings.preferredVideoCodec = VideoCodec.AUTO;
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
        if (callSettings.setupCallKit === undefined || callSettings.setupCallKit === null) {
            callSettings.setupCallKit = false;
        }
        return new Promise((resolve, reject) => {
            if (Platform.OS === 'android') {
                ClientModule.createAndStartCall(number, callSettings.video, callSettings.preferredVideoCodec, callSettings.customData,
                    callSettings.extraHeaders, (callId, errorDescription) => {
                        if (callId) {
                            let call = new Call(callId);
                            resolve(call);
                        } else {
                            reject(errorDescription);
                        }
                    });
            }
            if (Platform.OS === 'ios') {
                ClientModule.createAndStartCall(number, callSettings.video, callSettings.preferredVideoCodec, callSettings.customData,
                    callSettings.extraHeaders, callSettings.setupCallKit, (callId, errorDescription) => {
                        if (callId) {
                            let call = new Call(callId);
                            resolve(call);
                        } else {
                            reject(errorDescription);
                        }
                    });
            }
        });
    }

    /**
     * Create call to a dedicated conference without proxy session. For details see [the video conferencing guide](https://voximplant.com/blog/video-conference-through-voximplant-media-servers).
     *
     * Important: There is a difference between resolving the Voximplant.Client.callConference promise and handling Voximplant.CallEvents.
     * If the promise is resolved, the SDK sends a call to the cloud. However, it doesn't mean that a call is connected;
     * to catch this call state, subscribe to the Voximplant.CallEvents.Connected event.
     * If the promise is rejected, that indicates the issues in the application's code (e.g., a try to make a call without login to the Voximplant cloud);
     * in case of the CallFailed event is triggered, that means a telecom-related issue (e.g., another participant rejects a call).
     *
     * @param {string} number - The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
     * @param {Voximplant.CallSettings} [callSettings] - Optional call settings
     * @returns {Promise<Voximplant.Call>}
     * @memberOf Voximplant.Client
     */
    callConference(number, callSettings) {
        if (!callSettings) {
            callSettings = {};
        }
        if (callSettings.preferredVideoCodec === undefined) {
            callSettings.preferredVideoCodec = VideoCodec.AUTO;
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
        if (callSettings.setupCallKit === undefined) {
            callSettings.setupCallKit = false;
        }
        return new Promise((resolve, reject) => {
            if (Platform.OS === 'android') {
                ClientModule.createAndStartConference(number, callSettings.video, callSettings.preferredVideoCodec, callSettings.customData,
                    callSettings.extraHeaders, (callId, errorDescription) => {
                        if (callId) {
                            let call = new Call(callId);
                            resolve(call);
                        } else {
                            reject(errorDescription);
                        }
                    });
            }
            if (Platform.OS === 'ios') {
                ClientModule.createAndStartConference(number, callSettings.video, callSettings.preferredVideoCodec, callSettings.customData,
                    callSettings.extraHeaders, callSettings.setupCallKit, (callId, errorDescription) => {
                        if (callId) {
                            let call = new Call(callId);
                            resolve(call);
                        } else {
                            reject(errorDescription);
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
                console.log(`Client: emit event ${event}`);
                handler(...args);
            }
        } else {
            console.log(`Client: emit: no handlers for event: ${event}`);
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
        MessagingShared.getInstance().setCurrentUser(null);
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
        let endpoint = new Endpoint(event.endpointId, event.displayName, event.sipUri, event.endpointName);
        CallManager.getInstance().addEndpoint(event.callId, endpoint);
        event.call.callKitUUID = event.callKitUUID;
        delete event.callKitUUID;
        delete event.endpointId;
        delete event.sipUri;
        delete event.displayName;
        delete event.endpointName;
        delete event.callId;
        this._emit(ClientEvents.IncomingCall, event);
    };

    /**
     * @private
     */
    _onLogMessage = (event) => {
        if (this._loggerCallback) {
            this._loggerCallback(event.level, event.message);
        }
    }
}
