/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import * as Voximplant from "./src/Voximplant";

exports.VoximplantLegacy = require('./src/Legacy').default;
exports.Preview = require('./src/VoxImplantView').Preview;
exports.RemoteView = require('./src/VoxImplantView').RemoteView;


exports.Voximplant = Voximplant;