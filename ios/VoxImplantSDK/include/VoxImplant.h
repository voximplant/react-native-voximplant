//
//  VoxImplantSDK.h
//
//  Copyright (c) 2011-2015, Zingaya, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import "VoxImplantDelegate.h"

/*!
 @enum VoxImplantVideoResizeMode
 @constant VI_VIDEO_RESIZE_MODE_CLIP Clip video to fill the whole container
 @constant VI_VIDEO_RESIZE_MODE_FIT Shrink video to fit in container
 */

enum VoxImplantVideoResizeMode
{
    VI_VIDEO_RESIZE_MODE_CLIP,
    VI_VIDEO_RESIZE_MODE_FIT
};

/*!
 @enum VoxImplantLogLevel
 @constant ERROR_LOG_LEVEL Log verbosity level, to include only error messages.
 @constant INFO_LOG_LEVEL Default log verbosity level, to include informational messages.
 @constant DEBUG_LOG_LEVEL Log verbosity level to include debug messages
 @constant TRACE_LOG_LEVEL Log verbosity level to include trace messages
 */
enum VoxImplantLogLevel
{
    ERROR_LOG_LEVEL,
    INFO_LOG_LEVEL,
    DEBUG_LOG_LEVEL,
    TRACE_LOG_LEVEL
};

/*!
 @class VoxImplant
 @abstract Main VoxImplant SDK class.
 @discussion Should not be instantiated directly, use [VoxImplantSDK getVoxImpantSDK] instead
 */

@interface VoxImplant: NSObject
{
    
}


/*!
 Returns Current delegate
 @return Current delegate
 */

-(id<VoxImplantDelegate>)getVoxDelegate;


/*!
 Set delegate object for SDK
 @param delegate Delegate object
 */

-(void)setVoxDelegate: (id<VoxImplantDelegate>) delegate;

/*!
 Sets a verbosity level for log messages. Note that this method must be called before creating SDK object instance.
 */
+(void) setLogLevel: (enum VoxImplantLogLevel) logLevel;


/*!
 Returns single SDK object instance
 */
+(VoxImplant *) getInstance;


/*!
 Connect to VoxImplant cloud
 */

-(void) connect;

/*!
 Connect to VoxImplant cloud
 @param connectivityCheck Checks whether UDP traffic will flow correctly between device and VoxImplant cloud. This check reduces connection speed.
 */

-(void) connect: (bool)connectivityCheck;

/*!
 Disable TLS encryption for signalling connection. Media data will be encrypted anyway
 */

-(void) disableTLS;

/*!
 Create new call instance.
 Call must be then started using startCall
 @param to SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario
 @param video Enable video support in call
 @param customData Optional custom data passed with call. Will be available in VoxEngine senario
 */

-(NSString *)createCall: (NSString *) to withVideo: (bool) video  andCustomData: (NSString *) customData;


/*!
 Login to VoxImplant using specified username and password
 @param user Username combined with application name, for example testuser\@testapp.testaccount.voximplant.com
 @param password Password in plain text
 */

-(void)loginWithUsername: (NSString *)user andPassword:(NSString*) password;

/*!
 Perform login using one time key that was generated before
 @param user Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
 @param hash Hash that was generated using following formula:
 MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)).
 <b>Please note that here user is just a user name, without app name,
 account name or anything else after "@"</b>. So if you pass <i>myuser@myapp.myacc.voximplant.com</i> as a <b>username</b>,
 you should only use <i>myuser</i> while computing this hash.
 */

-(void)loginWithUsername: (NSString *)user andOneTimeKey:(NSString*) hash;

/*!
 Generates one time login key to be used for automated login process.
 @param user Full user name, including app and account name, like <i>someuser@someapp.youraccount.voximplant.com</i>
 @see <a href="http://voximplant.com/docs/quickstart/24/automated-login/">Information about automated login on VoxImplant website</a>
 @see loginUsingOneTimeKey
 */

-(void)requestOneTimeKeyWithUsername: (NSString *)user;

/*!
 Closes connection with media server
 */

-(void)closeConnection;


/*!
 Send start call request
 If call with specified id is not found - returns false;
 @param callId id of previously created call
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(bool)startCall: (NSString *) callId withHeaders: (NSDictionary*) headers;


/*!
 Attach audio and video to specified call
 If call with specified id is not found - returns false;
 @param callId id of previously created call
 */

-(bool)attachAudioTo: (NSString *) callId;


/*!
 Sends DTMF digit in specified call.
 @param callId id of previously created call
 @param digit Digit can be 0-9 for 0-9, 10 for * and 11 for #
 */

-(void)sendDTMF: (NSString *) callId digit: (int) digit;


/*!
 Terminates specified call. Call must be either established, or outgoing progressing
 If call with specified id is not found - returns false;
 @param callId id of previously created call
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(bool)disconnectCall: (NSString *) callId withHeaders: (NSDictionary*) headers;


/*!
 Rejects incoming alerting call
 If call with specified id is not found - returns false;
 @param callId id of previously created call
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(void)declineCall: (NSString *) callId withHeaders: (NSDictionary*) headers;


/*!
 Answers incoming alerting call
 If call with specified id is not found - returns false;
 @param callId id of previously created call
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(void)answerCall: (NSString *) callId withHeaders: (NSDictionary*) headers;


/*!
 Sends instant message within established call
 @param callId id of previously created call
 @param text Message text
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(void)sendMessage: (NSString *) callId withText: (NSString *) text andHeaders: (NSDictionary *) headers;


/*!
 Sends info within established call
 @param callId id of previously created call
 @param mimeType MIME type of info
 @param content Custom string data
 @param headers Optional set of headers to be sent with message. Names must begin with "X-" to be processed by SDK
 */

-(void)sendInfo: (NSString *) callId withType: (NSString *)mimeType content: (NSString *) content andHeaders: (NSDictionary *) headers;


/*!
 Get call duration for established call
 @param callId id of previously created call
 */

-(NSTimeInterval)getCallDuration: (NSString *) callId;


/*!
 Mute or unmute microphone. This is reset after audio interruption
 @param b Enable/disable flag
 */

-(void)setMute: (bool) b;


/*!
 Enable/disable loudspeaker (doesn't make sence for iPad, since it has only loudspeaker)
 @param b Enable/disable flag
 */

-(bool)setUseLoudspeaker: (bool) b;


/*!
 Set video display mode. Applies to both incoming and outgoing streams
 @param mode @link VoxImplantVideoResizeMode @/link enum
 */

-(void)setVideoResizeMode:(enum VoxImplantVideoResizeMode) mode;


/*!
 Get video display mode. Applies to both incoming and outgoing streams
 */

-(enum VoxImplantVideoResizeMode)getVideoResizeMode;


/*!
 Stop/start sending video during the call
 */

-(void)sendVideo:(BOOL)doSend;


/*!
 Set container for local video preview
 @param view UIView
 */

-(void)setLocalPreview: (UIView *)view;


/*!
 Set container for remote video display
 @param view UIView
 */
-(void)setRemoteView: (UIView *) view;

/*!
 Set container for remote video display for call
 @param view UIView
 @param callId id of the call
 */
-(void)setRemoteView: (UIView *) view forCall: (NSString*) callId;


/*!
 Set resolution of video being sent to remote participant
 */
-(void)setResolution: (int) width andHeight: (int) height;


-(void)connectTo:(NSString *)host;

/*!
 Returns true if device has front facing camera
 */

-(BOOL) hasFrontFacingCamera;


/*!
 Switch to front/back camera
 */

-(BOOL) switchToCameraWithPosition: (AVCaptureDevicePosition) position;

@end
