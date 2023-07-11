/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * Events that are triggered when Endpoint is updated/edited, removed or started/stopped to receive stream from another Endpoint.
 * @memberOf Voximplant
 * @enum {string}
 * @type {{InfoUpdated: string, RemoteVideoStreamAdded: string, RemoteVideoStreamRemoved: string, Removed: string, VoiceActivityStarted: string, VoiceActivityStopped: string, StartReceiveVideoStream: string, StopReceiveVideoStream: string}}
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
    VoiceActivityStopped     : 'VoiceActivityStopped',
    /**
     * Triggered when video receive on a remote video stream is started after previously being stopped. Available only for the conference calls.
     *
     * The event is triggered if:
     * 1. {@link Voximplant.Endpoint#startReceiving} was called and the request has been processed successfully.
     * 2. A network issue that caused the Voximplant Cloud to stop video receive of the remote video stream is gone.
     *
     * The event is not triggered if the endpoint client has started sending video using {@link Voximplant.Call#sendVideo} API.
     */
    StartReceivingVideoStream  : 'StartReceivingVideoStream',
    /**
     * Triggered when video receive on a remote video stream is stopped. Available only for the conference calls.
     *
     * Video receive on a remote video stream can be stopped due to:
     * 1. {@link Voximplant.Endpoint#stopReceiving} was called and the request has been processed successfully.
     * In this case the value of the "reason" parameter is {@link Voximplant.VideoStreamReceiveStopReason#MANUAL}
     * 2. Voximplant Cloud has detected a network issue on the client and automatically stopped the video.
     * In this case the value of the "reason" parameter is {@link Voximplant.VideoStreamReceiveStopReason#AUTOMATIC}
     *
     * If the video receive is disabled automatically, it may be automatically enabled as soon as the network condition
     * on the device is good and there is enough bandwidth to receive the video on this remote video stream.
     * In this case event {@link Voximplant.EndpointEvents.StartReceivingVideoStream} will be invoked.
     *
     * The event is not triggered if the endpoint client has stopped sending video using {@link Voximplant.Call#sendVideo} API.
     */
    StopReceivingVideoStream  : 'StopReceivingVideoStream',
};

export default EndpointEvents;
