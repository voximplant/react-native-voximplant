/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <VoxImplant/VoxImplant.h>

@interface VIClientModule : RCTEventEmitter <RCTBridgeModule, VIClientSessionDelegate, VIClientCallManagerDelegate, VILogDelegate>
+ (NSUUID *)uuidForPushNotification:(NSDictionary *)notification;
@end
