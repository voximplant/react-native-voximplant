/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';
import React, { Component } from 'react';
import {
    Platform,
    NativeModules
} from 'react-native';
import { ClientConfig, LogLevel } from './Structures';

const ClientModule = NativeModules.ClientModule;

export default class Client {
    static clientInstance = null;

    constructor(clientConfig) {
        if (!clientConfig) clientConfig = {};
        if (Platform.OS === 'android') {
            if (clientConfig.enableVideo === undefined) clientConfig.enableVideo = true;
            if (clientConfig.enableHWAcceleration === undefined) clientConfig.enableHWAcceleration = true;
            if (clientConfig.provideLocalFramesInByteBuffer === undefined) clientConfig.provideLocalFramesInByteBuffer = false;
            if (clientConfig.enableDebugLogging === undefined) clientConfig.enableDebugLogging = false;
            ClientModule.init(clientConfig.enableVideo,
                clientConfig.enableHWAcceleration,
                clientConfig.provideLocalFramesInByteBuffer,
                clientConfig.enableDebugLogging);
        }
        if (Platform.OS === 'ios') {
            if (clientConfig.logLevel === undefined) clientConfig.logLevel = LogLevel.LogLevelInfo;
            ClientModule.init(clientConfig.logLevel);
        }
    }

    static getInstnce(clientConfig) {
        if (this.clientInstance === null) {
            this.clientInstance = new Client();
        }
        return this.clientInstance;
    }

    disconnect() {
        ClientModule.disconnect();
    }
} 
