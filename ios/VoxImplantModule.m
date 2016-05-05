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

@interface VoxImplantModule ()
{
    VoxImplant * sdk;
}
@end

@implementation VoxImplantModule

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (id)init
{
    self = [super init];
    if (self)
    {
        sdk = [VoxImplant getInstance];
        [sdk setVoxDelegate:self];
    }
    return self;
}

// VoxImplant API

RCT_EXPORT_METHOD(connect)
{
    [sdk connect];
}

RCT_EXPORT_METHOD(createCall: (NSString *) to withVideo: (BOOL) video  andCustomData: (NSString *) customData ResponseCallback: (RCTResponseSenderBlock)callback)
{
    NSString * callId = [sdk createCall: to withVideo:video  andCustomData: customData];
    callback(@[callId]);
}

RCT_EXPORT_METHOD(login: (NSString *)user andPassword:(NSString*) password)
{
    [sdk loginWithUsername: user andPassword: password];
}

RCT_EXPORT_METHOD(loginWithOneTimeKey: (NSString *)user andOneTimeKey:(NSString*) hash)
{
    [sdk loginWithUsername: user andOneTimeKey: hash];
}

RCT_EXPORT_METHOD(requestOneTimeLoginKey: (NSString *)user)
{
    [sdk requestOneTimeKeyWithUsername: user];
}

RCT_EXPORT_METHOD(closeConnection)
{
    [sdk closeConnection];
}

RCT_EXPORT_METHOD(startCall: (NSString *) callId withHeaders: (NSDictionary*) headers)
{
    [sdk startCall: callId withHeaders: headers];
}

RCT_EXPORT_METHOD(sendDTMF: (NSString *) callId digit: (int) digit)
{
    [sdk sendDTMF: callId digit: digit];
}

RCT_EXPORT_METHOD(disconnectCall: (NSString *) callId withHeaders: (NSDictionary*) headers)
{
    [sdk disconnectCall: callId withHeaders: headers];
}

RCT_EXPORT_METHOD(declineCall: (NSString *) callId withHeaders: (NSDictionary*) headers)
{
    [sdk declineCall: callId withHeaders: headers];
}

RCT_EXPORT_METHOD(answerCall: (NSString *) callId withHeaders: (NSDictionary*) headers)
{
    [sdk answerCall: callId withHeaders: headers];
}

RCT_EXPORT_METHOD(sendMessage: (NSString *) callId withText: (NSString *) text andHeaders: (NSDictionary *) headers)
{
    [sdk sendMessage: callId withText: text andHeaders: headers];
}

RCT_EXPORT_METHOD(sendInfo: (NSString *) callId withType: (NSString *)mimeType content: (NSString *) content andHeaders: (NSDictionary *) headers)
{
    [sdk sendInfo: callId withType: mimeType content: content andHeaders: headers];
}

RCT_EXPORT_METHOD(setMute: (BOOL) b)
{
    [sdk setMute: b];
}

RCT_EXPORT_METHOD(setUseLoudspeaker: (BOOL) b)
{
    [sdk setUseLoudspeaker: b];
}

RCT_EXPORT_METHOD(setVideoResizeMode: (NSString*) mode)
{
    if ([mode isEqualToString: @"fit"])
        [sdk setVideoResizeMode: VI_VIDEO_RESIZE_MODE_FIT];
    else
    if ([mode isEqualToString: @"clip"])
        [sdk setVideoResizeMode: VI_VIDEO_RESIZE_MODE_CLIP];
    else
        RCTLogError(@"Invalid resize mode");
}

RCT_EXPORT_METHOD(sendVideo:(BOOL)doSend)
{
    [sdk sendVideo: doSend];
}

RCT_EXPORT_METHOD(setCameraResolution: (int) width andHeight: (int) height)
{
    [sdk setResolution: width andHeight: height];
}

RCT_EXPORT_METHOD(switchToCamera: (NSString*) cameraName)
{
    if ([cameraName isEqualToString: @"front"])
        [sdk switchToCameraWithPosition: AVCaptureDevicePositionFront];
    else
    if ([cameraName isEqualToString: @"back"])
        [sdk switchToCameraWithPosition: AVCaptureDevicePositionBack];
    else
        RCTLogError(@"Invalid camera name");
}

// VoxImplant events

- (void) onLoginSuccessfulWithDisplayName: (NSString *) displayName
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"LoginSuccessful"
                                                 body: @{@"displayName": displayName}];
}

- (void) onLoginFailedWithErrorCode: (NSNumber *) errorCode
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"LoginFailed"
                                                 body: @{@"errorCode": errorCode}];
}

- (void) onOneTimeKeyGenerated: (NSString *) key
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"OneTimeKeyGenerated"
                                                 body: @{@"key": key}];
}

- (void) onConnectionSuccessful
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionSuccessful"
                                                 body: @{}];
}

- (void) onConnectionClosed
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionClosed"
                                                 body: @{}];
}

- (void) onConnectionFailedWithError: (NSString *) reason
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"ConnectionFailed"
                                                 body: @{@"reason": reason}];
}

- (void) onCallConnected: (NSString *) callId withHeaders: (NSDictionary *) headers
{
   [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallConnected"
                                                 body: @{@"callId": callId, @"headers": headers}];
}

- (void) onCallDisconnected: (NSString *) callId withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallDisconnected"
                                                 body: @{@"callId": callId, @"headers": headers}];
}

- (void) onCallRinging: (NSString *) callId withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallRinging" body: @{}];
}

- (void) onCallFailed: (NSString *) callId withCode:(int)code andReason:(NSString *)reason withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallFailed"
                                                 body: @{@"callId": callId, @"code": [NSNumber numberWithInt:code], @"reason": reason, @"headers": headers}];
}

- (void) onCallAudioStarted: (NSString *) callId
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"CallAudioStarted"
                                                 body: @{@"callId": callId}];
}

- (void) onIncomingCall: (NSString *) callId From: (NSString *) from Named: (NSString *) displayName withVideo: (bool) videoCall withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"IncomingCall"
                                                 body: @{@"callId": callId, @"from": from, @"displayName": displayName, @"videoCall": (videoCall ? @"true" : @"false"), @"headers": headers}];
}

- (void) onSIPInfoReceivedInCall: (NSString *)callId withType: (NSString*)type andContent: (NSString *)content withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"SIPInfoReceivedInCall"
                                                 body: @{@"callId": callId, @"type": type, @"content": content, @"headers": headers}];
}

- (void) onMessageReceivedInCall: (NSString *)callId withText: (NSString *)text withHeaders: (NSDictionary *) headers
{
    [self.bridge.eventDispatcher sendDeviceEventWithName: @"MessageReceivedInCall"
                                                 body: @{@"callId": callId, @"text": text, @"headers": headers}];
}

@end
