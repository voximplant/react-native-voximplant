/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import {
    Platform,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import MessagingShared from "./MessagingShared";
import MessengerEventTypes from "./MessengerEventTypes";

const MessagingModule = NativeModules.VIMessagingModule;

const listeners = {};

const EventEmitter = Platform.select({
    ios: new NativeEventEmitter(MessagingModule),
    android: DeviceEventEmitter,
});

/**
 * @memberOf Voximplant.Messaging
 * @class Messenger
 * @classdesc Messenger class used to control messaging functions.
 */
export default class Messenger {

    /**
     * @private
     */
    static _instance = null;

    /**
     * @ignore
     */
    constructor() {
        if (Messenger._instance) {
            throw new Error("Error - use Voximplant.getMessenger()");
        }
        EventEmitter.addListener('VIGetUser', this._onGetUser);
        EventEmitter.addListener('VISetStatus', this._onSetStatus);
    }

    /**
     *  @ignore
     */
    static getInstance() {
        if (Messenger._instance === null) {
            Messenger._instance = new Messenger();
        }
        return Messenger._instance;
    }

    /**
     *
     * @param eventType
     * @param event
     */
    on(eventType, event) {
        if (!listeners[eventType]) {
            listeners[eventType] = new Set();
        }
        listeners[eventType].add(event);
    }

    /**
     *
     * @param eventType
     * @param event
     */
    off(eventType, event) {
        if (listeners[eventType]) {
            listeners[eventType].delete(event);
        }
    }

    /**
     * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
     * @return string
     * @memberOf Voximplant.Messaging.Messenger
     */
    getMe() {
        return MessagingShared.getInstance().getCurrentUser();
    }

    /**
     *
     * @param userId
     */
    getUser(userId) {
        MessagingModule.getUser(userId);
    }

    /**
     *
     * @param users
     */
    getUsers(users) {
        MessagingModule.getUsers(users);
    }

    editUser(customData, privateCustomData) {
        //TODO
    }

    /**
     *
     * @param online
     */
    setStatus(online) {
        MessagingModule.setStatus(online);
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

    _onGetUser = (event) => {
        this._emit(MessengerEventTypes.GetUser, event);
    };

    _onSetStatus = (event) => {
        this._emit(MessengerEventTypes.SetStatus, event);
    }
}