//
//  VoxImplantDelegate.h
//
//  Copyright (c) 2011-2015, Zingaya, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

/*!
 @protocol VoxImplantDelegate
 @abstract Delegate for VoxImplantSDK
 @discussion Delegate for VoxImplantSDK
 */

@protocol VoxImplantDelegate


/*!
 Triggered if login attempt was successful
 @param displayName Full name of logged in user
 */

- (void) onLoginSuccessfulWithDisplayName: (NSString *) displayName;


/*!
 Triggered if login attempt failed
 @param errorCode Numeric error code
 */

- (void) onLoginFailedWithErrorCode: (NSNumber *) errorCode;


/*!
 Connection with cloud established
 */

- (void) onConnectionSuccessful;


/*!
 Connection with cloud closed
 */

- (void) onConnectionClosed;


/*!
 Connection with cloud failed
 @param reason Error message
 */

- (void) onConnectionFailedWithError: (NSString *) reason;


/*!
 Call established
 @param callId id of call
 @param headers Optional headers passed with event
 */

- (void) onCallConnected: (NSString *) callId withHeaders: (NSDictionary *) headers;


/*!
 Call terminated
 @param callId id of call
 @param headers Optional headers passed with event
 */

- (void) onCallDisconnected: (NSString *) callId withHeaders: (NSDictionary *) headers;


/*!
 Call ringing. You should start playing call progress tone now
 @param callId id of call
 @param headers Optional headers passed with event
 */

- (void) onCallRinging: (NSString *) callId withHeaders: (NSDictionary *) headers;


/*!
 Call failed
 @param callId id of call
 @param code Status code
 @param reason Status message
 @param headers Optional headers passed with event
 */

- (void) onCallFailed: (NSString *) callId withCode:(int)code andReason:(NSString *)reason withHeaders: (NSDictionary *) headers;


/*!
 Call audio started. You should stop playing progress tone when event is received
 @param callId id of call
 @param headers Optional headers passed with event
 */
- (void) onCallAudioStarted: (NSString *) callId;


/*!
 Incoming call arrives
 @param callId id of call
 @param from SIP URI of caller
 @param displayName Displayed name of caller
 @param videoCall incoming video call flag
 @param headers Optional headers passed with event
 */

- (void) onIncomingCall: (NSString *) callId From: (NSString *) from Named: (NSString *) displayName withVideo: (bool) videoCall withHeaders: (NSDictionary *) headers;


/*!
 Info received inside a call
 @param callId id of call
 @param type MIME type of info
 @param content Body of info message
 @param headers Optional headers passed with event
 */

- (void) onSIPInfoReceivedInCall: (NSString *)callId withType: (NSString*)type andContent: (NSString *)content withHeaders: (NSDictionary *) headers;


/*!
 Instant message received inside a call
 @param callId id of call
 @param text Message text
 @param headers Optional headers passed with event
 */

- (void) onMessageReceivedInCall: (NSString *)callId withText: (NSString *)text withHeaders: (NSDictionary *) headers;


@end
