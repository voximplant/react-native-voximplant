/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "VICall.h"
#import "VIEndpoint.h"


@interface VICallModule : RCTEventEmitter <RCTBridgeModule, VICallDelegate, VIEndpointDelegate>
@end
