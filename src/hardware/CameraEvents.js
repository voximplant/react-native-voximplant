/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Camera events listener to be notified about camera events on Android only
 * @memberof Voximplant.Hardware
 * @enum {string}
 * @type {{CameraDisconnected: string, CameraError: string, CameraSwitchDone: string, CameraSwitchError: string}}
 */
const CameraEvents = {
    /**
     * Invoked when camera is disconnected. ANDROID ONLY.
     * Handler function receives {@link EventHandlers.CameraDisconnected} object as an argument.
     */
    CameraDisconnected : 'CameraDisconnected',
    /**
     * Invoked when camera can not be opened or any camera exception happens. ANDROID ONLY.
     * Handler function receives {@link EventHandlers.CameraError} object as an argument.
     */
    CameraError        : 'CameraError',
    /**
     * Invoked when camera switch was successful. ANDROID ONLY.
     * Handler function receives {@link EventHandlers.CameraSwitchDone} object as an argument.
     */
    CameraSwitchDone   : 'CameraSwitchDone',
    /**
     * Invoked when camera switch is failed, e.g. camera is stopped or only one camera is available. ANDROID ONLY.
     * Handler function receives {@link EventHandlers.CameraSwitchError} object as an argument.
     */
    CameraSwitchError  : 'CameraSwitchError'
};

export default CameraEvents;