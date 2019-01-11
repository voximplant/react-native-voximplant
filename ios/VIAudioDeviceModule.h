/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "VIAudioManager.h"
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface VIAudioDeviceModule : RCTEventEmitter <RCTBridgeModule, VIAudioManagerDelegate>
@end
