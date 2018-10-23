/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "VIMessagingModule.h"
#import "Constants.h"
#import "Utils.h"

@interface VIMessagingModule()
@end

@implementation VIMessagingModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventCallConnected];
}

RCT_EXPORT_METHOD(disconnect) {

}

- (void)messenger:(VIMessenger *)messenger didCreateConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditMessage:(VIMessageEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditUser:(VIUserEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didGetConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didGetUser:(VIUserEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didReceiveDeliveryConfirmation:(VIConversationServiceEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didReceiveError:(VIErrorEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didReceiveReadConfirmation:(VIConversationServiceEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didReceiveTypingNotification:(VIConversationServiceEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didRemoveConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didRemoveMessage:(VIMessageEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didRetransmitEvents:(VIRetransmitEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didSendMessage:(VIMessageEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didSetStatus:(VIUserStatusEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didSubscribe:(VISubscribeEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didUnsubscribe:(VISubscribeEvent *)event {

}

@end
