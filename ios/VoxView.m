//
//  VoxRendererView.m
//  VoxTest
//
//  Created by Andrey Kovalenko on 02.04.15.
//  Copyright (c) 2015 Zingaya. All rights reserved.
//

#import "VoxView.h"
#import "VoxImplant.h"
//@import GLKit;

@interface VoxImplantRendererView ()
{
    VoxImplant* sdk;
    BOOL previewProperty;
}
@end

@implementation VoxImplantRendererView

- (id)init
{
    self = [super init];
    if (self)
    {
        sdk = [VoxImplant getInstance];
        previewProperty = NO;
        self.autoresizesSubviews = YES;
    }
    return self;
}

- (void)setPreviewProperty:(BOOL)value
{
    previewProperty = value;
}

- (void)removeFromSuperview
{
    if (previewProperty)
        [sdk setLocalPreview:nil];
    else
        [sdk setRemoteView:nil];

    [super removeFromSuperview];
}

- (void)didMoveToSuperview
{
    [super didMoveToSuperview];

    if (previewProperty)
        [sdk setLocalPreview:self];
    else
        [sdk setRemoteView:self];
}

-(void)layoutSubviews
{
    [super layoutSubviews];

    if (self.subviews.count > 0)
        [[self.subviews objectAtIndex:0] setFrame:self.bounds];
}

@end
