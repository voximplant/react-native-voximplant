/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

exports.VoximplantLegacy = require('./src/Legacy').default;
exports.Preview = require('./src/VoxImplantView').Preview;
exports.RemoteView = require('./src/VoxImplantView').RemoteView;

exports.Voximplant = require('./src/Voximplant').default;
exports.Client = require('./src/client/Client');
exports.ClientEvents = require('./src/client/ClientEvents').default;
exports.ClientState = require('./src/Structures').ClientState;
exports.RenderScaleType = require('./src/Structures').RenderScaleType;
exports.Call = require('./src/call/Call').default;
exports.CallEvents = require('./src/call/CallEvents').default;
exports.Endpoint = require('./src/call/Endpoint').default;
exports.EndpointEvents = require('./src/call/EndpointEvents').default;
exports.VideoStream = require('./src/call/VideoStream').default;
exports.VideoView = require('./src/call/VideoView').default;
exports.AudioDeviceManager = require('./src/hardware/AudioDeviceManager').default;
exports.AudioDevice = require('./src/Structures').AudioDevice;
exports.AudioDeviceEvents = require('./src/hardware/AudioDeviceEvents').default;
exports.CameraManager = require('./src/hardware/CameraManager').default;
exports.CameraType = require('./src/Structures').CameraType;
exports.CameraEvents = require('./src/hardware/CameraEvents').default;