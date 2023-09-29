/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVICallManager.h"

@interface RNVICallManager()
@property(nonatomic, strong) VIClient *client;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VICall *> *calls;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIEndpoint *> *endpoints;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VILocalVideoStream *> *localVideoStreams;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIRemoteVideoStream *> *remoteVideoStreams;
@property(nonatomic, strong) NSMutableDictionary<NSString *, NSString *> *callEndpoints;
@end

@implementation RNVICallManager

+ (RNVICallManager *)getInstance {
    static dispatch_once_t onceToken;
    static RNVICallManager *callManager;
    dispatch_once(&onceToken, ^{
        callManager = [RNVICallManager new];
    });
    return callManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _calls = [NSMutableDictionary dictionary];
        _endpoints = [NSMutableDictionary dictionary];
        _callEndpoints = [NSMutableDictionary dictionary];
        _localVideoStreams = [NSMutableDictionary dictionary];
        _remoteVideoStreams = [NSMutableDictionary dictionary];
    }
    return self;
}

+ (VIClient *)getClient {
    if (![RNVICallManager getInstance].client) {
        [RNVICallManager getInstance].client = [[VIClient alloc] initWithDelegateQueue:dispatch_queue_create("com.voximplant.rn", DISPATCH_QUEUE_SERIAL)];
    }
    return [RNVICallManager getInstance].client;
}

+ (VIClient *)getClientWithBundleId:(NSString *)bundleId {
    if (![RNVICallManager getInstance].client) {
        [RNVICallManager getInstance].client = [[VIClient alloc] initWithDelegateQueue:dispatch_queue_create("com.voximplant.rn", DISPATCH_QUEUE_SERIAL) bundleId:bundleId];
    }
    return [RNVICallManager getInstance].client;
}

+ (void)addCall:(VICall *)call {
    [[RNVICallManager getInstance].calls setObject:call forKey:call.callId];
}

+ (VICall *)getCallById:(NSString *)callId {
    if (callId) {
        return [[RNVICallManager getInstance].calls objectForKey:callId];
    }
    return nil;
}

+ (VICall *)getCallByEndpointId:(NSString *)endpointId {
    return [[RNVICallManager getInstance].calls objectForKey:[[RNVICallManager getInstance].callEndpoints objectForKey:endpointId]];
}
+ (NSString *)getCallIdByEndpointId:(NSString *)endpointId {
    if (endpointId) {
        return [[RNVICallManager getInstance].callEndpoints objectForKey:endpointId];
    }
    return nil;
}

+ (void)removeCallById:(NSString *)callId {
    [[RNVICallManager getInstance].calls removeObjectForKey:callId];
    NSMutableArray *endpointIdToRemove = [NSMutableArray new];
    [[RNVICallManager getInstance].callEndpoints enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull endpointId_, NSString * _Nonnull callid_, BOOL * _Nonnull stop) {
        if ([callid_ isEqualToString:callId]) {
            [endpointIdToRemove addObject:endpointId_];
        }
    }];
    [[RNVICallManager getInstance].callEndpoints removeObjectsForKeys:endpointIdToRemove];
    [[RNVICallManager getInstance].endpoints removeObjectsForKeys:endpointIdToRemove];
}

+ (void)addEndpoint:(VIEndpoint *)endpoint forCall:(NSString *)callId {
    if (endpoint && endpoint.endpointId && callId) {
        [[RNVICallManager getInstance].endpoints setObject:endpoint forKey:endpoint.endpointId];
        [[RNVICallManager getInstance].callEndpoints setObject:callId forKey:endpoint.endpointId];
    }
}

+ (VIEndpoint *)getEndpointById:(NSString *)endpointId {
    if (endpointId) {
        return [[RNVICallManager getInstance].endpoints valueForKey:endpointId];
    }
    return nil;
}

+ (void)removeEndpointById:(NSString *)endpointId {
    [[RNVICallManager getInstance].endpoints removeObjectForKey:endpointId];
    [[RNVICallManager getInstance].callEndpoints removeObjectForKey:endpointId];
}

+ (void)addLocalVideoStream:(VILocalVideoStream *)videoStream {
    [[RNVICallManager getInstance].localVideoStreams setObject:videoStream forKey:videoStream.streamId];
}

+ (void)addRemoteVideoStream:(VIRemoteVideoStream *)videoStream {
    [[RNVICallManager getInstance].remoteVideoStreams setObject:videoStream forKey:videoStream.streamId];
}

+ (VILocalVideoStream *)getLocalVideoStreamById:(NSString *)videoStreamId {
    if (videoStreamId) {
        return [[RNVICallManager getInstance].localVideoStreams objectForKey:videoStreamId];
    }
    return nil;
}

+ (VIRemoteVideoStream *)getRemoteVideoStreamById:(NSString *)videoStreamId {
    if (videoStreamId) {
        return [[RNVICallManager getInstance].remoteVideoStreams objectForKey:videoStreamId];
    }
    return nil;
}

+ (void)removeLocalVideoStreamById:(NSString *)videoStreamId {
    [[RNVICallManager getInstance].localVideoStreams removeObjectForKey:videoStreamId];
}

+ (void)removeRemoteVideoStreamById:(NSString *)videoStreamId {
    [[RNVICallManager getInstance].remoteVideoStreams removeObjectForKey:videoStreamId];
}

+ (VIVideoStream *)getVideoStreamById:(NSString *)videoStreamId {
    VIVideoStream *videoStream = [[RNVICallManager getInstance].localVideoStreams objectForKey:videoStreamId];
    if (!videoStream) {
        videoStream = [[RNVICallManager getInstance].remoteVideoStreams objectForKey:videoStreamId];
    }
    return videoStream;
}

// This method is intended to be used only for the case applicationWillTerminate:
+ (void)endAllCalls {
    if ([RNVICallManager getInstance].calls.count == 0) {
        return;
    }
    [[RNVICallManager getInstance].calls enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull callId, VICall * _Nonnull call, BOOL * _Nonnull stop) {
        [call hangupWithHeaders:nil];
    }];
    // Sleep for 50ms to give the SDK time to notify the Voximplant Cloud that the call is ended
    usleep(50000);
}

@end
