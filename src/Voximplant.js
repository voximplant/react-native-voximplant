/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react'
import PropTypes from 'prop-types';
import {
	Platform,
	NativeModules
} from 'react-native';

import Client from './client/Client'

export default class Voximplant {

	static getClientInstance(clientConfig) {
		return Client.getInstnce(clientConfig);
	}
}