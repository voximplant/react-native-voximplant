//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

#import "RNVICalls.h"

#if __has_include("react_native_voximplant_calls-Swift.h")
#import "react_native_voximplant_calls-Swift.h"
#else
#import "react_native_voximplant_calls/react_native_voximplant_core-Swift.h"
#endif

@interface RNVICalls () <CallDelegate, ConferenceDelegate, EndpointDelegate>
@end

@implementation RNVICalls {
    CallManager *callManager;
}

- (instancetype)init {
    if (self = [super init]) {
        callManager = [CallManager shared];
        callManager.callDelegate = self;
        callManager.conferenceDelegate = self;
        callManager.endpointDelegate = self;
    }
    return self;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule: (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeCallsSpecJSI>(params);
}

+ (NSString *)moduleName {
    return @"RNVICalls";
}

- (NSString * _Nullable)createCall:(nonnull NSString *)destination settings:(JS::NativeCalls::CallSettingsDTO &)settings {
    NSMutableDictionary *settingsDict = [NSMutableDictionary dictionary];
    [settingsDict setValue:settings.customData() forKey:@"customData"];
    [settingsDict setValue:settings.extraHeaders() forKey:@"extraHeaders"];
    [settingsDict setValue:settings.localVideoStream() forKey:@"localVideoStream"];
    [settingsDict setValue:settings.preferredVideoCodec() forKey:@"preferredVideoCodec"];
    if (auto receiveVideo = settings.receiveVideo(); receiveVideo.has_value()) {
        settingsDict[@"receiveVideo"] = @(receiveVideo.value());
    }
    if (auto statsCollectionInterval = settings.statsCollectionInterval(); statsCollectionInterval.has_value()) {
        settingsDict[@"statsCollectionInterval"] = @(statsCollectionInterval.value());
    }
    return [callManager createCallWithDestination:destination settings:settingsDict] ?: nil;
}

- (nonnull NSString *)getCallState:(nonnull NSString *)id {
    return [callManager getCallStateWithId:id];
}

- (nonnull NSString *)getCallDirection:(nonnull NSString *)id {
    return [callManager getCallDirectionWithId:id];
}

- (nonnull NSArray<NSString *> *)getCalls {
    return [callManager calls];
}

- (nonnull NSNumber *)hasCall:(nonnull NSString *)id {
    return @([callManager hasCallWithId:id]);
}

- (nonnull NSNumber *)getDuration:(nonnull NSString *)id {
    return @([callManager getDurationWithId:id]);
}

- (nonnull NSNumber *)getIsMuted:(nonnull NSString *)id {
    return @([callManager getIsMutedWithId:id]);
}

- (nonnull NSNumber *)getIsOnHold:(nonnull NSString *)id {
    return @([callManager getIsOnHoldWithId:id]);
}

- (nonnull NSArray<id<NSObject>> *)getLocalVideoStreams:(nonnull NSString *)id {
    return [callManager getLocalVideoStreamsWithId:id];
}

- (NSDictionary * _Nullable)getLocalVideoStream:(nonnull NSString *)id
                                       streamId:(nonnull NSString *)streamId {
    return [callManager getLocalVideoStreamWithId:id streamId:streamId];
}

- (NSString * _Nullable)getRemoteDisplayName:(nonnull NSString *)id {
    return [callManager getRemoteDisplayNameWithId:id];
}

- (NSString * _Nullable)getRemoteUsername:(nonnull NSString *)id {
    return [callManager getRemoteUsernameWithId:id];
}

- (nonnull NSArray<NSString *> *)getRemoteVideoStreams:(nonnull NSString *)id {
    return [callManager getRemoteVideoStreamsWithId:id];
}

- (nonnull NSNumber *)hasRemoteVideoStreamForCall:(nonnull NSString *)id
                                         streamId:(nonnull NSString *)streamId {
    return @([callManager hasRemoteVideoStreamForCallWithId:id streamId:streamId]);
}

- (void)sendInfo:(nonnull NSString *)id params:(JS::NativeCalls::SendInfoParams &)params {
    NSString *mimeType = params.mimeType();
    NSString *body = params.body();
    NSDictionary<NSString *, NSString *> *headers = (NSDictionary<NSString *, NSString *> *)params.headers();
    [callManager sendInfoWithId:id body:body mimeType:mimeType headers:headers];
}

- (NSString * _Nullable)createConference:(nonnull NSString *)conferenceName settings:(JS::NativeCalls::ConferenceSettingsDTO &)settings {
    NSMutableDictionary *settingsDict = [NSMutableDictionary dictionary];
    [settingsDict setValue:settings.customData() forKey:@"customData"];
    [settingsDict setValue:settings.extraHeaders() forKey:@"extraHeaders"];
    [settingsDict setValue:settings.localVideoStream() forKey:@"localVideoStream"];
    [settingsDict setValue:settings.preferredVideoCodec() forKey:@"preferredVideoCodec"];
    if (auto muteAudio = settings.muteAudio(); muteAudio.has_value()) {
        settingsDict[@"muteAudio"] = @(muteAudio.value());
    }
    if (auto statsCollectionInterval = settings.statsCollectionInterval(); statsCollectionInterval.has_value()) {
        settingsDict[@"statsCollectionInterval"] = @(statsCollectionInterval.value());
    }
    return [callManager createConfWithConfName:conferenceName settings:settingsDict];
}

- (nonnull NSArray<NSString *> *)getAudioStreamsForEndpoint:(nonnull NSString *)id {
    return [callManager getAudioStreamsForEndpointWithId:id];
}

- (nonnull NSArray<NSString *> *)getConferences {
    return [callManager conferences];
}

- (nonnull NSNumber *)hasConference:(nonnull NSString *)id {
    return @([callManager hasConferenceWithId:id]);
}

- (NSString * _Nullable)getDisplayNameForEndpoint:(nonnull NSString *)id {
    return [callManager getDisplayNameForEndpointWithId:id];
}

- (NSString * _Nullable)getEndpointIdForConference:(nonnull NSString *)id {
    return [callManager getEndpointIdForConferenceWithId:id];
}

- (nonnull NSArray<NSString *> *)getEndpointsForConference:(nonnull NSString *)id {
    return [callManager getEndpointsForConferenceWithId:id];
}

- (nonnull NSNumber *)hasEndpointForConference:(nonnull NSString *)id
                                    endpointId:(nonnull NSString *)endpointId {
    return @([callManager hasEndpointForConferenceWithId:id endpointId:endpointId]);
}
- (nonnull NSNumber *)hasAudioStreamForEndpoint:(nonnull NSString *)id
                                       streamId:(nonnull NSString *)streamId {
    return @([callManager hasAudioStreamForEndpointWithId:id streamId:streamId]);
}
- (nonnull NSNumber *)hasVideoStreamForEndpoint:(nonnull NSString *)id
                                       streamId:(nonnull NSString *)streamId {
    return @([callManager hasVideoStreamForEndpointWithId:id streamId:streamId]);
}

- (nonnull NSNumber *)getIsMutedForEndpoint:(nonnull NSString *)id {
    return @([callManager getIsMutedWithId:id]);
}

- (nonnull NSNumber *)getIsVoiceActivityDetectedForEndpoint:(nonnull NSString *)id {
    return @([callManager getIsVoiceActivityDetectedForEndpointWithId:id]);
}

- (NSString * _Nullable)getSipUriForEndpoint:(nonnull NSString *)id {
    return [callManager getSipUriForEndpointWithId:id];
}

- (nonnull NSString *)getStateForConference:(nonnull NSString *)id {
    return [callManager getConfStateWithId:id];
}

- (NSString * _Nullable)getUsernameForEndpoint:(nonnull NSString *)id {
    return [callManager getUsernameForEndpointWithId:id];
}

- (nonnull NSArray<NSString *> *)getVideoStreamsForEndpoint:(nonnull NSString *)id {
    return [callManager getVideoStreamsForEndpointWithId:id];
}

- (void)answer:(nonnull NSString *)id settings:(JS::NativeCalls::CallSettingsDTO &)settings {
    NSMutableDictionary *settingsDict = [NSMutableDictionary dictionary];
    [settingsDict setValue:settings.customData() forKey:@"customData"];
    [settingsDict setValue:settings.extraHeaders() forKey:@"extraHeaders"];
    [settingsDict setValue:settings.localVideoStream() forKey:@"localVideoStream"];
    [settingsDict setValue:settings.preferredVideoCodec() forKey:@"preferredVideoCodec"];
    if (auto receiveVideo = settings.receiveVideo(); receiveVideo.has_value()) {
        settingsDict[@"receiveVideo"] = @(receiveVideo.value());
    }
    if (auto statsCollectionInterval = settings.statsCollectionInterval(); statsCollectionInterval.has_value()) {
        settingsDict[@"statsCollectionInterval"] = @(statsCollectionInterval.value());
    }
    [callManager answerWithId:id settings:settingsDict];
}

- (void)requestVideoSizeForEndpoint:(nonnull NSString *)id
                           streamId:(nonnull NSString *)streamId
                               size:(JS::NativeCalls::VideoResolution &)size
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
    NSDictionary *sizeDict = @{
        @"width": @(size.width()),
        @"height": @(size.height()),
    };
    [callManager requestVideoSizeForEndpointWithId:id streamId:streamId size:sizeDict resolve:resolve reject:reject];
}

#else

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(createCall:(nonnull NSString *)destination settings:(NSDictionary * _Nullable)settings) {
    return [callManager createCallWithDestination:destination settings:settings];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCallState:(nonnull NSString *)id) {
    return [callManager getCallStateWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCallDirection:(nonnull NSString *)id) {
    return [callManager getCallDirectionWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCalls) {
    return [callManager calls];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasCall:(nonnull NSString *)id) {
    return @([callManager hasCallWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDuration:(nonnull NSString *)id) {
    return @([callManager getDurationWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getIsMuted:(nonnull NSString *)id) {
    return @([callManager getIsMutedWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getIsOnHold:(nonnull NSString *)id) {
    return @([callManager getIsOnHoldWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocalVideoStreams:(nonnull NSString *)id) {
    return [callManager getLocalVideoStreamsWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getLocalVideoStream:(nonnull NSString *)id
                                                  streamId:(nonnull NSString *)streamId) {
    return [callManager getLocalVideoStreamWithId:id streamId:streamId];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getRemoteDisplayName:(nonnull NSString *)id) {
    return [callManager getRemoteDisplayNameWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getRemoteUsername:(nonnull NSString *)id) {
    return [callManager getRemoteUsernameWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getRemoteVideoStreams:(nonnull NSString *)id) {
    return [callManager getRemoteVideoStreamsWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasRemoteVideoStreamForCall:(nonnull NSString *)id
                                                          streamId:(nonnull NSString *)streamId) {
    return @([callManager hasRemoteVideoStreamForCallWithId:id streamId:streamId]);
}


RCT_EXPORT_METHOD(sendInfo:(nonnull NSString *)id params:(nonnull NSDictionary *)params) {
    NSString *mimeType = params[@"mimeType"];
    NSString *body = params[@"body"];
    NSDictionary<NSString *, NSString *> *headers = params[@"headers"];
    [callManager sendInfoWithId:id body:body mimeType:mimeType headers:headers];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(createConference:(nonnull NSString *)conferenceName settings:(NSDictionary * _Nullable)settings) {
    return [callManager createConfWithConfName:conferenceName settings:settings];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAudioStreamsForEndpoint:(nonnull NSString *)id) {
    return [callManager getAudioStreamsForEndpointWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getConferences) {
    return [callManager conferences];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasConference:(nonnull NSString *)id) {
    return @([callManager hasConferenceWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDisplayNameForEndpoint:(nonnull NSString *)id) {
    return [callManager getDisplayNameForEndpointWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getEndpointIdForConference:(nonnull NSString *)id) {
    return [callManager getEndpointIdForConferenceWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getEndpointsForConference:(nonnull NSString *)id) {
    return [callManager getEndpointsForConferenceWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasEndpointForConference:(nonnull NSString *)id
                                                     endpointId:(nonnull NSString *)endpointId) {
    return @([callManager hasEndpointForConferenceWithId:id endpointId:endpointId]);
}
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasAudioStreamForEndpoint:(nonnull NSString *)id
                                                        streamId:(nonnull NSString *)streamId) {
    return @([callManager hasAudioStreamForEndpointWithId:id streamId:streamId]);
}
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(hasVideoStreamForEndpoint:(nonnull NSString *)id
                                                        streamId:(nonnull NSString *)streamId) {
    return @([callManager hasVideoStreamForEndpointWithId:id streamId:streamId]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getIsMutedForEndpoint:(nonnull NSString *)id) {
    return @([callManager getIsMutedWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getIsVoiceActivityDetectedForEndpoint:(nonnull NSString *)id) {
    return @([callManager getIsVoiceActivityDetectedForEndpointWithId:id]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSipUriForEndpoint:(nonnull NSString *)id) {
    return [callManager getSipUriForEndpointWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getStateForConference:(nonnull NSString *)id) {
    return [callManager getConfStateWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getUsernameForEndpoint:(nonnull NSString *)id) {
    return [callManager getUsernameForEndpointWithId:id];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getVideoStreamsForEndpoint:(nonnull NSString *)id) {
    return [callManager getVideoStreamsForEndpointWithId:id];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        // VICallManager
        @"onIncomingCall",

        // VICall
        @"onCallStartRinging",
        @"onCallConnected",
        @"onCallStopRinging",
        @"onCallDisconnected",
        @"onCallFailed",
        @"onCallMessageReceived",
        @"onCallInfoReceived",
        @"onCallRemoteVideoStreamAdded",
        @"onCallRemoteVideoStreamRemoved",
        @"onCallReconnecting",
        @"onCallReconnected",
        @"onCallStatsReceived",

        // VIConference
        @"onConferenceConnected",
        @"onConferenceDisconnected",
        @"onConferenceFailed",
        @"onConferenceReconnecting",
        @"onConferenceReconnected",
        @"onConferenceStatsReceived",
        @"onConferenceEndpointAdded",
        @"onConferenceEndpointRemoved",
        @"onConferenceMessageReceived",
        @"onConferenceInfoReceived",
        @"onConferenceLocalVoiceActivityChanged",

        // VIEndpoint
        @"onEndpointRemoteVideoStreamAdded",
        @"onEndpointRemoteVideoStreamRemoved",
        @"onEndpointVoiceActivityChanged",
        @"onEndpointMuteStateChanged",
        @"onEndpointStartReceivingVideoStream",
        @"onEndpointStopReceivingVideoStream",
    ];
}

RCT_EXPORT_METHOD(answer:(nonnull NSString *)id settings:(NSDictionary * _Nullable)settings){
    [callManager answerWithId:id settings:settings];
}

RCT_EXPORT_METHOD(requestVideoSizeForEndpoint:(nonnull NSString *)id streamId:(nonnull NSString *)streamId size:(nonnull NSDictionary *)size resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [callManager requestVideoSizeForEndpointWithId:id streamId:streamId size:size resolve:resolve reject:reject];
}

#endif

RCT_EXPORT_METHOD(hangup:(nonnull NSString *)id headers:(NSDictionary * _Nullable)headers) {
    [callManager hangupWithId:id headers:(NSDictionary<NSString *, NSString *> *)headers];
}

RCT_EXPORT_METHOD(hold:(nonnull NSString *)id enable:(BOOL)enable resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [callManager holdWithId:id enable:enable resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(mute:(nonnull NSString *)id value:(BOOL)value) {
    [callManager muteWithId:id value:value];
}

RCT_EXPORT_METHOD(reject:(nonnull NSString *)id mode:(nonnull NSString *)mode headers:(NSDictionary * _Nullable)headers) {
    [callManager rejectWithId:id mode:mode headers:headers];
}

RCT_EXPORT_METHOD(sendDTMF:(nonnull NSString *)id tones:(nonnull NSString *)tones) {
    [callManager sendDTMFWithId:id tones:tones];
}

RCT_EXPORT_METHOD(sendMessage:(nonnull NSString *)id text:(nonnull NSString *)text) {
    [callManager sendMessageWithId:id text:text];
}

RCT_EXPORT_METHOD(start:(nonnull NSString *)id) {
    [callManager startCallWithId:id];
}

RCT_EXPORT_METHOD(startSendingVideo:(nonnull NSString *)id streamId:(nonnull NSString *)streamId resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [callManager startSendingVideoWithId:id streamId:streamId resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(stopSendingVideo:(nonnull NSString *)id resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    [callManager stopSendingVideoWithId:id resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(joinForConference:(nonnull NSString *)id) {
    [callManager joinConferenceWithId:id];
}

RCT_EXPORT_METHOD(startReceivingVideoForEndpoint:(nonnull NSString *)id streamId:(nonnull NSString *)streamId) {
    [callManager startReceivingVideoForEndpointWithId:id streamId:streamId];
}

RCT_EXPORT_METHOD(stopReceivingVideoForEndpoint:(nonnull NSString *)id streamId:(nonnull NSString *)streamId) {
    [callManager stopReceivingVideoForEndpointWithId:id streamId:streamId];
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - CallDelegate

- (void)didReceiveIncomingCall:(NSDictionary *)payload {
    [self emitOnIncomingCall:payload];
}

- (void)callDidStartRinging:(NSDictionary *)payload {
    [self emitOnCallStartRinging:payload];
}

- (void)callDidConnect:(NSDictionary *)payload {
    [self emitOnCallConnected:payload];
}

- (void)callDidStopRinging:(NSDictionary *)payload {
    [self emitOnCallStopRinging:payload];
}

- (void)callDidDisconnect:(NSDictionary *)payload {
    [self emitOnCallDisconnected:payload];
}

- (void)callDidFail:(NSDictionary *)payload {
    [self emitOnCallFailed:payload];
}

- (void)callDidReceiveMessage:(NSDictionary *)payload {
    [self emitOnCallMessageReceived:payload];
}

- (void)callDidReceiveInfo:(NSDictionary *)payload {
    [self emitOnCallInfoReceived:payload];
}

- (void)callDidAddRemoteVideoStream:(NSDictionary *)payload {
    [self emitOnCallRemoteVideoStreamAdded:payload];
}

- (void)callDidRemoveRemoteVideoStream:(NSDictionary *)payload {
    [self emitOnCallRemoteVideoStreamRemoved:payload];
}

- (void)callDidStartReconnecting:(NSDictionary *)payload {
    [self emitOnCallReconnecting:payload];
}

- (void)callDidReconnect:(NSDictionary *)payload {
    [self emitOnCallReconnected:payload];
}

- (void)callDidReceiveStatistics:(NSDictionary *)payload {
    [self emitOnCallStatsReceived:payload];
}

#pragma mark - ConferenceDelegate

- (void)conferenceDidConnect:(NSDictionary *)payload {
    [self emitOnConferenceConnected:payload];
}

- (void)conferenceDidDisconnect:(NSDictionary *)payload {
    [self emitOnConferenceDisconnected:payload];
}

- (void)conferenceDidFail:(NSDictionary *)payload {
    [self emitOnConferenceFailed:payload];
}

- (void)conferenceDidAddEndpoint:(NSDictionary *)payload {
    [self emitOnConferenceEndpointAdded:payload];
}

- (void)conferenceDidRemoveEndpoint:(NSDictionary *)payload {
    [self emitOnConferenceEndpointRemoved:payload];
}

- (void)conferenceDidReceiveMessage:(NSDictionary *)payload {
    [self emitOnConferenceMessageReceived:payload];
}

- (void)conferenceDidReceiveInfo:(NSDictionary *)payload {
    [self emitOnConferenceInfoReceived:payload];
}

- (void)conferenceDidStartReconnecting:(NSDictionary *)payload {
    [self emitOnConferenceReconnecting:payload];
}

- (void)conferenceDidReconnect:(NSDictionary *)payload {
    [self emitOnConferenceReconnected:payload];
}

- (void)conferenceDidDetectLocalVoiceActivityChange:(NSDictionary *)payload {
    [self emitOnConferenceLocalVoiceActivityChanged:payload];
}

- (void)conferenceDidReceiveStatistics:(NSDictionary *)payload {
    [self emitOnConferenceStatsReceived:payload];
}

#pragma mark - EndpointDelegate

- (void)endpointDidAddRemoteVideoStream:(NSDictionary *)payload {
    [self emitOnEndpointRemoteVideoStreamAdded:payload];
}

- (void)endpointDidRemoveRemoteVideoStream:(NSDictionary *)payload {
    [self emitOnEndpointRemoteVideoStreamRemoved:payload];
}

- (void)endpointDidDetectVoiceActivityChange:(NSDictionary *)payload {
    [self emitOnEndpointVoiceActivityChanged:payload];
}

- (void)endpointDidChangeMuteStatus:(NSDictionary *)payload {
    [self emitOnEndpointMuteStateChanged:payload];
}

- (void)endpointDidStartReceivingVideoStream:(NSDictionary *)payload {
    [self emitOnEndpointStartReceivingVideoStream:payload];
}

- (void)endpointDidStopReceivingVideoStream:(NSDictionary *)payload {
    [self emitOnEndpointStopReceivingVideoStream:payload];
}

#else

#pragma mark - CallDelegate

- (void)didReceiveIncomingCall:(NSDictionary *)payload {
    [self sendEventWithName:@"onIncomingCall" body:payload];
}

- (void)callDidStartRinging:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallStartRinging" body:payload];
}

- (void)callDidConnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallConnected" body:payload];
}

- (void)callDidStopRinging:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallStopRinging" body:payload];
}

- (void)callDidDisconnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallDisconnected" body:payload];
}

- (void)callDidFail:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallFailed" body:payload];
}

- (void)callDidReceiveMessage:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallMessageReceived" body:payload];
}

- (void)callDidReceiveInfo:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallInfoReceived" body:payload];
}

- (void)callDidAddRemoteVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallRemoteVideoStreamAdded" body:payload];
}

- (void)callDidRemoveRemoteVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallRemoteVideoStreamRemoved" body:payload];
}

- (void)callDidStartReconnecting:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallReconnecting" body:payload];
}

- (void)callDidReconnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallReconnected" body:payload];
}

- (void)callDidReceiveStatistics:(NSDictionary *)payload {
    [self sendEventWithName:@"onCallStatsReceived" body:payload];
}

#pragma mark - ConferenceDelegate

- (void)conferenceDidConnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceConnected" body:payload];
}

- (void)conferenceDidDisconnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceDisconnected" body:payload];
}

- (void)conferenceDidFail:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceFailed" body:payload];
}

- (void)conferenceDidAddEndpoint:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceEndpointAdded" body:payload];
}

- (void)conferenceDidRemoveEndpoint:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceEndpointRemoved" body:payload];
}

- (void)conferenceDidReceiveMessage:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceMessageReceived" body:payload];
}

- (void)conferenceDidReceiveInfo:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceInfoReceived" body:payload];
}

- (void)conferenceDidStartReconnecting:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceReconnecting" body:payload];
}

- (void)conferenceDidReconnect:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceReconnected" body:payload];
}

- (void)conferenceDidDetectLocalVoiceActivityChange:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceLocalVoiceActivityChanged" body:payload];
}

- (void)conferenceDidReceiveStatistics:(NSDictionary *)payload {
    [self sendEventWithName:@"onConferenceStatsReceived" body:payload];
}

#pragma mark - EndpointDelegate

- (void)endpointDidAddRemoteVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointRemoteVideoStreamAdded" body:payload];
}

- (void)endpointDidRemoveRemoteVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointRemoteVideoStreamRemoved" body:payload];
}

- (void)endpointDidDetectVoiceActivityChange:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointVoiceActivityChanged" body:payload];
}

- (void)endpointDidChangeMuteStatus:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointMuteStateChanged" body:payload];
}

- (void)endpointDidStartReceivingVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointStartReceivingVideoStream" body:payload];
}

- (void)endpointDidStopReceivingVideoStream:(NSDictionary *)payload {
    [self sendEventWithName:@"onEndpointStopReceivingVideoStream" body:payload];
}

#endif

@end
