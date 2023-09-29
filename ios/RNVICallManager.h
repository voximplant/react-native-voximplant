/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <VoxImplantSDK/VoxImplantSDK.h>

@interface RNVICallManager : NSObject

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

+ (void)addLocalVideoStream:(VILocalVideoStream *)videoStream;
+ (VILocalVideoStream *)getLocalVideoStreamById:(NSString *)videoStreamId;
+ (void)removeLocalVideoStreamById:(NSString *)videoStreamId;

+ (void)addRemoteVideoStream:(VIRemoteVideoStream *)videoStream;
+ (VIRemoteVideoStream *)getRemoteVideoStreamById:(NSString *)videoStreamId;
+ (void)removeRemoteVideoStreamById:(NSString *)videoStreamId;

+ (VIVideoStream *)getVideoStreamById:(NSString *)videoStreamId;

// This method is intended to be used only to end the calls when the app is terminating
+ (void)endAllCalls;


@end
