//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

#import "RNVIVideo.h"

#if __has_include("react_native_voximplant_calls-Swift.h")
#import "react_native_voximplant_calls-Swift.h"
#else
#import "react_native_voximplant_calls/react_native_voximplant_core-Swift.h"
#endif

@implementation RNVIVideo {
    CameraVideoSource *cameraVideoSource;
    VideoStreamManager *videoStreamManager;
}

- (instancetype)init {
    if (self = [super init]) {
        cameraVideoSource = [CameraVideoSource shared];
        videoStreamManager = [VideoStreamManager shared];
    }
    [self setupCallbacks];
    return self;
}

#ifdef RCT_NEW_ARCH_ENABLED

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule: (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeVideoSpecJSI>(params);
}

+ (NSString *)moduleName {
    return @"RNVIVideo";
}

- (nonnull NSArray<NSDictionary *> *)getDevices {
    return [cameraVideoSource devices];
}

- (NSDictionary * _Nullable)getDevice:(nonnull NSString *)id {
    return [cameraVideoSource getDeviceWithId:id];
}

- (nonnull NSNumber *)hasDevice:(nonnull NSString *)id {
    return @([cameraVideoSource hasDeviceWithId:id]);
}

- (nonnull NSDictionary *)getPreferredResolution {
    return [cameraVideoSource preferredResolution];
}

- (NSDictionary * _Nullable)getSelectedDevice {
    return [cameraVideoSource currentDevice];
}

- (NSDictionary * _Nullable)getLocalStream:(nonnull NSString *)streamId {
    return [videoStreamManager getLocalStreamWithStreamId:streamId];
}

- (nonnull NSArray<NSDictionary *> *)getLocalStreams {
    return [videoStreamManager getLocalStreams];
}

- (NSString * _Nullable)createLocalStream:(nonnull NSString *)source {
    return [videoStreamManager createLocalStreamWithVideoSourceType:source];
}

- (void)selectDevice:(JS::NativeVideo::CameraDevice &)device
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    NSString *deviceId = device.id_();
    if (!deviceId) { return; }
    [cameraVideoSource selectDeviceWithId:deviceId resolve:resolve reject:reject];
}

#else

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDevices) {
    return [cameraVideoSource devices];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDevice:(nonnull NSString *)id) {
    return [cameraVideoSource getDeviceWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasDevice:(nonnull NSString *)id) {
    return @([cameraVideoSource hasDeviceWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getPreferredResolution) {
    return [cameraVideoSource preferredResolution];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSelectedDevice) {
    return [cameraVideoSource currentDevice];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocalStream:(nonnull NSString *)streamId) {
    return [videoStreamManager getLocalStreamWithStreamId:streamId];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocalStreams) {
    return [videoStreamManager getLocalStreams];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(createLocalStream:(nonnull NSString *)source) {
    return [videoStreamManager createLocalStreamWithVideoSourceType:source];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"onStarted",
        @"onStopped",
        @"onFailed",
    ];
}

RCT_EXPORT_METHOD(selectDevice:(nonnull NSDictionary *)device
             resolve:(nonnull RCTPromiseResolveBlock)resolve
              reject:(nonnull RCTPromiseRejectBlock)reject) {
    NSString *deviceId = device[@"id"];
    if (!deviceId) { return; }
    [cameraVideoSource selectDeviceWithId:deviceId resolve:resolve reject:reject];
}

#endif

RCT_EXPORT_METHOD(setPreferredResolution:(nonnull NSDictionary *)preference) {
    [cameraVideoSource setPreferredResolution:preference];
}

RCT_EXPORT_METHOD(removeAllLocalStreams) {
    [videoStreamManager removeAllLocalStreams];
}

RCT_EXPORT_METHOD(removeLocalStream:(nonnull NSString *)streamId) {
    [videoStreamManager removeLocalStreamWithId:streamId];
}

- (void)setupCallbacks {
    __weak __typeof(self) weakSelf = self;

#ifdef RCT_NEW_ARCH_ENABLED
    cameraVideoSource.onCameraSourceStarted = ^{
        [weakSelf emitOnStarted];
    };

    cameraVideoSource.onCameraSourceStopped = ^(NSString *reason) {
        [weakSelf emitOnStopped:reason];
    };

    cameraVideoSource.onCameraSourceFailed = ^(NSString *code, NSString *message) {
        [weakSelf emitOnFailed:@{@"code": code, @"message": message}];
    };
#else
    cameraVideoSource.onCameraSourceStarted = ^{
        [weakSelf sendEventWithName:@"onStarted" body:nil];
    };

    cameraVideoSource.onCameraSourceStopped = ^(NSString *reason) {
        [weakSelf sendEventWithName:@"onStopped" body:reason];
    };

    cameraVideoSource.onCameraSourceFailed = ^(NSString *code, NSString *message) {
        [weakSelf sendEventWithName:@"onFailed" body:@{@"code": code, @"message": message}];
    };
#endif
}

@end
