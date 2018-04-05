/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

exports.VoximplantLegacy = require('./src/Legacy').default;
exports.Preview = require('./src/VoxImplantView').Preview;
exports.RemoteView = require('./src/VoxImplantView').RemoteView;

exports.Voximplant = require('./src/Voximplant').default;
exports.Client = require('./src/client/Client');
exports.ClientEvents = require('./src/client/ClientEvents').default;
exports.ClientState = require('./src/client/Structures').ClientState;