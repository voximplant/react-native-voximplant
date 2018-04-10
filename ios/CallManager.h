/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VICall.h"


@interface CallManager : NSObject

+ (void)addCall:(VICall *)call;
+ (VICall *)getCallById:(NSString *)callId;
+ (void)removeCallById:(NSString *)callId;

@end
