/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "AudioDeviceModule.h"
#import "RCTBridgeModule.h"
#import "Constants.h"


@interface AudioDeviceModule()

@end

@implementation AudioDeviceModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventAudioDeviceChanged,
             kEventAudioDeviceListChanged];
}

- (void)audioDeviceChanged:(VIAudioDevice *)audioDevice {
    
}

- (void)audioDeviceUnavailable:(VIAudioDevice *)audioDevice {
    
}

- (void)audioDevicesListChanged:(NSSet<VIAudioDevice *> *)availableAudioDevices {
    
}

@end
