/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "VideoViewManager.h"
#import "VideoView.h"


@implementation VIVideoViewManager
RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(videoStreamId, NSString*);
RCT_EXPORT_VIEW_PROPERTY(scaleType, NSString*);

- (UIView *)view {
    return [[VideoView alloc] init];
}

@end

