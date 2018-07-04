/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "Utils.h"
#import "Constants.h"

@implementation Utils

+ (NSData *)dataFromHexString:(NSString *)string {
    NSMutableData *data = [NSMutableData dataWithCapacity: string.length / 2];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    for (int i = 0; i < string.length / 2; i++) {
        byte_chars[0] = [string characterAtIndex:i*2];
        byte_chars[1] = [string characterAtIndex:i*2+1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [data appendBytes:&whole_byte length:1];
    }
    return data;
}

+ (NSString *)convertIntToCallError:(NSInteger)code {
    switch (code) {
        case 10004:
            return kCallErrorRejected;
        case 10005:
            return kCallErrorTimeout;
        case 10007:
            return kCallErrorMediaIsOnHold;
        case 10008:
            return kCallErrorAlreadyInThisState;
        default:
            return kCallErrorInternal;
    }
}

+ (VIVideoResizeMode)convertStringToVideoResizeMode:(NSString *)mode {
    if ([mode isEqual:kScaleTypeFill]) {
        return VIVideoResizeModeFill;
    } else {
        return VIVideoResizeModeFit;
    }
}

+ (VIAudioDevice *)convertStringToAudioDevice:(NSString *)device {
    if (!device) {
        return nil;
    }
    if ([device isEqualToString:kAudioDeviceEarpiece]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeReceiver];
    }
    if ([device isEqualToString:kAudioDeviceSpeaker]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeSpeaker];
    }
    if ([device isEqualToString:kAudioDeviceWired]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeWired];
    }
    if ([device isEqualToString:kAudioDeviceBluetooth]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeBluetooth];
    }
    return [VIAudioDevice deviceWithType:VIAudioDeviceTypeNone];
}

+ (NSString *)convertAudioDeviceToString:(VIAudioDevice *)device {
    switch (device.type) {
        case VIAudioDeviceTypeReceiver:
            return kAudioDeviceEarpiece;
        case VIAudioDeviceTypeSpeaker:
            return kAudioDeviceSpeaker;
        case VIAudioDeviceTypeWired:
            return kAudioDeviceWired;
        case VIAudioDeviceTypeBluetooth:
            return kAudioDeviceBluetooth;
        default:
            return kAudioDeviceNone;
    }
}

@end
