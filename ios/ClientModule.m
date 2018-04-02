/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"

#import "VIClient.h"

@interface ClientModule : NSObject <RCTBridgeModule>
@property(nonatomic, strong) VIClient* client;
@end

@implementation ClientModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString*)logLevel) {
    VILogLevel level = VILogLevelInfo;
    if ([logLevel isEqualToString:@"error"]) {
        level = VILogLevelError;
    } else if ([logLevel isEqualToString:@"warning"]) {
        level = VILogLevelWarning;
    } else if ([logLevel isEqualToString: @"info"]) {
        level = VILogLevelInfo;
    } else if ([logLevel isEqualToString:@"debug"]) {
        level = VILogLevelDebug;
    } else if ([logLevel isEqualToString:@"verbose"]) {
        level = VILogLevelVerbose;
    } else if ([logLevel isEqualToString:@"max"]) {
        level = VILogLevelMax;
    }
    
    [VIClient setLogLevel:level];
    self.client = [[VIClient alloc] initWithDelegateQueue:dispatch_get_main_queue()];
}

RCT_EXPORT_METHOD(disconnect) {
    if (self.client) {
        [self.client disconnect];
    }
}

@end
