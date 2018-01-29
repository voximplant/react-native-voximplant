/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "VoxImplant.h"

@interface VoxImplantModule : NSObject <RCTBridgeModule, VoxImplantDelegate>

- (id)init;

@end
