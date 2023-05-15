/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

#import <UIKit/UIKit.h>
#import "RCTView.h"

@interface RNVIVideoViewImpl : RCTView
- (void)setVideoStreamId:(NSString *)videoStreamId;
- (void)setScaleType:(NSString *)scaleType;
@end
