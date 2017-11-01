//
//  VoxImplantModule.m
//  VoxImplantModule
//
//  Copyright (c) 2011-2015 Zingaya. All rights reserved.
//

#import "VoxImplantModule.h"
#import "RCTLog.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"

@interface VoxImplantModule ()
{
    VoxImplant * sdk;
}
@end

@implementation VoxImplantModule

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (id)init {
    self = [super init];
    return self;
}

// VoxImplant API

RCT_EXPORT_METHOD(init: (NSString*)logLevel) {
    enum VoxImplantLogLevel level;
    if ([logLevel isEqualToString:@"error"]) {
        level = ERROR_LOG_LEVEL;
    } else if ([logLevel isEqualToString: @"info"]) {
        level = INFO_LOG_LEVEL;
    } else if ([logLevel isEqualToString:@"debug"]) {
        level = DEBUG_LOG_LEVEL;
    } else if ([logLevel isEqualToString:@"trace"]) {
        level = TRACE_LOG_LEVEL;
    }
    
    [VoxImplant setLogLevel: level];
    sdk = [VoxImplant getInstance];
    [sdk setVoxDelegate:self];
}


RCT_EXPORT_METHOD(connect:(BOOL)connectivityCheck) {
    [sdk connect:connectivityCheck];
}

RCT_EXPORT_METHOD(createCall:(NSString *)to
                   withVideo:(BOOL)video
               andCustomData:(NSString *)customData
            ResponseCallback:(RCTResponseSenderBlock)callback) {
    NSString * callId = [sdk createCall:to
                              withVideo:video
                          andCustomData:customData];
    callback(@[callId]);
}

RCT_REMAP_METHOD(login, loginWithUsername:(NSString *)user andPassword:(NSString *)password) {
    [sdk loginWithUsername:user andPassword:password];
}

RCT_REMAP_METHOD(loginUsingOneTimeKey, loginWithUsername:(NSString *)user andOneTimeKey:(NSString *)hash) {
    [sdk loginWithUsername:user andOneTimeKey:hash];
}

RCT_REMAP_METHOD(loginUsingAccessToken, loginWithUserName:(NSString *)user andToken:(NSString *)token) {
    [sdk loginWithUsername:user andToken:token];
}

RCT_REMAP_METHOD(refreshToken, refreshTokenWithUsername:(NSString *)user andToken:(NSString *)token) {
    [sdk refreshTokenWithUsername:user andToken:token];
}

RCT_EXPORT_METHOD(requestOneTimeKey:(NSString *)user) {
    [sdk requestOneTimeKeyWithUsername:user];
}

RCT_EXPORT_METHOD(closeConnection) {
    [sdk closeConnection];
}

RCT_EXPORT_METHOD(startCall:(NSString *)callId withHeaders:(NSDictionary *)headers) {
    [sdk startCall:callId withHeaders: headers];
}

RCT_EXPORT_METHOD(sendDTMF:(NSString *)callId digit:(int)digit) {
    [sdk sendDTMF:callId digit:digit];
}

RCT_EXPORT_METHOD(disconnectCall:(NSString *)callId withHeaders:(NSDictionary *)headers) {
    [sdk disconnectCall:callId withHeaders:headers];
}

RCT_EXPORT_METHOD(declineCall:(NSString *)callId withHeaders:(NSDictionary *)headers) {
    [sdk declineCall:callId withHeaders:headers];
}

RCT_EXPORT_METHOD(answerCall:(NSString *)callId withCustomData:(NSString *)customData headers:(NSDictionary *)headers) {
    [sdk answerCall:callId withCustomData:customData headers:headers];
}

RCT_EXPORT_METHOD(sendMessage:(NSString *)callId withText:(NSString *)text andHeaders:(NSDictionary *)headers) {
    [sdk sendMessage:callId withText:text andHeaders:headers];
}

RCT_EXPORT_METHOD(sendInfo:(NSString *)callId withType:(NSString *)mimeType content:(NSString *)content andHeaders:(NSDictionary *)headers) {
    [sdk sendInfo:callId withType:mimeType content:content andHeaders:headers];
}

RCT_EXPORT_METHOD(setMute:(BOOL)doMute) {
    [sdk setMute:doMute];
}

RCT_EXPORT_METHOD(setUseLoudspeaker:(BOOL)useLoudSpeaker) {
    [sdk setUseLoudspeaker:useLoudSpeaker];
}

RCT_EXPORT_METHOD(setVideoResizeMode:(NSString*)mode) {
    if ([mode isEqualToString: @"fit"])
        [sdk setVideoResizeMode: VI_VIDEO_RESIZE_MODE_FIT];
    else if ([mode isEqualToString: @"clip"])
        [sdk setVideoResizeMode: VI_VIDEO_RESIZE_MODE_CLIP];
    else
        RCTLogError(@"Invalid resize mode");
}

RCT_EXPORT_METHOD(sendVideo:(BOOL)doSend) {
    [sdk sendVideo:doSend];
}

RCT_EXPORT_METHOD(setCameraResolution:(int)width andHeight:(int)height) {
    [sdk setResolution:width andHeight:height];
}

RCT_EXPORT_METHOD(switchToCamera:(NSString *) cameraName) {
    if ([cameraName isEqualToString: @"front"])
        [sdk switchToCameraWithPosition: AVCaptureDevicePositionFront];
    else if ([cameraName isEqualToString: @"back"])
        [sdk switchToCameraWithPosition: AVCaptureDevicePositionBack];
    else
        RCTLogError(@"Invalid camera name");
}

RCT_EXPORT_METHOD(registerForPushNotifications:(NSString *)token) {
    [sdk registerPushNotificationsToken:[self dataFromHexString:token]];
}

RCT_EXPORT_METHOD(unregisterFromPushNotifications:(NSString *)token) {
    [sdk unregisterPushNotificationsToken:[self dataFromHexString:token]];
}

RCT_EXPORT_METHOD(handlePushNotification:(NSDictionary *)notification) {
    [sdk handlePushNotification:notification];
}

- (NSData *)dataFromHexString:(NSString *)string {
    NSMutableData *data = [NSMutableData dataWithCapacity: string.length / 2];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0','\0','\0'};
    for (int i = 0; i < string.length / 2; i++) {
        byte_chars[0] = [string characterAtIndex:i*2];
        byte_chars[1] = [string characterAtIndex:i*2+1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [data appendBytes:&whole_byte length:1];
    }
    return data;
}

// VoxImplant events

- (void) onLoginSuccessfulWithDisplayName: (NSString *)displayName
                            andAuthParams:(NSDictionary*)authParams {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"LoginSuccessful"
                                                    body: @{@"displayName": displayName,
                                                            @"accessToken": [authParams valueForKey:@"accessToken"],
                                                            @"accessExpire": [authParams valueForKey:@"accessExpire"],
                                                            @"refreshToken": [authParams valueForKey:@"refreshToken"],
                                                            @"refreshExpire": [authParams valueForKey:@"refreshExpire"]}];
}

- (void) onLoginFailedWithErrorCode: (NSNumber *)errorCode {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"LoginFailed"
                                                    body: @{@"errorCode": errorCode}];
}

- (void) onOneTimeKeyGenerated: (NSString *)key {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"OneTimeKeyGenerated"
                                                    body: @{@"key": key}];
}

- (void) onConnectionSuccessful {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionSuccessful"
                                                    body: @{}];
}

- (void) onConnectionClosed {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionClosed"
                                                    body: @{}];
}

- (void) onConnectionFailedWithError: (NSString *)reason {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionFailed"
                                                    body: @{@"reason": reason}];
}

- (void) onRefreshTokenSuccess: (NSDictionary*) authParams {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"RefreshTokenSuccess"
                                                    body: @{ @"authParams": authParams}];
}

- (void) onRefreshTokenFailed: (NSNumber*)errorCode {
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"RefreshTokenFailed"
                                                    body:@{@"errorCode": errorCode}];
}

- (void) onCallConnected: (NSString *)callId
             withHeaders: (NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallConnected"
                                                    body: @{@"callId": callId, @"headers": headers}];
}

- (void) onCallDisconnected:(NSString *)callId
                withHeaders:(NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallDisconnected"
                                                    body: @{@"callId": callId, @"headers": headers}];
}

- (void) onCallRinging: (NSString *)callId
           withHeaders: (NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallRinging" body: @{}];
}

- (void) onCallFailed: (NSString *)callId
             withCode: (int)code
            andReason: (NSString *)reason
          withHeaders: (NSDictionary *) headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallFailed"
                                                    body: @{@"callId": callId, @"code": [NSNumber numberWithInt:code], @"reason": reason, @"headers": headers}];
}

- (void) onCallAudioStarted: (NSString *)callId {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallAudioStarted"
                                                    body: @{@"callId": callId}];
}

- (void) onIncomingCall: (NSString *)callId
                 caller: (NSString *)from
                  named: (NSString *)displayName
              withVideo: (bool)videoCall
            withHeaders: (NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"IncomingCall"
                                                    body: @{@"callId": callId, @"from": from, @"displayName": displayName, @"videoCall": (videoCall ? @"true" : @"false"), @"headers": headers}];
}

- (void) onSIPInfoReceivedInCall: (NSString *)callId
                        withType: (NSString*)type
                      andContent: (NSString *)content
                     withHeaders: (NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"SIPInfoReceivedInCall"
                                                    body: @{@"callId": callId, @"type": type, @"content": content, @"headers": headers}];
}

- (void) onMessageReceivedInCall: (NSString *)callId
                        withText: (NSString *)text
                     withHeaders: (NSDictionary *)headers {
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"MessageReceivedInCall"
                                                    body: @{@"callId": callId, @"text": text, @"headers": headers}];
}

@end
