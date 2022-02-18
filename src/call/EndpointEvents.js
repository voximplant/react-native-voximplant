/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Events that are triggered when Endpoint is updated/edited, removed or started/stopped to receive stream from another Endpoint.
 * @memberOf Voximplant
 * @enum {string}
 * @type {{InfoUpdated: string, RemoteVideoStreamAdded: string, RemoteVideoStreamRemoved: string, Removed: string, VoiceActivityStarted: string, VoiceActivityStopped: string}}
 */
const EndpointEvents = {
    /**
     * Event is triggered when endpoint information such as display name, user name and sip uri is updated.
     * Handler function receives {@link EventHandlers.InfoUpdated} object as an argument.
     */
    InfoUpdated              : 'InfoUpdated',
    /**
     * Event is triggered after endpoint added video stream to the call.
     * Handler function receives {@link EventHandlers.RemoteVideoStreamAdded} object as an argument.
     */
    RemoteVideoStreamAdded   : 'RemoteVideoStreamAdded',
    /**
     * Event is triggered after endpoint removed video stream from the call. Event is not triggered on call end.
     * Handler function receives {@link EventHandlers.RemoteVideoStreamRemoved} object as an argument.
     */
    RemoteVideoStreamRemoved : 'RemoteVideoStreamRemoved',
    /**
     * Event is triggered when an Endpoint is removed.
     * Handler function receives {@link EventHandlers.Removed} object as an argument.
     */
    Removed                  : 'Removed',
    /**
     * Event is triggered when a voice activity of the endpoint is detected in a conference call.
     */
    VoiceActivityStarted     : 'VoiceActivityStarted',
    /**
     * Event is triggered when a voice activity of the endpoint is stopped in a conference call.
     */
    VoiceActivityStopped     : 'VoiceActivityStopped'
};

export default EndpointEvents;