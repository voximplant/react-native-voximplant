//
//  VoxRendererView.h
//  VoxTest
//
//  Created by Andrey Kovalenko on 02.04.15.
//  Copyright (c) 2015 Zingaya. All rights reserved.
//

#import <UIKit/UIKit.h>
#if __has_include(<React/RCTView.h>)
#import <React/RCTView.h>
#else // Compatibility for RN version < 0.40
#import "RCTView.h"
#endif

@interface VoxImplantRendererView : RCTView

@end
