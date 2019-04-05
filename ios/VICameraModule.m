/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "VICameraModule.h"
#import "RCTBridgeModule.h"
#import "Constants.h"
#import <Voximplant/VoxImplant.h>

@interface VICameraModule()
@end


@implementation VICameraModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}


RCT_EXPORT_METHOD(switchCamera:(NSString *)camera) {
    if ([camera isEqualToString:kCameraTypeBack]) {
        [VICameraManager sharedCameraManager].useBackCamera = true;
    } else if ([camera isEqualToString:kCameraTypeFront]) {
        [VICameraManager sharedCameraManager].useBackCamera = false;
    }
}

RCT_REMAP_METHOD(setCameraResolution, setCameraWidth:(int)width andHeight:(int)height) {
    AVCaptureDevicePosition position = [VICameraManager sharedCameraManager].useBackCamera ? AVCaptureDevicePositionBack : AVCaptureDevicePositionFront;
    
    NSArray<AVCaptureDevice *> *captureDevices = [[VICameraManager sharedCameraManager] captureDevices];
    AVCaptureDevice *captureDevice = captureDevices[0];
    for (AVCaptureDevice *device in captureDevices) {
        if (device.position == position) {
            captureDevice = device;
            break;
        }
    }
    NSArray<AVCaptureDeviceFormat *> *formats = [[VICameraManager sharedCameraManager] supportedFormatsForDevice:captureDevice];
    int targetWidth = width;
    int targetHeight = height;
    AVCaptureDeviceFormat *selectedFormat = nil;
    int currentDiff = INT_MAX;
    
    for (AVCaptureDeviceFormat *format in formats) {
        CMVideoDimensions dimension = CMVideoFormatDescriptionGetDimensions(format.formatDescription);
        int diff = abs(targetWidth - dimension.width) + abs(targetHeight - dimension.height);
        if (diff < currentDiff) {
            selectedFormat = format;
            currentDiff = diff;
        }
    }
    [[VICameraManager sharedCameraManager] changeCaptureFormat:selectedFormat];
}

@end
