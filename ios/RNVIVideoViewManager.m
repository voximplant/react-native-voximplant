/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVIVideoViewManager.h"
#import "RNVIVideoView.h"


@implementation RNVIVideoViewManager
RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(videoStreamId, NSString*);
RCT_EXPORT_VIEW_PROPERTY(scaleType, NSString*);

- (UIView *)view {
    return [[RNVIVideoView alloc] init];
}

@end

