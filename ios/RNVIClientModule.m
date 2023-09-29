/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTConvert.h"
#import "RNVIConstants.h"
#import "RNVIUtils.h"
#import "RNVICallManager.h"
#import "RNVIClientModule.h"
#import <VoximplantWebRTC/VoximplantWebRTC.h>

NSString *const LOG_LEVEL_ERROR = @"error";
NSString *const LOG_LEVEL_WARNING = @"warning";
NSString *const LOG_LEVEL_INFO = @"info";
NSString *const LOG_LEVEL_DEBUG = @"debug";
NSString *const LOG_LEVEL_VERBOSE = @"verbose";

NSString *const CLIENT_STATE_DISCONNECTED = @"disconnected";
NSString *const CLIENT_STATE_CONNECTING = @"connecting";
NSString *const CLIENT_STATE_CONNECTED = @"connected";
NSString *const CLIENT_STATE_LOGGING_IN = @"logging_in";
NSString *const CLIENT_STATE_LOGGED_IN = @"logged_in";
NSString *const CLIENT_STATE_RECONNECTING = @"reconnecting";


@implementation RCTConvert (VIClientState)
RCT_ENUM_CONVERTER(VIClientState, (@{
                                     @"disconnected" : @(VIClientStateDisconnected),
                                     @"connecting"   : @(VIClientStateConnecting),
                                     @"connected"    : @(VIClientStateConnected),
                                     @"logging_in"   : @(VIClientStateLoggingIn),
                                     @"logged_in"    : @(VIClientStateLoggedIn),
                                     @"reconnecting" : @(VIClientStateReconnecting),
                                     }), VIClientStateDisconnected, integerValue)
@end

@interface VIClient (Version)
+ (void)setVersionExtension:(NSString *)version;
@end

@interface VIClient (RNVIUtils)
+ (NSUUID *)uuidForPushNotification:(NSDictionary *)notification;
@end

@interface RNVIClientModule()
@property(nonatomic, weak) VIClient* client;
@property(nonatomic, assign) BOOL hasListerners;
@end

@implementation RNVIClientModule
RCT_EXPORT_MODULE();

+ (NSUUID *)uuidForPushNotification:(NSDictionary *)notification {
    return [VIClient uuidForPushNotification:notification];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventConnectionEstablished,
             kEventConnectionFailed,
             kEventConnectionClosed,
             kEventAuthResult,
             kEventAuthTokenResult,
             kEventIncomingCall,
             kEventLogMessage,
             kEventReconnecting,
             kEventReconnected];
}

- (void)startObserving {
    _hasListerners = YES;
}

- (void)stopObserving {
    _hasListerners = NO;
}

RCT_EXPORT_METHOD(initWithOptions:(NSDictionary *)options) {
    VILogLevel logLevel = [RNVIUtils convertLogLevelFromString:[options objectForKey:@"logLevel"]];
    [VIClient setLogLevel:logLevel];
    [VIClient setVersionExtension:@"react-1.40.1"];
    NSString *bundleId = [options objectForKey:@"bundleId"];
    if (bundleId) {
        _client = [RNVICallManager getClientWithBundleId:bundleId];
    } else {
        _client = [RNVICallManager getClient];
    }
    BOOL forceRelayTraffic = [[options objectForKey:@"forceRelayTraffic"] boolValue];
    _client.enableForceRelayTraffic = forceRelayTraffic;
    _client.sessionDelegate = self;
    _client.callManagerDelegate = self;

    [VIClient setLogDelegate:self];
}

RCT_EXPORT_METHOD(disconnect) {
    if (_client) {
        [_client disconnect];
    }
}

RCT_EXPORT_METHOD(connect:(BOOL)connectivityCheck gateways:(NSArray *)gateways callback:(RCTResponseSenderBlock)callback) {
    if (_client) {
        BOOL isValidState = [_client connectWithConnectivityCheck:connectivityCheck gateways:gateways];
        callback(@[[NSNumber numberWithBool:isValidState]]);
    }
}

RCT_REMAP_METHOD(getClientState,
                 getClientStateWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (_client) {
        resolve([self convertClientStateToString:_client.clientState]);
    }
}

RCT_REMAP_METHOD(login, loginWithUsername:(NSString *)user andPassword:(NSString *)password) {
    if (_client) {
        __weak RNVIClientModule *weakself = self;
        [_client loginWithUser:user
                      password:password
                       success:^(NSString *displayName, VIAuthParams *authParams) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           NSDictionary *params = [RNVIUtils convertAuthParamsToDictionary:authParams];
                           [strongSelf sendEventWithName:kEventAuthResult body:@{kEventParamName        : kEventNameAuthResult,
                                                                                 kEventParamResult      : @(true),
                                                                                 kEventParamDisplayName : displayName ? displayName : [NSNull null],
                                                                                 kEventParamTokens      : params
                                                                                 }];
                       }
                       failure:^(NSError *error) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                 kEventParamName   : kEventNameAuthResult,
                                                                                 kEventParamResult : @(false),
                                                                                 kEventParamCode   : @(error.code)
                                                                                 }];
                       }];
    }
}

RCT_REMAP_METHOD(loginWithOneTimeKey, loginWithUsername:(NSString *)user andOneTimeKey:(NSString *)hash) {
    if (_client) {
        __weak RNVIClientModule *weakself = self;
        [_client loginWithUser:user
                    oneTimeKey:hash
                       success:^(NSString *displayName, VIAuthParams *authParams) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           NSDictionary *params = [RNVIUtils convertAuthParamsToDictionary:authParams];
                           [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                 kEventParamName        : kEventNameAuthResult,
                                                                                 kEventParamResult      : @(true),
                                                                                 kEventParamDisplayName : displayName ? displayName : [NSNull null],
                                                                                 kEventParamTokens      : params
                                                                                 }];
                       }
                       failure:^(NSError *error) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                 kEventParamName   : kEventNameAuthResult,
                                                                                 kEventParamResult : @(false),
                                                                                 kEventParamCode   : @(error.code)
                                                                                 }];
                       }];
    }
}

RCT_REMAP_METHOD(loginWithToken, loginWithUserName:(NSString *)user andToken:(NSString *)token) {
    if (_client) {
        __weak RNVIClientModule *weakself = self;
        [_client loginWithUser:user
                         token:token
                       success:^(NSString *displayName, VIAuthParams *authParams) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           NSDictionary *params = [RNVIUtils convertAuthParamsToDictionary:authParams];
                           [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                 kEventParamName        : kEventNameAuthResult,
                                                                                 kEventParamResult      : @(true),
                                                                                 kEventParamDisplayName : displayName ? displayName : [NSNull null],
                                                                                 kEventParamTokens      : params
                                                                                 }];
                       } failure:^(NSError *error) {
                           __strong RNVIClientModule *strongSelf = weakself;
                           [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                 kEventParamName   : kEventNameAuthResult,
                                                                                 kEventParamResult : @(false),
                                                                                 kEventParamCode   : @(error.code)
                                                                                 }];
                       }];
    }
}

RCT_EXPORT_METHOD(requestOneTimeLoginKey:(NSString *)user) {
    if (_client) {
        __weak RNVIClientModule *weakself = self;
        [_client requestOneTimeKeyWithUser:user
                                    result:^(NSString *oneTimeKey, NSError *error) {
                                        __strong RNVIClientModule *strongSelf = weakself;
                                        if (error) {
                                            [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                                  kEventParamName   : kEventNameAuthResult,
                                                                                                  kEventParamResult : @(false),
                                                                                                  kEventParamCode   : @(error.code)
                                                                                            }];
                                        } else {
                                            [strongSelf sendEventWithName:kEventAuthResult body:@{
                                                                                                  kEventParamName   : kEventNameAuthResult,
                                                                                                  kEventParamResult : @(false),
                                                                                                  kEventParamCode   : @(302),
                                                                                                  kEventParamKey    : oneTimeKey ? oneTimeKey : [NSNull null]
                                                                                                  }];
                                        }
                                    }];
    }
}

RCT_REMAP_METHOD(refreshToken, refreshTokenWithUser:(NSString *)user token:(NSString *)token) {
    if (_client) {
        __weak RNVIClientModule *weakself = self;
        [_client refreshTokenWithUser:user
                                token:token
                               result:^(VIAuthParams *authParams, NSError *error) {
                                   __strong RNVIClientModule *strongSelf = weakself;
                                   NSDictionary *params = [RNVIUtils convertAuthParamsToDictionary:authParams];
                                   if (error) {
                                       [strongSelf sendEventWithName:kEventAuthTokenResult body:@{
                                                                                                      kEventParamName   : kEventNameAuthTokenResult,
                                                                                                      kEventParamResult : @(false),
                                                                                                      kEventParamCode   : @(error.code)
                                                                                                      }];
                                   } else {
                                       [strongSelf sendEventWithName:kEventAuthTokenResult body:@{
                                                                                                      kEventParamName   : kEventNameAuthTokenResult,
                                                                                                      kEventParamResult : @(true),
                                                                                                      kEventParamTokens : params
                                                                                                      }];
                                   }

                               }];
    }
}

RCT_EXPORT_METHOD(registerPushNotificationsToken:(NSString *)token) {
    if(_client) {
        [_client registerVoIPPushNotificationsToken:[RNVIUtils dataFromHexString:token] completion:nil];
    }
}

RCT_EXPORT_METHOD(unregisterPushNotificationsToken:(NSString *)token) {
    if (_client) {
        [_client unregisterVoIPPushNotificationsToken:[RNVIUtils dataFromHexString:token] completion:nil];
    }
}

RCT_EXPORT_METHOD(handlePushNotification:(NSDictionary *)notification) {
    if (_client) {
        [_client handlePushNotification:notification];
    }
}

RCT_EXPORT_METHOD(registerIMPushNotificationsTokenIOS:(NSString *)token) {
    if (_client) {
        [_client registerIMPushNotificationsToken:[RNVIUtils dataFromHexString:token] completion:nil];
    }
}

RCT_EXPORT_METHOD(unregisterIMPushNotificationsTokenIOS:(NSString *)token) {
    if (_client) {
        [_client unregisterIMPushNotificationsToken:[RNVIUtils dataFromHexString:token] completion:nil];
    }
}

RCT_REMAP_METHOD(createAndStartCall,
                 callUser:(NSString *)user
                 withSettings:(NSDictionary *)settings
                 responseCallback:(RCTResponseSenderBlock)callback) {
    if (_client) {
        VICallSettings *callSettings = [RNVIUtils convertDictionaryToCallSettings:settings];
        VICall *call = [_client call:user settings:callSettings];
        if (call) {
            if ([[settings valueForKey:@"setupCallKit"] boolValue]) {
                [[VIAudioManager sharedAudioManager] callKitConfigureAudioSession:nil];
            }
            [RNVICallManager addCall:call];
            [call start];
            callback(@[call.callId, [NSNull null]]);
        } else {
            callback(@[[NSNull null], @"NOT_LOGGED_IN"]);
        }
    } else {
        callback(@[[NSNull null], @"NOT_LOGGED_IN"]);
    }
}

RCT_REMAP_METHOD(createAndStartConference,
                 callConference:(NSString *)user
                 withSettings:(NSDictionary *)settings
                 responseCallback:(RCTResponseSenderBlock)callback) {
    if (_client) {
        VICallSettings *callSettings = [RNVIUtils convertDictionaryToCallSettings:settings];
        VICall *call = [_client callConference:user settings:callSettings];
        if (call) {
            if ([[settings valueForKey:@"setupCallKit"] boolValue]) {
                [[VIAudioManager sharedAudioManager] callKitConfigureAudioSession:nil];
            }
            [RNVICallManager addCall:call];
            [call start];
            callback(@[call.callId, [NSNull null]]);
        } else {
            callback(@[[NSNull null], @"NOT_LOGGED_IN"]);
        }
    } else {
        callback(@[[NSNull null], @"NOT_LOGGED_IN"]);
    }
}

- (NSString *)convertClientStateToString:(VIClientState)state {
    switch (state) {
        case VIClientStateDisconnected:
            return CLIENT_STATE_DISCONNECTED;
        case VIClientStateConnecting:
            return CLIENT_STATE_CONNECTING;
        case VIClientStateConnected:
            return CLIENT_STATE_CONNECTED;
        case VIClientStateLoggingIn:
            return CLIENT_STATE_LOGGING_IN;
        case VIClientStateLoggedIn:
            return CLIENT_STATE_LOGGED_IN;
        case VIClientStateReconnecting:
            return CLIENT_STATE_RECONNECTING;
    }
}

- (void)client:(VIClient *)client sessionDidFailConnectWithError:(NSError *)error {
    [self sendEventWithName:kEventConnectionFailed body:@{
                                                          kEventParamName    : kEventNameConnectionFailed,
                                                          kEventParamMessage : [error localizedDescription]
                                                          }];
}

- (void)clientSessionDidConnect:(VIClient *)client {
    [self sendEventWithName:kEventConnectionEstablished body:@{
                                                               kEventParamName : kEventNameConnectionEstablished
                                                               }];
}

- (void)clientSessionDidDisconnect:(VIClient *)client {
    [self sendEventWithName:kEventConnectionClosed body:@{
                                                          kEventParamName : kEventNameConnectionClosed
                                                          }];
}


- (void)clientSessionDidStartReconnecting:(VIClient *)client {
    [self sendEventWithName:kEventReconnecting body:@{
                                                      kEventParamName : kEventNameReconnecting
                                                      }];
}

- (void)clientSessionDidReconnect:(VIClient *)client {
    [self sendEventWithName:kEventReconnected body:@{
                                                     kEventParamName : kEventNameReconnected
                                                     }];
}

- (void)client:(VIClient *)client didReceiveIncomingCall:(VICall *)call withIncomingVideo:(BOOL)video headers:(NSDictionary *)headers {
    [RNVICallManager addCall:call];
    VIEndpoint *endpoint = call.endpoints.firstObject;
    if (endpoint) {
        [RNVICallManager addEndpoint:endpoint forCall:call.callId];
    }
    [self sendEventWithName:kEventIncomingCall body:@{
                                                      kEventParamName           : kEventNameIncomingCall,
                                                      kEventParamCallId         : call.callId,
                                                      kEventParamIncomingVideo  : @(video),
                                                      kEventParamCallKitUUID    : call.callKitUUID ? call.callKitUUID.UUIDString  : [NSNull null],
                                                      kEventParamHeaders        : headers,
                                                      kEventParamEndpointId     : endpoint && endpoint.endpointId ? endpoint.endpointId : [NSNull null],
                                                      kEventParamEndpointName   : endpoint && endpoint.user ? endpoint.user : [NSNull null],
                                                      kEventParamEndpointSipUri : endpoint && endpoint.sipURI ? endpoint.sipURI : [NSNull null],
                                                      kEventParamDisplayName    : endpoint && endpoint.userDisplayName ? endpoint.userDisplayName : [NSNull null]
                                                      }];
}

- (void)didReceiveLogMessage:(nonnull NSString *)message severity:(VILogSeverity)severity {
    if (_hasListerners) {
        [self sendEventWithName:kEventLogMessage body:@{
                                                        kEventParamLogLevel   : [RNVIUtils convertLogSeverity:severity],
                                                        kEventParamLogMessage : message
                                                        }];
    }
}

@end
