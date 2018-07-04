/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "VICall.h"
#import "VIEndpoint.h"


@interface CallModule : RCTEventEmitter <RCTBridgeModule, VICallDelegate, VIEndpointDelegate>
@end
