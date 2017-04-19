//
//  VoxImplantViewManager.h
//  VoxTest
//
//  Created by Andrey Kovalenko on 02.04.15.
//  Copyright (c) 2015 Zingaya. All rights reserved.
//

#if __has_include(<React/RCTViewManager.h>)
#import <React/RCTViewManager.h>
#else // Compatibility for RN version < 0.40
#import "RCTViewManager.h"
#endif

@interface VoxImplantRendererViewManager : RCTViewManager
@end

