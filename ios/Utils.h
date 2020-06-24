/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import <VoxImplant/VoxImplant.h>

@interface Utils : NSObject
+ (NSData *)dataFromHexString:(NSString *)string;
+ (NSString *)convertIntToCallError:(NSInteger)code;
+ (VIVideoResizeMode)convertStringToVideoResizeMode:(NSString *)mode;
+ (VIAudioDevice *)convertStringToAudioDevice:(NSString *)device;
+ (NSString *)convertAudioDeviceToString:(VIAudioDevice *)device;
+ (NSString *)convertMessengerEventTypeToString:(VIMessengerEventType)eventType;
+ (NSString *)convertMessengerEventActionToString:(VIMessengerAction)action;
+ (NSString *)convertMessengerNotificationToString:(VIMessengerNotification)notification;
+ (NSString *)convertLogSeverity:(VILogSeverity)severity;
+ (NSDictionary *)convertAuthParamsToDictionary:(VIAuthParams *)authParams;
+ (NSString *)convertVideoStreamTypeToString:(VIVideoStreamType)videoStreamType;
+ (NSString *)convertAudioFileErrorToString:(VIAudioFileErrorCode)audioFileError;

@end
