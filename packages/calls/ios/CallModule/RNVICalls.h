//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

#ifdef RCT_NEW_ARCH_ENABLED

#import <CallsSpec/CallsSpec.h>
@interface RNVICalls : NativeCallsSpecBase <NativeCallsSpec>

#else

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@interface RNVICalls : RCTEventEmitter <RCTBridgeModule>

#endif

@end
