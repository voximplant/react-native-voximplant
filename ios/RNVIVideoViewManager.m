/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RCTViewManager.h"
#import "RNVIVideoViewImpl.h"

@interface RNVIVideoViewManager : RCTViewManager
@end

@implementation RNVIVideoViewManager
RCT_EXPORT_MODULE(RNVIVideoView);

RCT_EXPORT_VIEW_PROPERTY(videoStreamId, NSString*);
RCT_EXPORT_VIEW_PROPERTY(scaleType, NSString*);

- (UIView *)view {
    return [[RNVIVideoViewImpl alloc] init];
}

@end

