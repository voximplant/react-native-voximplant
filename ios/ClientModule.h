/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "VIClient.h"

@interface ClientModule : RCTEventEmitter <RCTBridgeModule, VIClientSessionDelegate, VIClientCallManagerDelegate>
@end
