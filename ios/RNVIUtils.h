/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

#import <VoxImplantSDK/VoxImplantSDK.h>

@interface RNVIUtils : NSObject
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
+ (NSString *)convertVideoStreamReceiveStopReasonToString:(VIVideoStreamReceiveStopReason)reason;
+ (NSString *)convertAudioFileErrorToString:(VIAudioFileErrorCode)audioFileError;
+ (VIVideoCodec)convertVideoCodecFromString:(NSString *)codec;
+ (VICallSettings *)convertDictionaryToCallSettings:(NSDictionary *)settings;
+ (VILogLevel)convertLogLevelFromString:(NSString *)logLevel;
+ (NSString *)convertQualityIssueLevelToString:(VIQualityIssueLevel)level;
+ (NSString *)convertQualityIssueTypeToString:(VIQualityIssueType)type;

@end

@interface NSNumber (FromTimeInterval)

+ (instancetype)fromTimeInterval:(NSTimeInterval)timeInterval;

@end
