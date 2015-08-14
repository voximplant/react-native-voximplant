//
//  VoxImplantViewManager.m
//  VoxTest
//
//  Created by Andrey Kovalenko on 02.04.15.
//  Copyright (c) 2015 Zingaya. All rights reserved.
//

#import "VoxViewManager.h"
#import "VoxView.h"


@implementation VoxImplantRendererViewManager
- (UIView *)view
{
    return [[VoxImplantRendererView alloc] init];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(previewProperty, BOOL);

@end