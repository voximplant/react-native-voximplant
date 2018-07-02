/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Events that are triggered when Endpoint is updated/edited, removed or started/stopped to receive stream from another Endpoint.
 * @enum {string}
 * @type {{InfoUpdated: string, RemoteVideoStreamAdded: string, RemoteVideoStreamRemoved: string, Removed: string}}
 */
const EndpointEvents = {
    /**
     * Event is triggered when endpoint information such as display name, user name and sip uri is updated
     */
    InfoUpdated              : 'InfoUpdated',
    /**
     * Event is triggered after endpoint added video stream to the call.
     */
    RemoteVideoStreamAdded   : 'RemoteVideoStreamAdded',
    /**
     * Event is triggered after endpoint removed video stream from the call. Event is not triggered on call end.
     */
    RemoteVideoStreamRemoved : 'RemoteVideoStreamRemoved',
    /**
     * Event is triggered when an Endpoint is removed.
     */
    Removed                  : 'Removed'
};

export default EndpointEvents;