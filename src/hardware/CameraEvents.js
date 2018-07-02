/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Camera events listener to be notified about camera events on Android only
 * @enum {string}
 * @type {{CameraDisconnected: string, CameraError: string, CameraSwitchDone: string, CameraSwitchError: string}}
 */
const CameraEvents = {
    /**
     * Invoked when camera is disconnected
     */
    CameraDisconnected : 'CameraDisconnected',
    /**
     * Invoked when camera can not be opened or any camera exception happens
     */
    CameraError        : 'CameraError',
    /**
     * Invoked when camera switch was successful
     */
    CameraSwitchDone   : 'CameraSwitchDone',
    /**
     * Invoked when camera switch is failed, e.g. camera is stopped or only one camera is available
     */
    CameraSwitchError  : 'CameraSwitchError'
};

export default CameraEvents;