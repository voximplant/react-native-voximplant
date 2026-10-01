//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//


#ifdef RCT_NEW_ARCH_ENABLED

#import <CoreSpec/CoreSpec.h>
@interface RNVIAudio : NativeAudioSpecBase <NativeAudioSpec>

#else

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@interface RNVIAudio : RCTEventEmitter <RCTBridgeModule>

#endif

@end

