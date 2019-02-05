/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import "VIVideoRendererView.h"
#import "VIAudioDevice.h"
#import "VIMessengerEvent.h"
#import "VIMessenger.h"

@interface Utils : NSObject
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)convertIntToCallError:(NSInteger)code;
+ (VIVideoResizeMode)convertStringToVideoResizeMode:(NSString *)mode;
+ (VIAudioDevice *)convertStringToAudioDevice:(NSString *)device;
+ (NSString *)convertAudioDeviceToString:(VIAudioDevice *)device;
+ (NSString *)convertMessengerEventTypeToString:(VIMessengerEventType)eventType;
+ (NSString *)convertMessengerEventActionToString:(VIMessengerActionType)action;
+ (NSString *)convertMessengerNotificationToString:(VIMessengerNotification)notification;
@end
