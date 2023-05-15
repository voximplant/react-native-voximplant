/*
 * Copyright (c) 2011-2023, Zingaya, Inc. All rights reserved.
 */

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNVIVideoView.h"
#import "RNVIVideoViewImpl.h"

#import <react/renderer/components/RNVoximplantSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNVoximplantSpec/EventEmitters.h>
#import <react/renderer/components/RNVoximplantSpec/Props.h>
#import <react/renderer/components/RNVoximplantSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNVIVideoView () <RCTRNVIVideoViewViewProtocol>

@end

@implementation RNVIVideoView {
    RNVIVideoViewImpl * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
    return concreteComponentDescriptorProvider<RNVIVideoViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNVIVideoViewProps>();
    _props = defaultProps;

    _view = [[RNVIVideoViewImpl alloc] init];

    self.contentView = _view;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
    const auto &oldViewProps = *std::static_pointer_cast<RNVIVideoViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RNVIVideoViewProps const>(props);
    if (oldViewProps.videoStreamId != newViewProps.videoStreamId) {
        NSString *videoStreamId = [[NSString alloc] initWithUTF8String:newViewProps.videoStreamId.c_str()];
        [_view setVideoStreamId:videoStreamId];
    }

    if (oldViewProps.scaleType != newViewProps.scaleType) {
        NSString *scaleType = [[NSString alloc] initWithUTF8String:newViewProps.scaleType.c_str()];
        [_view setScaleType:scaleType];
    }
    [super updateProps:props oldProps:oldProps];
}

Class<RCTComponentViewProtocol> RNVIVideoViewCls(void)
{
  return RNVIVideoView.class;
}

@end
#endif
