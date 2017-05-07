//
//  VoxImplantModule.h
//  VoxImplantModule
//
//  Copyright (c) 2011-2015 Zingaya. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else // Compatibility for RN version < 0.40
#import "RCTBridgeModule.h"
#endif

#import "VoxImplant.h"

@interface VoxImplantModule : NSObject <RCTBridgeModule, VoxImplantDelegate>

- (id)init;

@end
