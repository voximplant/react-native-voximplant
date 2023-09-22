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
             kEventCallReconnected,
             kEventEndpointVoiceActivityStarted,
             kEventEndpointVoiceActivityStopped,
             kEventCallReconnecting,
             kEventCallReconnected,
             kEventEndpointStopReceivingVideoStream,
             kEventEndpointStartReceivingVideoStream,
             kEventEndpointRequestVideoSizeForVideoStreamSuccess,
             kEventEndpointRequestVideoSizeForVideoStreamFailure,
             kEventQualityIssuePacketLoss,
             kEventQualityIssueCodecMismatch,
             kEventQualityIssueLocalVideoDegradation,
             kEventQualityIssueIceDisconnected,
             kEventQualityIssueHighMediaLatency,
             kEventQualityIssueNoAudioSignal,
             kEventQualityIssueNoAudioReceive,
             kEventQualityIssueNoVideoReceive];
}

RCT_EXPORT_METHOD(internalSetup:(NSString *)callId) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        [call addDelegate:self];
        [call setQualityIssueDelegate:self];
    }
}

RCT_REMAP_METHOD(answer, answerCall:(NSString *)callId withSettings:(NSDictionary *)settings) {
    VICall *call = [RNVICallManager getCallById:callId];
    VICallSettings *callSettings = [RNVIUtils convertDictionaryToCallSettings:settings];
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

RCT_EXPORT_METHOD(startReceiving:(NSString *)streamId) {
    VIRemoteVideoStream *remoteVideoStream = [RNVICallManager getRemoteVideoStreamById:streamId];
    if (remoteVideoStream) {
        [remoteVideoStream startReceiving];
    }
}

RCT_EXPORT_METHOD(stopReceiving:(NSString *)streamId) {
    VIRemoteVideoStream *remoteVideoStream = [RNVICallManager getRemoteVideoStreamById:streamId];
    if (remoteVideoStream) {
        [remoteVideoStream stopReceiving];
    }
}

RCT_EXPORT_METHOD(requestVideoSize:(NSString *)streamId width:(NSNumber * _Nonnull)width height:(NSNumber * _Nonnull)height) {
    VIRemoteVideoStream *remoteVideoStream = [RNVICallManager getRemoteVideoStreamById:streamId];
    if (remoteVideoStream) {
        NSUInteger integerWidth = [width unsignedIntegerValue];
        NSUInteger integerHeight = [height unsignedIntegerValue];
        [remoteVideoStream requestVideoSizeWithWidth:integerWidth height:integerHeight];
        [self sendEventWithName:kEventEndpointRequestVideoSizeForVideoStreamSuccess body:@{
                                                                      kEventParamName   : kEventEndpointRequestVideoSizeForVideoStreamSuccess,
                                                                      }];
    } else {
        [self sendEventWithName:kEventEndpointRequestVideoSizeForVideoStreamFailure body:@{
                                                                      kEventParamName   : kEventEndpointRequestVideoSizeForVideoStreamFailure,
                                                                      kEventParamCode   : kCallErrorInternal,
                                                                      kEventParamReason : @"Failed to find remote video stream by provided video stream id"
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

RCT_EXPORT_METHOD(currentQualityIssues:(NSString *)callId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    VICall *call = [RNVICallManager getCallById:callId];
    if (call) {
        NSArray *issues = [call qualityIssues];
        NSMutableDictionary *dictionary = [NSMutableDictionary new];
        for (VIQualityIssueType type in issues) {
            NSString *issueLevelForType = [RNVIUtils convertQualityIssueLevelToString:[call issueLevelForType:type]];
            [dictionary setObject:issueLevelForType forKey:[RNVIUtils convertQualityIssueTypeToString:type]];
        }
        resolve(dictionary);
    } else {
        reject(kCallErrorInternal, @"Call.currentQualityIssues(): call is no more unavailable, already ended or failed", nil);
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
    [call setQualityIssueDelegate:nil];
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
    [call setQualityIssueDelegate:nil];
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
    [RNVICallManager addLocalVideoStream:videoStream];
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
    [RNVICallManager removeLocalVideoStreamById:videoStream.streamId];
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
    [RNVICallManager addRemoteVideoStream:videoStream];
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
    [RNVICallManager removeRemoteVideoStreamById:videoStream.streamId];
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

- (void)didDetectVoiceActivityStart:(VIEndpoint *)endpoint {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointVoiceActivityStarted body:@{
                                                                      kEventParamName         : kEventNameVoiceActivityStarted,
                                                                      kEventParamCallId       : callId ? callId : [NSNull null],
                                                                      kEventParamEndpointId   : endpoint.endpointId
                                                                      }];
}

- (void)didDetectVoiceActivityStop:(VIEndpoint *)endpoint {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointVoiceActivityStopped body:@{
                                                                      kEventParamName         : kEventNameVoiceActivityStopped,
                                                                      kEventParamCallId       : callId ? callId : [NSNull null],
                                                                      kEventParamEndpointId   : endpoint.endpointId
                                                                      }];
}

- (void)            endpoint:(VIEndpoint *)endpoint
didStartReceivingVideoStream:(VIRemoteVideoStream *)videoStream {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointStartReceivingVideoStream body:@{
        kEventParamName          : kEventNameStartReceivingVideoStream,
        kEventParamCallId        : callId ? callId : [NSNull null],
        kEventParamEndpointId    : endpoint.endpointId,
        kEventParamVideoStreamId : videoStream.streamId
    }];
}

- (void)           endpoint:(VIEndpoint *)endpoint
didStopReceivingVideoStream:(VIRemoteVideoStream *)videoStream
                     reason:(VIVideoStreamReceiveStopReason)reason {
    NSString *callId = [RNVICallManager getCallIdByEndpointId:endpoint.endpointId];
    [self sendEventWithName:kEventEndpointStopReceivingVideoStream body:@{
        kEventParamName          : kEventNameStopReceivingVideoStream,
        kEventParamCallId        : callId ? callId : [NSNull null],
        kEventParamEndpointId    : endpoint.endpointId,
        kEventParamVideoStreamId : videoStream.streamId,
        kEventParamReason        : [RNVIUtils convertVideoStreamReceiveStopReasonToString:reason]
    }];
}

- (void)call:(VICall *)call didDetectPacketLoss:(double)packetLoss issueLevel:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssuePacketLoss body:@{
        kEventParamName      : kEventNameQualityIssuePacketLoss,
        kEventParamCallId    : call.callId,
        kEventParamPacketLoss: @(packetLoss),
        kEventParamIssueLevel: [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)call:(VICall *)call didDetectCodecMismatch:(nullable NSString *)codec issueLevel:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueCodecMismatch body:@{
        kEventParamName         : kEventNameQualityIssueCodecMismatch,
        kEventParamCallId       : call.callId,
        kEventParamCodec        : codec ? codec : [NSNull null],
        kEventParamIssueLevel   : [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)call:(VICall *)call didDetectLocalVideoDegradation:(CGSize)actualSize targetSize:(CGSize)targetSize issueLevel:(VIQualityIssueLevel)level {
    NSDictionary *actualSizeStruct = @{
        @"width": @((int)actualSize.width),
        @"height": @((int)actualSize.height)
    };
    NSDictionary *targetSizeStruct = @{
        @"width": @((int)targetSize.width),
        @"height": @((int)targetSize.height)
    };
    [self sendEventWithName:kEventQualityIssueLocalVideoDegradation body:@{
        kEventParamName      : kEventNameQualityIssueLocalVideoDegradation,
        kEventParamCallId    : call.callId,
        kEventParamActualSize: actualSizeStruct,
        kEventParamTargetSize: targetSizeStruct,
        kEventParamIssueLevel: [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)call:(VICall *)call didDetectIceDisconnected:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueIceDisconnected body:@{
        kEventParamName      : kEventNameQualityIssueIceDisconnected,
        kEventParamCallId    : call.callId,
        kEventParamIssueLevel: [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)call:(VICall *)call didDetectHighMediaLatency:(NSTimeInterval)latency issueLevel:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueHighMediaLatency body:@{
        kEventParamName      : kEventNameQualityIssueHighMediaLatency,
        kEventParamCallId    : call.callId,
        kEventParamLatency   : @([[NSNumber fromTimeInterval:latency] doubleValue]),
        kEventParamIssueLevel: [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)call:(VICall *)call didDetectNoAudioSignal:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueNoAudioSignal body:@{
        kEventParamName      : kEventNameQualityIssueNoAudioSignal,
        kEventParamCallId    : call.callId,
        kEventParamIssueLevel: [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)                   call:(VICall *)call
didDetectNoAudioReceiveOnStream:(VIRemoteAudioStream *)audioStream
                   fromEndpoint:(VIEndpoint *)endpoint
                     issueLevel:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueNoAudioReceive body:@{
        kEventParamName         : kEventNameQualityIssueNoAudioReceive,
        kEventParamCallId       : call.callId,
        kEventParamAudioStreamId: audioStream.streamId,
        kEventParamEndpointId   : endpoint.endpointId,
        kEventParamIssueLevel   : [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

- (void)                   call:(VICall *)call
didDetectNoVideoReceiveOnStream:(VIRemoteVideoStream *)videoStream
                   fromEndpoint:(VIEndpoint *)endpoint
                     issueLevel:(VIQualityIssueLevel)level {
    [self sendEventWithName:kEventQualityIssueNoVideoReceive body:@{
        kEventParamName         : kEventNameQualityIssueNoVideoReceive,
        kEventParamCallId       : call.callId,
        kEventParamVideoStreamId: videoStream.streamId,
        kEventParamEndpointId   : endpoint.endpointId,
        kEventParamIssueLevel   : [RNVIUtils convertQualityIssueLevelToString:level]
    }];
}

@end
