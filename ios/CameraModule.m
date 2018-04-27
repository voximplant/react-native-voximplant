/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "CameraModule.h"
#import "RCTBridgeModule.h"
#import "Constants.h"


@interface CameraModule()
@end


@implementation CameraModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

@end
