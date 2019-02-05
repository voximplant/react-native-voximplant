/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
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
     * Handler function receives {@link EventHandlers.CallEventWithHeaders} object as an argument.
     */
    Connected               : 'Connected',
    /**
     * Event is triggered when a call was disconnected.
     * Handler function receives {@link EventHandlers.Disconnected} object as an argument.
     */
    Disconnected            : 'Disconnected',
    /**
     * Event is triggered when a new Endpoint is created. {@link Voximplant.Endpoint} represents an another participant in your call or conference.
     * Handler function receives {@link EventHandlers.EndpointAdded} object as an argument.
     */
    EndpointAdded           : 'EndpointAdded',
    /**
     * Event is triggered due to a call failure.
     * Handler function receives {@link EventHandlers.Failed} object as an argument.
     */
    Failed                  : 'Failed',
    /**
     * Event is triggered when ICE connection is complete.
     * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
     */
    ICECompleted            : 'ICECompleted',
    /**
     * Event is triggered when connection was not established due to a network connection problem between 2 peers.
     * Handler function receives {@link EventHandlers.CallEvent} object as an argument
     */
    ICETimeout              : 'ICETimeout',
    /**
     * Event is triggered when INFO message is received.
     * Handler function receives {@link EventHandlers.InfoReceived} object as an argument.
     */
    InfoReceived            : 'InfoReceived',
    /**
     * Event is triggered when local video is added to the call.
     * Handler function receives {@link EventHandlers.LocalVideoStreamAdded} object as an argument.
     */
    LocalVideoStreamAdded   : 'LocalVideoStreamAdded',
    /**
     * Event is triggered when local video is removed from the call.
     * Handler function receives {@link EventHandlers.LocalVideoStreamRemoved} object as an argument.
     */
    LocalVideoStreamRemoved : 'LocalVideoStreamRemoved',
    /**
     * Event is triggered when a text message is received.
     * Handler function receives {@link EventHandlers.MessageReceived} object as an argument.
     */
    MessageReceived         : 'MessageReceived',
    /**
     * Event is triggered when a progress tone playback starts.
     * Handler function receives {@link EventHandlers.CallEventWithHeaders} object as an argument.
     */
    ProgressToneStart       : 'ProgressToneStart',
    /**
     * Event is triggered when a progress tone playback stops.
     * Handler function receives {@link EventHandlers.CallEvent} object as an argument.
     */
    ProgressToneStop        : 'ProgressToneStop'
};

export default CallEvents;