/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <VoxImplantSDK/VoxImplantSDK.h>

@interface RNVIClientModule : RCTEventEmitter <RCTBridgeModule, VIClientSessionDelegate, VIClientCallManagerDelegate, VILogDelegate>
+ (NSUUID *)uuidForPushNotification:(NSDictionary *)notification;
@end
