/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "CallManager.h"
#import "VICall.h"

@interface CallManager()
@property(nonatomic, strong) NSMutableDictionary<NSString *, VICall *> *calls;
@end

@implementation CallManager

+ (CallManager *)getInstance {
    static dispatch_once_t onceToken;
    static CallManager *callManager;
    dispatch_once(&onceToken, ^{
        callManager = [CallManager new];
    });
    return callManager;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _calls = [NSMutableDictionary dictionary];
    }
    return self;
}

+ (void)addCall:(VICall *)call {
    [[CallManager getInstance].calls setObject:call forKey:call.callId];
}

+ (VICall *)getCallById:(NSString *)callId {
    VICall* call = [[CallManager getInstance].calls valueForKey:callId];
    return call;
}

+ (void)removeCallById:(NSString *)callId {
    [[CallManager getInstance].calls removeObjectForKey:callId];
}



@end
