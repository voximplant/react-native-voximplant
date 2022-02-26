
/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVIVideoView.h"
#import <VoxImplant/VoxImplant.h>
#import "RNVICallManager.h"
#import "RNVIUtils.h"

@interface RNVIVideoView ()
@property(nonatomic, assign) NSString *videoStreamId;
@property(nonatomic, assign) NSString *scaleType;
@property(nonatomic, strong) VIVideoRendererView *videoRenderer;
@property(nonatomic, strong) VILocalVideoStream *localVideoStream;
@property(nonatomic, strong) VIRemoteVideoStream *remoteVideoStream;
@end

@implementation RNVIVideoView

- (id)init {
    self = [super init];
    if (self) {
        self.autoresizesSubviews = YES;
    }
    return self;
}

- (void)setVideoStreamId:(NSString *)videoStreamId {
    _videoStreamId = videoStreamId;
    if (_localVideoStream && _videoRenderer && !videoStreamId) {
        [_localVideoStream removeRenderer:_videoRenderer];
        _videoStreamId = videoStreamId;
        _localVideoStream = nil;
        _videoRenderer = nil;
    } else if (videoStreamId) {
        if (_localVideoStream && ![_localVideoStream.streamId isEqualToString:videoStreamId]) {
            [_localVideoStream removeRenderer:_videoRenderer];
            _localVideoStream = nil;
            _videoRenderer = nil;
        }
        _videoStreamId = videoStreamId;
        _localVideoStream = [RNVICallManager getLocalVideoStreamById:_videoStreamId];
        if (_localVideoStream) {
            _videoRenderer = [[VIVideoRendererView alloc] initWithContainerView:self];
            [_localVideoStream addRenderer:_videoRenderer];
            if (_scaleType) {
                [_videoRenderer setResizeMode:[RNVIUtils convertStringToVideoResizeMode:_scaleType]];
            }
        }
    }
    
    if (_remoteVideoStream && _videoRenderer && !videoStreamId) {
        [_remoteVideoStream removeRenderer:_videoRenderer];
        _videoStreamId = videoStreamId;
        _remoteVideoStream = nil;
        _videoRenderer = nil;
    } else if (videoStreamId) {
        if (_remoteVideoStream && ![_remoteVideoStream.streamId isEqualToString:videoStreamId]) {
            [_remoteVideoStream removeRenderer:_videoRenderer];
            _remoteVideoStream = nil;
            _videoRenderer = nil;
        }
        _videoStreamId = videoStreamId;
        _remoteVideoStream = [RNVICallManager getRemoteVideoStreamById:_videoStreamId];
        if (_remoteVideoStream) {
            _videoRenderer = [[VIVideoRendererView alloc] initWithContainerView:self];
            [_remoteVideoStream addRenderer:_videoRenderer];
            if (_scaleType) {
                [_videoRenderer setResizeMode:[RNVIUtils convertStringToVideoResizeMode:_scaleType]];
            }
        }
    }
}

- (void)setScaleType:(NSString *)scaleType {
    _scaleType = scaleType;
    if (_localVideoStream && _videoRenderer) {
        [_videoRenderer setResizeMode:[RNVIUtils convertStringToVideoResizeMode:scaleType]];
    }
    if (_remoteVideoStream && _videoRenderer) {
        [_videoRenderer setResizeMode:[RNVIUtils convertStringToVideoResizeMode:scaleType]];
    }
}

- (void)removeFromSuperview {
    if (_localVideoStream && _videoRenderer) {
        [_localVideoStream removeRenderer:_videoRenderer];
        _localVideoStream = nil;
        _videoRenderer = nil;
    }
    if (_remoteVideoStream && _videoRenderer) {
        [_remoteVideoStream removeRenderer:_videoRenderer];
        _remoteVideoStream = nil;
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
