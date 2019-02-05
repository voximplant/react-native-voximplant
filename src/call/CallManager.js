/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

'use strict';

export default class CallManager {
    static _instance = null;

    constructor() {
        this.calls = new Map();
        this.endpoints = new Map();
        this.videoStreams = new Map();
    }

    static getInstance() {
        if (this._instance === null) {
            this._instance = new CallManager();
        } 
        return this._instance;
    }

    addCall(call) {
        this.calls.set(call.callId, call);
    }

    removeCall(call) {
        call._removeEventListeners();
        let endpoints_ = this.getCallEndpoints(call.callId);
        if (endpoints_ !== undefined) {
            for (let endpoint of endpoints_) {
                this.removeEndpoint(call.callId, endpoint);
            }
        }
        let videoStreams_ = this.videoStreams.get(call.callId);
        if (videoStreams_ !== undefined) {
            for (let videoStream of videoStreams_) {
                this.removeVideoStream(call.callId, videoStream);
            }
        }
        this.calls.delete(call.callId);
    }

    getCallById(callId) {
        return this.calls.get(callId);
    }

    addEndpoint(callId, endpoint) {
        if (this.endpoints.get(callId) === undefined) {
            this.endpoints.set(callId, new Set());
        }
        if (Array.from(this.endpoints.get(callId).values()).some(_ => _.id === endpoint.id)) {
            return;
        }
        this.endpoints.get(callId).add(endpoint);
    }

    removeEndpoint(callId, endpoint) {
        if (this.endpoints.get(callId) !== undefined) {
            endpoint._removeEventListeners();
            this.endpoints.get(callId).delete(endpoint);
            if (this.endpoints.get(callId).size === 0) {
                this.endpoints.delete(callId);
            }
        }
    }

    getCallEndpoints(callId) {
        return this.endpoints.get(callId);
    }

    getEndpointById(id) {
        for (let [callId, endpoints] of this.endpoints) {
            for (let endpoint of endpoints) {
                if (endpoint.id === id) {
                    return endpoint;
                }
            }
        }
    }

    getCallIdByEndpointId(endpointId) {
        for (let [callId, endpoints] of this.endpoints) {
            for (let endpoint of endpoints) {
                if (endpoint.id === endpointId) {
                    return callId;
                }
            }
        }
    }

    addVideoStream(callId, videoStream) {
        if (this.videoStreams.get(callId) === undefined) {
            this.videoStreams.set(callId, new Set());
        }
        this.videoStreams.get(callId).add(videoStream);
    }

    removeVideoStream(callId, videoStream) {
        if (this.videoStreams.get(callId) !== undefined) {
            this.videoStreams.get(callId).delete(videoStream);
            if (this.videoStreams.get(callId).size === 0) {
                this.videoStreams.delete(callId);
            }
        }
    }

    getVideoStreamById(id) {
        for (let [callId, videoStreams] of this.videoStreams) {
            for (let videoStream of videoStreams) {
                if (videoStream.id === id) {
                    return videoStream;
                }
            }
        }
    }
}