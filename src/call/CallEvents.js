/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * The events that are triggered by {@link Call} instance.
 * Use {@link Call#on} to subscribe on any of these events.
 *
 * @memberOf Voximplant
 * @enum {string}
 * @type {{Connected: string, Disconnected: string, EndpointAdded: string, Failed: string, ICECompleted: string, ICETimeout: string, InfoReceived: string, LocalVideoStreamAdded: string, LocalVideoStreamRemoved: string, MessageReceived: string, ProgressToneStart: string, ProgressToneStop: string}}
 */
const CallEvents = {
    /**
     * Event is triggered when a realible connection is established for the call.
     * Depending on network conditions there can be a 2-3 seconds delay between first audio data and this event.
     */
    Connected               : 'Connected',
    /**
     * Event is triggered when a call was disconnected
     */
    Disconnected            : 'Disconnected',
    /**
     * Event is triggered when a new Endpoint is created. {@link Endpoint} represents an another participant in your call or conference.
     */
    EndpointAdded           : 'EndpointAdded',
    /**
     * Event is triggered due to a call failure
     */
    Failed                  : 'Failed',
    /**
     * Event is triggered when ICE connection is complete
     */
    ICECompleted            : 'ICECompleted',
    /**
     * Event is triggered when connection was not established due to a network connection problem between 2 peers
     */
    ICETimeout              : 'ICETimeout',
    /**
     * Event is triggered when INFO message is received
     */
    InfoReceived            : 'InfoReceived',
    /**
     * Event is triggered when local video is added to the call
     */
    LocalVideoStreamAdded   : 'LocalVideoStreamAdded',
    /**
     * Event is triggered when local video is removed from the call
     */
    LocalVideoStreamRemoved : 'LocalVideoStreamRemoved',
    /**
     * Event is triggered when a text message is received
     */
    MessageReceived         : 'MessageReceived',
    /**
     * Event is triggered when a progress tone playback starts
     */
    ProgressToneStart       : 'ProgressToneStart',
    /**
     * Event is triggered when a progress tone playback stops
     */
    ProgressToneStop        : 'ProgressToneStop'
};

export default CallEvents;