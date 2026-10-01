//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

#import "RNVICore.h"

#if __has_include("react_native_voximplant_core-Swift.h")
#import "react_native_voximplant_core-Swift.h"
#else
#import "react_native_voximplant_core/react_native_voximplant_core-Swift.h"
#endif

@implementation RNVICore {
    CoreImpl *coreImpl;
}

- (instancetype)init {
    if (self = [super init]) {
        coreImpl = [CoreImpl new];
    }
    [self setupCallbacks];
    return self;
}

#ifdef RCT_NEW_ARCH_ENABLED

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeCoreSpecJSI>(params);
}

+ (NSString *)moduleName {
    return @"RNVICore";
}

- (nonnull NSString *)getClientState {
    return coreImpl.clientState;
}

- (void)connect:(JS::NativeCore::ConnectOptions &)options
        resolve:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject {
    NSString *node = options.node();
    if (!node) { return; }

    NSArray<NSString *> *gatewaysArray = RCTConvertOptionalVecToArray(options.gateways()) ?: @[];

    [coreImpl connectWithNodeString:node
                           gateways:gatewaysArray
                            resolve:resolve
                             reject:reject];
}

- (void)registerForPushNotifications:(JS::NativeCore::PushConfig &)config
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
    NSString *token = config.token();
    if (!token) { return; }
    [coreImpl registerForPushNotificationsWithToken:token
                                           bundleId:config.bundleId()
                                            resolve:resolve
                                             reject:reject];
}

- (void)unregisterFromPushNotifications:(JS::NativeCore::PushConfig &)config
                                resolve:(RCTPromiseResolveBlock)resolve
                                 reject:(RCTPromiseRejectBlock)reject {
    NSString *token = config.token();
    if (!token) { return; }
    [coreImpl unregisterFromPushNotificationsWithToken:token
                                              bundleId:config.bundleId()
                                               resolve:resolve
                                                reject:reject];
}

- (void)configureLoggerCallback:(JS::NativeCore::LoggerCallbackConfigDTO &)config {
    NSString *logLevel = config.logLevel();
    auto timestamp = config.timestamp();
    BOOL withTimestamps = timestamp.has_value() ? timestamp.value() : YES;

    [coreImpl configureLoggerWithLogLevel:logLevel timestamp:withTimestamps];
}

#else

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getClientState) {
     return coreImpl.clientState;
 }

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"onClientDisconnected",
        @"onClientReconnecting",
        @"onClientReconnected",
    ];
}

RCT_EXPORT_METHOD(connect:(nonnull NSDictionary *)options
        resolve:(nonnull RCTPromiseResolveBlock)resolve
         reject:(nonnull RCTPromiseRejectBlock)reject) {
    NSArray<NSString *> *gatewaysArray = options[@"gateways"] ?: @[];
    NSString *node = options[@"node"];
    if (!node) { return; }

    [coreImpl connectWithNodeString:node
                           gateways:gatewaysArray
                            resolve:resolve
                             reject:reject];
}

RCT_EXPORT_METHOD(registerForPushNotifications:(nonnull NSDictionary *)config
                             resolve:(nonnull RCTPromiseResolveBlock)resolve
                              reject:(nonnull RCTPromiseRejectBlock)reject) {
    NSString *token = config[@"token"];
    if (!token) { return; }
    [coreImpl registerForPushNotificationsWithToken:token
                                           bundleId:config[@"bundleId"]
                                            resolve:resolve
                                             reject:reject];
}

RCT_EXPORT_METHOD(unregisterFromPushNotifications:(nonnull NSDictionary *)config
                                          resolve:(nonnull RCTPromiseResolveBlock)resolve
                                           reject:(nonnull RCTPromiseRejectBlock)reject) {
    NSString *token = config[@"token"];
    if (!token) { return; }
    [coreImpl unregisterFromPushNotificationsWithToken:token
                                              bundleId:config[@"bundleId"]
                                               resolve:resolve
                                                reject:reject];
}

RCT_EXPORT_METHOD(configureLoggerCallback:(nonnull NSDictionary *)config) {
    NSString *logLevel = config[@"logLevel"];
    NSNumber *timestamp = config[@"timestamp"];
    BOOL withTimestamps = timestamp ? [timestamp boolValue] : YES;

    [coreImpl configureLoggerWithLogLevel:logLevel timestamp:withTimestamps];
}

#endif

RCT_EXPORT_METHOD(initialize) {}

RCT_EXPORT_METHOD(disconnect:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl disconnectWithResolve:resolve];
}

RCT_EXPORT_METHOD(login:(nonnull NSString *)username
     password:(nonnull NSString *)password
      resolve:(nonnull RCTPromiseResolveBlock)resolve
       reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl loginWithUsername:username
                       password:password
                        resolve:resolve
                         reject:reject];
}

RCT_EXPORT_METHOD(loginWithAccessToken:(nonnull NSString *)username
                 accessToken:(nonnull NSString *)accessToken
                     resolve:(nonnull RCTPromiseResolveBlock)resolve
                      reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl loginWithUsername:username
                    accessToken:accessToken
                        resolve:resolve
                         reject:reject];
}

RCT_EXPORT_METHOD(loginWithOneTimeKey:(nonnull NSString *)username
                       hash:(nonnull NSString *)hash
                    resolve:(nonnull RCTPromiseResolveBlock)resolve
                     reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl loginWithUsername:username
                           hash:hash
                        resolve:resolve
                         reject:reject];
}

RCT_EXPORT_METHOD(refreshTokens:(nonnull NSString *)username
         refreshToken:(nonnull NSString *)refreshToken
              resolve:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl refreshTokensWithUsername:username
                           refreshToken:refreshToken
                                resolve:resolve
                                 reject:reject];
}

RCT_EXPORT_METHOD(requestOneTimeKey:(nonnull NSString *)username
                  resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {
    [coreImpl requestOneTimeKeyWithUsername:username
                                    resolve:resolve
                                     reject:reject];
}

RCT_EXPORT_METHOD(handlePushNotification:(nonnull NSDictionary *)pushPayload) {
    [coreImpl handlePushNotificationWithPushPayload:pushPayload];
}

RCT_EXPORT_METHOD(setLogcatEnabled:(BOOL)enabled) {
    // Android only implementation
}

- (void)setupCallbacks {
    __weak __typeof(self) weakSelf = self;

#ifdef RCT_NEW_ARCH_ENABLED
    coreImpl.onDisconnect = ^(NSString *reason) {
        [weakSelf emitOnClientDisconnected:reason];
    };

    coreImpl.onReconnecting = ^{
        [weakSelf emitOnClientReconnecting];
    };

    coreImpl.onReconnect = ^{
        [weakSelf emitOnClientReconnected];
    };

    coreImpl.onLog = ^(NSDictionary *payload) {
        [weakSelf emitOnLog:payload];
    };
#else
    coreImpl.onDisconnect = ^(NSString *reason) {
        [weakSelf sendEventWithName:@"onClientDisconnected" body:reason];
    };

    coreImpl.onReconnecting = ^{
        [weakSelf sendEventWithName:@"onClientReconnecting" body:nil];
    };

    coreImpl.onReconnect = ^{
        [weakSelf sendEventWithName:@"onClientReconnected" body:nil];
    };
#endif
}

@end
