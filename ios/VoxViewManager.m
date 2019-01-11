/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

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