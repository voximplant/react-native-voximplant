/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
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
        this.calls.delete(call.callId);
    }

    getCallById(callId) {
        return this.calls.get(callId);
    }

    addEndpoint(callId, endpoint) {
        if (this.endpoints.get(callId) === undefined) {
            this.endpoints.set(callId, new Set());
        }
        this.endpoints.get(callId).add(endpoint);
    }

    removeEndpoint(callId, endpoint) {
        if (this.endpoints.get(callId) !== undefined) {
            this.endpoints.get(callId).delete(endpoint);
        }
    }

    getCallEndpoints(callId) {
        return this.endpoints.get(callId);
    }

    getEndpointById(id) {
        this.endpoints.forEach((value, key, map) => {
            value.forEach((endpoint) => {
                if (endpoint.id === id) {
                    return endpoint;
                }
            })
        });
    }

    addVideoStream(videoStream) {
        this.videoStreams.set(videoStream.id, videoStream);
    }

    removeVideoStream(videoStream) {
        this.videoStreams.delete(videoStream.id);
    }

    getVideoStreamById(id) {
        return this.videoStreams.get(id);
    }
}