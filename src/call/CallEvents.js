/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

const CallEvents = {
    Connected              : 'Connected',
    Disconnected           : 'Disconnected',
    EndpointAdded          : 'EndpointAdded',
    Failed                 : 'Failed',
    ICECompleted           : 'ICECompleted',
    ICETimeout             : 'ICETimeout',
    InfoReceived           : 'InfoReceived',
    LocalVideoStreamAdded  : 'LocalVideoStreamAdded',
    LocalVideStreamRemoved : 'LocalVideoStreamRemoved',
    MessageReceived        : 'MessageReceived',
    ProgressToneStart      : 'ProgressToneStart',
    ProgressToneStop       : 'ProgressToneStop',
    Updated                : 'Updated'
};

export default CallEvents;