
/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "VideoView.h"
#import <VoxImplant/VoxImplant.h>
#import "CallManager.h"
#import "Utils.h"

@interface VideoView ()
@property(nonatomic, assign) NSString *videoStreamId;
@property(nonatomic, assign) NSString *scaleType;
@property(nonatomic, strong) VIVideoRendererView *videoRenderer;
@property(nonatomic, strong) VIVideoStream *videoStream;
@end

@implementation VideoView

- (id)init {
    self = [super init];
    if (self) {
        self.autoresizesSubviews = YES;
    }
    return self;
}

- (void)setVideoStreamId:(NSString *)videoStreamId {
    _videoStreamId = videoStreamId;
    if (_videoStream && _videoRenderer && !videoStreamId) {
        [_videoStream removeRenderer:_videoRenderer];
        _videoStreamId = videoStreamId;
        _videoStream = nil;
        _videoRenderer = nil;
    } else if (videoStreamId) {
        if (_videoStream && ![_videoStream.streamId isEqualToString:videoStreamId]) {
            [_videoStream removeRenderer:_videoRenderer];
            _videoStream = nil;
            _videoRenderer = nil;
        }
        _videoStreamId = videoStreamId;
        _videoStream = [CallManager getVideoStreamById:_videoStreamId];
        if (_videoStream) {
            _videoRenderer = [[VIVideoRendererView alloc] initWithContainerView:self];
            [_videoStream addRenderer:_videoRenderer];
            if (_scaleType) {
                [_videoRenderer setResizeMode:[Utils convertStringToVideoResizeMode:_scaleType]];
            }
        }
    }
}

- (void)setScaleType:(NSString *)scaleType {
    _scaleType = scaleType;
    if (_videoStream && _videoRenderer) {
        [_videoRenderer setResizeMode:[Utils convertStringToVideoResizeMode:scaleType]];
    }
}

- (void)removeFromSuperview {
    if (_videoStream && _videoRenderer) {
        [_videoStream removeRenderer:_videoRenderer];
        _videoStream = nil;
        _videoRenderer = nil;
    }
    [super removeFromSuperview];
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    if (self.subviews.count > 0) {
        [[self.subviews objectAtIndex:0] setFrame:self.bounds];
    }
}

@end
