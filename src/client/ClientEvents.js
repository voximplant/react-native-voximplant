/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * The events that are triggered by Client instance. See {@link Voximplant#getInstance}.
 * @memberOf Voximplant
 * @enum {string}
 * @type {{ConnectionEstablished: string, ConnectionFailed: string, ConnectionClosed: string, AuthResult: string, RefreshTokenResult: string, IncomingCall: string}}
 */
const ClientEvents = {
    /**
     * The event is triggered after connection to the Voximplant Cloud was established successfully. See {@link Client#connect} method.
     * Handler function receives no arguments.
     */
    ConnectionEstablished : 'ConnectionEstablished',
    /**
     * The event is triggered if a connection to the Voximplant Cloud couldn't be established. See {@link Client#connect} method.
     * Handler function receives {@link EventHandlers.ConnectionFailed} object as an argument.
     */
    ConnectionFailed      : 'ConnectionFailed',
    /**
     * The event is triggered if a connection to the Voximplant Cloud was closed because of network problems. See {@link Client#connect} method.
     * Handler function receives no arguments.
     */
    ConnectionClosed      : 'ConnectionClosed',
    /**
     * Event is triggered after {@link Client#login}, {@link Client#loginWithOneTimeKey}, {@link Client#requestOneTimeLoginKey}
     * or {@link Client#loginWithToken} methods.
     * Handler function receives {@link EventHandlers.AuthResult} object as an argument.
     */
    AuthResult            : 'AuthResult',
    /**
     * The event is triggered after the {@link Client#tokenRefresh} method call.
     * Handler function receives {@link EventHandlers.AuthTokenResult} object as an argument.
     */
    RefreshTokenResult    : 'RefreshTokenResult',
    /**
     * The event is triggered when there is a new incoming call to current user.
     * Handler function receives {@link EventHandlers.IncomingCall} object as an argument.
     */
    IncomingCall          : 'IncomingCall'
};

export default ClientEvents;