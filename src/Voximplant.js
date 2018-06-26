/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

export Client from './client/Client';
export Call from './call/Call';
export CallEvents from './call/CallEvents';
export Endpoint from './call/Endpoint';
export VideoStream from './call/VideoStream';
export VideoView from './call/VideoView';
export EndpointEvents from './call/EndpointEvents';
export ClientEvents from './client/ClientEvents';
export {ClientState,RenderScaleType} from './Structures';
import * as Hardware from './hardware';

export {Hardware};
export const getInstance = (clientConfig) =>{
    return Client.getInstance(clientConfig);
};