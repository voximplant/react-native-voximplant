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

const MessagingModule = NativeModules.VIMessagingModule;

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
     * Get the full Voximplant user identifier, for example 'username@appname.accname', for the current user
     * @return string
     * @memberOf Voximplant.Messaging.Messenger
     */
    getMe() {
        return MessagingShared.getInstance().getCurrentUser();
    }


}