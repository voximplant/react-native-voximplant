/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import "RNVICallModule.h"
#import "RCTBridgeModule.h"
#import "RCTConvert.h"
#import "RNVIConstants.h"
#import "RNVICallManager.h"
#import "RNVIUtils.h"

@implementation RCTConvert (VIVideoCodec)
RCT_ENUM_CONVERTER(VIVideoCodec, (@{
                                    @"VP8"  : @(VIVideoCodecVP8),
                                    @"H264" : @(VIVideoCodecH264),
                                    @"AUTO" : @(VIVideoCodecAuto),
                                    }), VIVideoCodecAuto, integerValue)
@end

@interface RNVICallModule()

@end

@implementation RNVICallModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventCallConnected,
             kEventCallDisconnected,
             kEventCallEndpointAdded,
             kEventCallFailed,
             kEventCallICETimeout,
             kEventCallICECompleted,
             kEventCallLocalVideoStreamAdded,
             kEventCallLocalVideoStreamRemoved,
             kEventCallInfoReceived,
             kEventCallMessageReceived,
             kEventCallProgressToneStart,
             kEventCallProgressToneStop,
             kEventEndpointInfoUpdate,
             kEventEndpointRemoved,
             kEventEndpointRemoteStreamAdded,
             kEventEndpointRemoteStreamRemoved,
             kEventCallReconnecting,
             kEventCallReconnected];
}

RCT_EXPORT_METHOD(internalSetup:(NSString *)callId) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call addDelegate:self];
    }
}

RCT_REMAP_METHOD(answer,
                 answerCall:(NSString *)callId
                 withVideoSettings:(NSDictionary *)videoFlags
                 withHVideoCodec:(VIVideoCodec)videoCodec
                 customData:(NSString *)customData
                 headers:(NSDictionary *)headers) {
    VICall *call = [RNVICallManager getCallById:callId];
    VICallSettings *callSettings = [[VICallSettings alloc] init];
    callSettings.customData = customData;
    callSettings.extraHeaders = headers;
    callSettings.videoFlags = [VIVideoFlags videoFlagsWithReceiveVideo:[[videoFlags valueForKey:@"receiveVideo"] boolValue]
                                                             sendVideo:[[videoFlags valueForKey:@"sendVideo"] boolValue]];
    callSettings.preferredVideoCodec = videoCodec;
    if (call) {
        [call answerWithSettings:callSettings];
    }
}

RCT_EXPORT_METHOD(decline:(NSString *)callId headers:(NSDictionary *)headers) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call rejectWithMode:VIRejectModeDecline headers:headers];
    }
}

RCT_EXPORT_METHOD(reject:(NSString *)callId headers:(NSDictionary *)headers) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call rejectWithMode:VIRejectModeBusy headers:headers];
    }
}

RCT_EXPORT_METHOD(sendAudio:(NSString *)callId enable:(BOOL)enable) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        call.sendAudio = enable;
    }
}

RCT_EXPORT_METHOD(sendDTMF:(NSString *)callId tone:(NSString *)tone) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call sendDTMF:tone];
    }
}

RCT_EXPORT_METHOD(hangup:(NSString *)callId headers:(NSDictionary *)headers) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call hangupWithHeaders:headers];
    }
}

RCT_EXPORT_METHOD(sendMessage:(NSString *)callId message:(NSString *)message) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call sendMessage:message];
    }
}

RCT_EXPORT_METHOD(sendInfo:(NSString *)callId mimeType:(NSString *)mimeType body:(NSString *)body headers:(NSDictionary *)headers) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call sendInfo:body mimeType:mimeType headers:headers];
    }
}

RCT_REMAP_METHOD(sendVideo, sendVideo:(NSString *)callId enable:(BOOL)enable resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call setSendVideo:enable completion:^(NSError * _Nullable error) {
            if (error) {
                reject([RNVIUtils convertIntToCallError:error.code], [error.userInfo objectForKey:@"reason"], error);
            } else {
                resolve([NSNull null]);
            }
        }];
    }
}

RCT_REMAP_METHOD(hold, hold:(NSString *)callId enable:(BOOL)enable resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call setHold:enable completion:^(NSError * _Nullable error) {
            if (error) {
                reject([RNVIUtils convertIntToCallError:error.code], [error.userInfo objectForKey:@"reason"], error);
            } else {
                resolve([NSNull null]);
            }
        }];
    }
}

RCT_REMAP_METHOD(receiveVideo, receiveVideo:(NSString *)callId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call startReceiveVideoWithCompletion:^(NSError * _Nullable error) {
            if (error) {
                reject([RNVIUtils convertIntToCallError:error.code], [error.userInfo objectForKey:@"reason"], error);
            } else {
                resolve([NSNull null]);
            }
        }];
    }
}

RCT_EXPORT_METHOD(getCallDuration:(NSString *)callId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        NSTimeInterval interval = [call duration];
        NSNumber *intervalInSeconds = [NSNumber numberWithInt:interval];
        resolve(intervalInSeconds);
    } else {
        reject(kCallErrorInternal, @"Call.getDuration(): call is no more unavailable, already ended or failed", nil);
    }
}

- (void)call:(VICall *)call didConnectWithHeaders:(NSDictionary *)headers {
    [self sendEventWithName:kEventCallConnected body:@{
                                                       kEventParamName    : kEventNameCallConnected,
                                                       kEventParamCallId  : call.callId,
                                                       kEventParamHeaders : headers
                                                       }];
}

- (void)call:(VICall *)call didDisconnectWithHeaders:(NSDictionary *)headers answeredElsewhere:(NSNumber *)answeredElsewhere {
    [call removeDelegate:self];
    [RNVICallManager removeCallById:call.callId];
    [self sendEventWithName:kEventCallDisconnected body:@{
                                                          kEventParamName              : kEventNameCallDisconnected,
                                                          kEventParamCallId            : call.callId,
                                                          kEventParamHeaders           : headers,
                                                          kEventParamAnsweredElsewhere : answeredElsewhere
                                                          }];
}

- (void)call:(VICall *)call didFailWithError:(NSError *)error headers:(NSDictionary *)headers {
    [call removeDelegate:self];
    [RNVICallManager removeCallById:call.callId];
    [self sendEventWithName:kEventCallFailed body:@{
                                                    kEventParamName    : kEventNameCallFailed,
                                                    kEventParamCallId  : call.callId,
                                                    kEventParamCode    : @(error.code),
                                                    kEventParamReason  : error.localizedDescription,
                                                    kEventParamHeaders : headers
                                                    }];
}

- (void)iceTimeoutForCall:(VICall *)call {
    [self sendEventWithName:kEventCallICETimeout body:@{
                                                        kEventParamName   : kEventNameCallICETimeout,
                                                        kEventParamCallId : call.callId
                                                        }];
}

- (void)iceCompleteForCall:(VICall *)call {
    [self sendEventWithName:kEventCallICECompleted body:@{
                                                          kEventParamName   : kEventNameCallICECompleted,
                                                          kEventParamCallId : call.callId
                                                          }];
}

- (void)call:(VICall *)call didReceiveInfo:(NSString *)body type:(NSString *)type headers:(NSDictionary *)headers {
    [self sendEventWithName:kEventCallInfoReceived body:@{
                                                          kEventParamName     : kEventNameCallInfoReceived,
                                                          kEventParamCallId   : call.callId,
                                                          kEventParamBody     : body,
                                                          kEventParamMimeType : type,
                                                          kEventParamHeaders  : headers
                                                          }];
}

- (void)call:(VICall *)call didReceiveMessage:(NSString *)message headers:(NSDictionary *)headers {
    [self sendEventWithName:kEventCallMessageReceived body:@{
                                                             kEventParamName   : kEventNameCallMessageReceived,
                                                             kEventParamCallId : call.callId,
                                                             kEventParamText   : message
                                                             }];
}

- (void)call:(VICall *)call startRingingWithHeaders:(NSDictionary *)headers {
    [self sendEventWithName:kEventCallProgressToneStart body:@{
                                                               kEventParamName    : kEventNameCallProgressToneStart,
                                                               kEventParamCallId  : call.callId,
                                                               kEventParamHeaders : headers
                                                               }];
}

- (void)callDidStartAudio:(VICall *)call {
    [self sendEventWithName:kEventCallProgressToneStop body:@{
                                                              kEventParamName   : kEventNameCallProgressToneStop,
                                                              kEventParamCallId : call.callId
                                                              }];
}

- (void)call:(VICall *)call didAddLocalVideoStream:(VILocalVideoStream *)videoStream {
    [RNVICallManager addVideoStream:videoStream];
    [self sendEventWithName:kEventCallLocalVideoStreamAdded body:@{
                                                                   kEventParamName            : kEventNameCallLocalVideoStreamAdded,
                                                                   kEventParamCallId          : call.callId,
                                                                   kEventParamVideoStreamId   : videoStream.streamId,
                                                                   kEventParamVideoStreamType : [RNVIUtils convertVideoStreamTypeToString:videoStream.type]
                                                                   }];
}

- (void)call:(VICall *)call didRemoveLocalVideoStream:(VILocalVideoStream *)videoStream {
    [self sendEventWithName:kEventCallLocalVideoStreamRemoved body:@{
                                                                     kEventParamName          : kEventNameCallLocalVideoStreamRemoved,
                                                                     kEventParamCallId        : call.callId,
                                                                     kEventParamVideoStreamId : videoStream.streamId
                                                                     }];
    [RNVICallManager removeVideoStreamById:videoStream.streamId];
}

- (void) call:(VICall *)call didAddEndpoint:(VIEndpoint *)endpoint {
    [RNVICallManager addEndpoint:endpoint forCall:call.callId];
    [endpoint setDelegate:self];
    [self sendEventWithName:kEventCallEndpointAdded body:@{
                                                           kEventParamName           : kEventNameCallEndpointAdded,
                                                           kEventParamCallId         : call.callId,
                                                           kEventParamEndpointId     : endpoint.endpointId,
                                                           kEventParamEndpointName   : endpoint.user ? endpoint.user : [NSNull null],
                                                           kEventParamDisplayName    : endpoint.userDisplayName ? endpoint.userDisplayName : [NSNull null],
                                                           kEventParamEndpointSipUri : endpoint.sipURI ? endpoint.sipURI : [NSNull null]
                                                           }];
}

- (void)endpoint:(VIEndpoint *)endpoint didAddRemoteVideoStream:(VIRemoteVideoStream *)videoStream {
    [RNVICallManager addVideoStream:videoStream];
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointRemoteStreamAdded body:@{
                                                                   kEventParamName            : kEventNameEndpointRemoteStreamAdded,
                                                                   kEventParamCallId          : callId ? callId : [NSNull null],
                                                                   kEventParamEndpointId      : endpoint.endpointId,
                                                                   kEventParamVideoStreamId   : videoStream.streamId,
                                                                   kEventParamVideoStreamType : [RNVIUtils convertVideoStreamTypeToString:videoStream.type]
                                                                   }];
}

- (void)endpoint:(VIEndpoint *)endpoint didRemoveRemoteVideoStream:(VIRemoteVideoStream *)videoStream {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointRemoteStreamRemoved body:@{
                                                                   kEventParamName          : kEventEndpointRemoteStreamRemoved,
                                                                   kEventParamCallId        : callId ? callId : [NSNull null],
                                                                   kEventParamEndpointId    : endpoint.endpointId,
                                                                   kEventParamVideoStreamId : videoStream.streamId
                                                                   }];
    [RNVICallManager removeVideoStreamById:videoStream.streamId];
}

- (void)endpointDidRemove:(VIEndpoint *)endpoint {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointRemoved body:@{
                                                         kEventParamName           : kEventNameEndpointRemoved,
                                                         kEventParamCallId         : callId ? callId : [NSNull null],
                                                         kEventParamEndpointId     : endpoint.endpointId
                                                         }];
    [RNVICallManager removeEndpointById:endpoint.endpointId];
}

- (void)callDidStartReconnecting: (VICall *)call {
    [self sendEventWithName:kEventCallReconnecting body:@{
                                                          kEventParamName         : kEventCallReconnecting,
                                                          kEventParamCallId       : call.callId,
                                                          }];
}

- (void)callDidReconnect: (VICall *)call {
    [self sendEventWithName:kEventCallReconnected body:@{
                                                         kEventParamName         : kEventCallReconnected,
                                                         kEventParamCallId       : call.callId,
                                                         }];
}

- (void)endpointInfoDidUpdate:(VIEndpoint *)endpoint {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointInfoUpdate body:@{
                                                         kEventParamName           : kEventNameEndpointInfoUpdate,
                                                         kEventParamCallId         : callId ? callId : [NSNull null],
                                                         kEventParamEndpointId     : endpoint.endpointId,
                                                         kEventParamEndpointName   : endpoint.user ? endpoint.user : [NSNull null],
                                                         kEventParamDisplayName    : endpoint.userDisplayName ? endpoint.userDisplayName : [NSNull null],
                                                         kEventParamEndpointSipUri : endpoint.sipURI ? endpoint.sipURI : [NSNull null]
                                                         }];
}



@end
