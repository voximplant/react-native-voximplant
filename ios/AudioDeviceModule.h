/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "VIAudioManager.h"
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface AudioDeviceModule : RCTEventEmitter <RCTBridgeModule, VIAudioManagerDelegate>
@end
