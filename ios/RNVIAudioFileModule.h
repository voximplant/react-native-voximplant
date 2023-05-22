/*
* Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
*/

#import <VoxImplantSDK/VoxImplantSDK.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"

@interface RNVIAudioFileModule : RCTEventEmitter <RCTBridgeModule, VIAudioFileDelegate>

@end
