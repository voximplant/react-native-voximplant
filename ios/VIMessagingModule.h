/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import <VoxImplant/VoxImplant.h>

@interface VIMessagingModule : RCTEventEmitter <RCTBridgeModule, VIMessengerDelegate>
@end
