/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVIAudioDeviceModule.h"
#import "RCTBridgeModule.h"
#import "RNVIConstants.h"
#import "RNVIUtils.h"

@interface RNVIAudioDeviceModule()

@end

@implementation RNVIAudioDeviceModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventAudioDeviceChanged,
             kEventAudioDeviceListChanged];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [VIAudioManager sharedAudioManager].delegate = self;
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(selectAudioDevice:(NSString *)device) {
    VIAudioDevice *audioDevice = [RNVIUtils convertStringToAudioDevice:device];
    [[VIAudioManager sharedAudioManager] selectAudioDevice:audioDevice];
}

RCT_REMAP_METHOD(getAudioDevices, getAudioDevicesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSSet<VIAudioDevice *> *devices = [[VIAudioManager sharedAudioManager] availableAudioDevices];
    NSMutableArray* resultDevices = [[NSMutableArray alloc] init];
    for (VIAudioDevice* device in devices) {
        [resultDevices addObject:[RNVIUtils convertAudioDeviceToString:device]];
    }
    resolve(resultDevices);
}

RCT_REMAP_METHOD(getActiveDevice, getActiveDeviceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VIAudioDevice *device = [[VIAudioManager sharedAudioManager] currentAudioDevice];
    resolve([RNVIUtils convertAudioDeviceToString:device]);
}

RCT_EXPORT_METHOD(callKitConfigureAudioSession) {
    [[VIAudioManager sharedAudioManager] callKitConfigureAudioSession:nil];
}

RCT_EXPORT_METHOD(callKitReleaseAudioSession) {
    [[VIAudioManager sharedAudioManager] callKitReleaseAudioSession];
}

RCT_EXPORT_METHOD(callKitStartAudio) {
    [[VIAudioManager sharedAudioManager] callKitStartAudio];
}

RCT_EXPORT_METHOD(callKitStopAudio) {
    [[VIAudioManager sharedAudioManager] callKitStopAudio];
}

- (void)audioDeviceChanged:(VIAudioDevice *)audioDevice {
    [self sendEventWithName:kEventAudioDeviceChanged body:@{
                                                            kEventParamName               : kEventNameAudioDeviceChanged,
                                                            kEventParamCurrentAudioDevice : [RNVIUtils convertAudioDeviceToString:audioDevice]
                                                            }];
}

- (void)audioDeviceUnavailable:(VIAudioDevice *)audioDevice {
    
}

- (void)audioDevicesListChanged:(NSSet<VIAudioDevice *> *)availableAudioDevices {
    NSMutableArray* resultDevices = [[NSMutableArray alloc] init];
    for (VIAudioDevice* device in availableAudioDevices) {
        [resultDevices addObject:[RNVIUtils convertAudioDeviceToString:device]];
    }
    [self sendEventWithName:kEventAudioDeviceListChanged body:@{
                                                                kEventParamName       : kEventNameAudioDeviceChanged,
                                                                kEventParamDeviceList : resultDevices
                                                                }];
}

@end
