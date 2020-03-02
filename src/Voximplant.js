/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

/**
 * @module Voximplant
 */

'use strict';

import Client from './client/Client';
import Call from './call/Call';
import CallEvents from './call/CallEvents';
import Endpoint from './call/Endpoint';
import VideoStream from './call/VideoStream';
import VideoView from './call/VideoView';
import EndpointEvents from './call/EndpointEvents';
import ClientEvents from './client/ClientEvents';
import {ClientState, CameraType, RenderScaleType, LogLevel, CallError, VideoCodec, RequestAudioFocusMode, VideoStreamType} from "./Enums";
import * as Hardware from './hardware';
import * as Messaging from './messaging';

/**
 * Get Voximplant.Client instance to use platform functions
 * @param {ClientConfig} clientConfig Configuration for new Client instance.
 * @returns {Voximplant.Client}
 * @memberOf Voximplant
 * @kind function
 */
export const getInstance = (clientConfig) => {
    return Client.getInstance(clientConfig);
};

/**
 * Get instance of messaging subsystem
 * @returns {Voximplant.Messaging.Messenger}
 * @memberOf Voximplant
 * @kind function
 */
export const getMessenger = () => {
    return Messaging.Messenger.getInstance();
};

export {
    Client,
    Call,
    CallEvents,
    Endpoint,
    VideoStream,
    VideoView,
    EndpointEvents,
    ClientEvents,
    ClientState,
    CameraType,
    RenderScaleType,
    CallError,
    LogLevel,
    VideoCodec,
    RequestAudioFocusMode,
    VideoStreamType,
    Hardware,
    Messaging
};