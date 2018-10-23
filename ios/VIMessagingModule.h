/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "VIMessenger.h"

@interface VIMessagingModule : RCTEventEmitter <RCTBridgeModule, VIMessengerDelegate>
@end
