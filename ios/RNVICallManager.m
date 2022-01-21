/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVICallManager.h"

@interface RNVICallManager()
@property(nonatomic, strong) VIClient *client;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VICall *> *calls;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIEndpoint *> *endpoints;
@property(nonatomic, strong) NSMutableDictionary<NSString *, VIVideoStream *> *videoStreams;
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
        _videoStreams = [NSMutableDictionary dictionary];
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

+ (void)addVideoStream:(VIVideoStream *)videoStream {
    [[RNVICallManager getInstance].videoStreams setObject:videoStream forKey:videoStream.streamId];
}

+ (VIVideoStream *)getVideoStreamById:(NSString *)videoStreamId {
    if (videoStreamId) {
        return [[RNVICallManager getInstance].videoStreams objectForKey:videoStreamId];
    }
    return nil;
}

+ (void)removeVideoStreamById:(NSString *)videoStreamId {
    [[RNVICallManager getInstance].videoStreams removeObjectForKey:videoStreamId];
}


@end
