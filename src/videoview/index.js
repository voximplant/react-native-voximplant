/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

// @flow
const isFabricEnabled = global.nativeFabricUIManager != null;

console.log("YULIA: FABRIC IS ENABLED = " + isFabricEnabled);

// const VideoView = isFabricEnabled ?
//     require("./VideoViewNativeComponent").default :
//     require("./VideoView").default;

const VideoView = require("./VideoViewNativeComponent").default;

export default VideoView;

