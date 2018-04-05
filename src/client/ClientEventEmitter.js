/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {
	NativeModules,
	Platform,
	NativeEventEmitter,
	DeviceEventEmitter,
} from 'react-native';

export default Platform.select({
	ios: new NativeEventEmitter(NativeModules.ClientModule),
	android: DeviceEventEmitter,
});