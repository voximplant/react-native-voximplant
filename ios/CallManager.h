/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <VoxImplant/VoxImplant.h>

@interface CallManager : NSObject

+ (VIClient *)getClient;
+ (VIClient *)getClientWithBundleId:(NSString *)bundleId;

+ (void)addCall:(VICall *)call;
+ (VICall *)getCallById:(NSString *)callId;
+ (void)removeCallById:(NSString *)callId;

+ (VICall *)getCallByEndpointId:(NSString *)endpointId;
+ (NSString *)getCallIdByEndpointId:(NSString *)endpointId;

+ (void)addEndpoint:(VIEndpoint *)endpoint forCall:(NSString *)callId;
+ (VIEndpoint *)getEndpointById:(NSString *)endpointId;
+ (void)removeEndpointById:(NSString *)endpointId;

+ (void)addVideoStream:(VIVideoStream *)videoStream;
+ (VIVideoStream *)getVideoStreamById:(NSString *)videoStreamId;
+ (void)removeVideoStreamById:(NSString *)videoStreamId;

@end
