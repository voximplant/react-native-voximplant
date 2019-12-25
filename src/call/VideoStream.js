/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

/**
 * @memberOf Voximplant
 * @class VideoStream
 * @classdesc Class that represents a video stream within a call.
 */
export default class VideoStream {
    /**
     * @member {string} id - Video stream id.
     * @memberOf Voximplant.VideoStream
     */
    id;
    /**
     * @member {boolean} isLocal - True if video stream is local, false otherwise.
     * @memberOf Voximplant.VideoStream
     */
    isLocal;

    /**
     * @member {Voximplant.VideoStreamType} type - Video stream type
     * @memberOf Voximplant.VideoStream
     */
    type;

    /**
     * @ignore
     */
    constructor(id, isLocal, type) {
        this.id = id;
        this.isLocal = isLocal;
        this.type = type;
    }
}
