/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Events that may be used to monitor and handle audio device change events
 * @memberof Voximplant.Hardware
 * @enum {string}
 * @type {{DeviceChanged: string, DeviceListChanged: string}}
 */
const AudioDeviceEvents = {
    /**
     * Event is triggered when active audio device or audio device that will be used for a further call is changed.
     */
    DeviceChanged     : 'DeviceChanged',
    /**
     * Event is triggered when a new audio device is connected or previously connected audio device is disconnected.
     */
    DeviceListChanged : 'DeviceListChanged',
};

export default AudioDeviceEvents;