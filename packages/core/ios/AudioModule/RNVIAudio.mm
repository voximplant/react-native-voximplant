//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

#import "RNVIAudio.h"

#if __has_include("react_native_voximplant_core-Swift.h")
#import "react_native_voximplant_core-Swift.h"
#else
#import "react_native_voximplant_core/react_native_voximplant_core-Swift.h"
#endif

@implementation RNVIAudio {
    AudioImpl *audioImpl;
}

- (instancetype)init {
    if (self = [super init]) {
        audioImpl = [AudioImpl new];
    }
    [self setupCallbacks];
    return self;
}

#ifdef RCT_NEW_ARCH_ENABLED

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeAudioSpecJSI>(params);
}

+ (NSString *)moduleName {
    return @"RNVIAudio";
}

- (nonnull NSArray<NSDictionary *> *)getDevices {
    return [audioImpl deviceList];
}

- (NSDictionary * _Nullable)getDevice:(nonnull NSString *)id {
    return [audioImpl getDeviceWithId:id];
}

- (nonnull NSNumber *)hasDevice:(nonnull NSString *)id {
    return @([audioImpl hasDeviceWithId:id]);
}

- (NSDictionary * _Nullable)getSelectedDevice {
    return [audioImpl currentDevice];
}

- (void)selectDevice:(JS::NativeAudio::AudioDevice &)device
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    NSString *deviceId = device.id_();
    if (!deviceId) { return; }
    [audioImpl selectDeviceWithId:deviceId resolve:resolve reject:reject];
}

#else

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDevices) {
    return [audioImpl deviceList];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDevice:(nonnull NSString *)id) {
    return [audioImpl getDeviceWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasDevice:(nonnull NSString *)id) {
    return @([audioImpl hasDeviceWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSelectedDevice) {
    return [audioImpl currentDevice];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"onAudioDeviceChanged",
        @"onAudioDeviceListChanged",
    ];
}

RCT_EXPORT_METHOD(selectDevice:(nonnull NSDictionary *)device
                  resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {
    NSString *deviceId = device[@"id"];
    if (!deviceId) { return; }
    [audioImpl selectDeviceWithId:deviceId resolve:resolve reject:reject];
}

#endif

RCT_EXPORT_METHOD(callKitProviderDidActivateAudioSession) {
    [audioImpl callKitProviderDidActivateAudioSession];
}

RCT_EXPORT_METHOD(callKitProviderDidDeactivateAudioSession) {
    [audioImpl callKitProviderDidDeactivateAudioSession];
}

RCT_EXPORT_METHOD(setDefaultDeviceType:(NSString *)deviceType) {
    // Android only implementation
}

- (void)setupCallbacks {
    __weak __typeof(self) weakSelf = self;

#ifdef RCT_NEW_ARCH_ENABLED
    audioImpl.onAudioDeviceChanged = ^(NSDictionary *device) {
        [weakSelf emitOnAudioDeviceChanged:device];
    };
    
    audioImpl.onAudioDeviceListChanged = ^(NSArray<NSDictionary *> *devices) {
        [weakSelf emitOnAudioDeviceListChanged:devices];
    };
#else
    audioImpl.onAudioDeviceChanged = ^(NSDictionary *device) {
        [weakSelf sendEventWithName:@"onAudioDeviceChanged" body:device];
    };

    audioImpl.onAudioDeviceListChanged = ^(NSArray<NSDictionary *> *devices) {
        [weakSelf sendEventWithName:@"onAudioDeviceListChanged" body:devices];
    };
#endif
}

@end
