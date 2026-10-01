//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//


#ifdef RCT_NEW_ARCH_ENABLED

#import <CoreSpec/CoreSpec.h>
@interface RNVICore : NativeCoreSpecBase <NativeCoreSpec>

#else

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@interface RNVICore : RCTEventEmitter <RCTBridgeModule>

#endif

@end
