/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import "VIVideoRendererView.h"
#import "VIAudioDevice.h"

@interface Utils :NSObject
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)convertIntToCallError:(NSInteger)code;
+ (VIVideoResizeMode)convertStringToVideoResizeMode:(NSString *)mode;
+ (VIAudioDevice *)convertStringToAudioDevice:(NSString *)device;
+ (NSString *)convertAudioDeviceToString:(VIAudioDevice *)device;
@end
