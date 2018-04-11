/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "CallModule.h"
#import "RCTBridgeModule.h"
#import "Constants.h"
#import "CallManager.h"
#import "VICall.h"

@interface CallModule()

@end

@implementation CallModule
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
             kEventCallProgressToneStop];
}

RCT_EXPORT_METHOD(internalSetup:(NSString *)callId) {
    VICall *call = [CallManager getCallById:callId];
    if (call) {
        [call addDelegate:self];
    }
}

RCT_EXPORT_METHOD(sendAudio:(NSString *)callId enable:(BOOL)enable) {
    VICall *call = [CallManager getCallById:callId];
    if (call) {
        call.sendAudio = enable;
    }
}

RCT_EXPORT_METHOD(sendDTMF:(NSString *)callId tone:(NSString *)tone) {
    VICall *call = [CallManager getCallById:callId];
    if (call) {
        [call sendDTMF:tone];
    }
}

RCT_EXPORT_METHOD(hangup:(NSString *)callId headers:(NSDictionary *)headers) {
    VICall *call = [CallManager getCallById:callId];
    if (call) {
        [call hangupWithHeaders:headers];
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
    [CallManager removeCallById:call.callId];
    [self sendEventWithName:kEventCallDisconnected body:@{
                                                          kEventParamName              : kEventNameCallDisconnected,
                                                          kEventParamCallId            : call.callId,
                                                          kEventParamHeaders           : headers,
                                                          kEventParamAnsweredElsewhere : answeredElsewhere
                                                          }];
}

- (void)call:(VICall *)call didFailWithError:(NSError *)error headers:(NSDictionary *)headers {
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

- (void)call:(VICall *)call didAddLocalVideoStream:(VIVideoStream *)videoStream {
    
}

- (void)call:(VICall *)call didRemoveLocalVideoStream:(VIVideoStream *)videoStream {
    
}
@end
