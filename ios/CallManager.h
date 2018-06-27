/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIClient.h"
#import "VICall.h"
#import "VIEndpoint.h"
#import "VIVideoStream.h"

@interface CallManager : NSObject

+ (VIClient *)getClient;

+ (void)addCall:(VICall *)call;
+ (VICall *)getCallById:(NSString *)callId;
+ (void)removeCallById:(NSString *)callId;

+ (VICall *)getCallByEndpointId:(NSString *)endpointId;
+ (NSString *)getCallIdByEndppointId:(NSString *)endpointId;

+ (void)addEndpoint:(VIEndpoint *)endpoint forCall:(NSString *)callId;
+ (VIEndpoint *)getEndpointById:(NSString *)endpointId;
+ (void)removeEndpointById:(NSString *)endpointId;

+ (void)addVideoStream:(VIVideoStream *)videoStream;
+ (VIVideoStream *)getVideoStreamById:(NSString *)videoStreamId;
+ (void)removeVideoStreamById:(NSString *)videoStreamId;

@end
