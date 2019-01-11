/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';

/**
 * @memberOf Voximplant
 * @class VideoStream
 * @classdesc Class that represents a video stream within a call.
 */
export default class VideoStream {
    /**
     * @member {string} id - The video stream id.
     * @memberOf Voximplant.VideoStream
     */
    id;
    /**
     * @member {boolean} isLocal - True if video stream is local, false otherwise.
     * @memberOf Voximplant.VideoStream
     */
    isLocal;

    /**
     * @ignore
     */
    constructor(id, isLocal) {
        this.id = id;
        this.isLocal = isLocal;
    }
}