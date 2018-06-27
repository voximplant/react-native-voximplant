/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
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
import {ClientState, CameraType, RenderScaleType, LogLevel, CallError} from "./Enums";
import * as Hardware from './hardware';

export const getInstance = (clientConfig) => {
    return Client.getInstance(clientConfig);
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
    Hardware
};