/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

// @flow
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
...ViewProps,
    videoStreamId: string,
    scaleType: string,
    showOnTop: boolean,
|}>;

export default (codegenNativeComponent<NativeProps>(
    'RNVIVideoView',
): HostComponent<NativeProps>);
