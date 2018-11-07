/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import "VIMessagingModule.h"
#import "RCTConvert.h"
#import "Constants.h"
#import "Utils.h"
#import "CallManager.h"
#import "VIUserEvent.h"
#import "VIUserStatusEvent.h"
#import "VISubscribeEvent.h"
#import "VIUser.h"


#import "CocoaLumberjack.h"

@interface VIMessagingModule()
@property(nonatomic, assign) BOOL listenerAdded;
@end

@implementation VIMessagingModule
RCT_EXPORT_MODULE();



- (NSArray<NSString *> *)supportedEvents {
    return @[kEventMesGetUser,
             kEventMesEditUser,
             kEventMesSetStatus,
             kEventMesSubscribe,
             kEventMesUnsubscribe,
             kEventMesGetConversation,
             kEventMesCreateConversation,
             kEventMesRemoveConversation];
}

- (VIMessenger *)getMessenger {
    VIMessenger *messenger = [CallManager getClient].messenger;
    if (messenger && !_listenerAdded) {
        [messenger addDelegate:self];
    }
    return messenger;
}

- (NSDictionary *)convertUserEvent:(VIUserEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    
    VIUser *user = event.user;
    if (user) {
        NSMutableDictionary *userDictionary = [NSMutableDictionary new];
        if (user.conversationList) {
            [userDictionary setObject:user.conversationList forKey:kEventMesParamConversationList];
        }
        if (user.customData) {
            [userDictionary setObject:user.customData forKey:kEventMesParamCustomData];
        }
        if (user.privateCustomData) {
            [userDictionary setObject:user.privateCustomData forKey:kEventMesParamPrivateCustomData];
        }
        if (user.userId) {
            [userDictionary setObject:user.userId forKey:kEventMesParamEventUserId];
        }
        if (user.notifications) {
            NSMutableArray<NSString *> *notifications = [NSMutableArray new];
            NSLog(@"YULIA %@", user.notifications);
            for (NSNumber* notification in user.notifications) {
                NSLog(@"Notification: %@", notification);
                if ([notification isEqualToNumber:[NSNumber numberWithInteger:VIMessengerNotificationSendMessage]]) {
                    [notifications addObject:kSendMessage];
                } else if ([notification isEqualToNumber:[NSNumber numberWithInteger:VIMessengerNotificationEditMessage]]) {
                    [notifications addObject:kEditMessage];
                }
            }
            [userDictionary setObject:notifications forKey:kEventMesParamUserMessengerNotifications];
        }
        if (user.leaveConversationList) {
            //TODO
        }
        [dictionary setObject:userDictionary forKey:kEventMesParamUser];
    }
    
    return dictionary;
}

- (NSDictionary *)convertUserStatusEvent:(VIUserStatusEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    
    NSMutableDictionary *statusDictionary = [NSMutableDictionary new];
    [statusDictionary setObject:@(event.online) forKey:kEventMesParamOnline];
    if (event.timestamp) {
        [statusDictionary setObject:event.timestamp forKey:kEventMesParamUserTimestamp];
    }
    [dictionary setObject:statusDictionary forKey:kEventMesParamUserStatus];
    
    return dictionary;
}

- (NSDictionary *)convertSubscriptionEvent:(VISubscribeEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    if (event.users) {
        [dictionary setObject:event.users forKey:kEventMesParamUsers];
    }
    
    return dictionary;
}

RCT_EXPORT_METHOD(getUser:(NSString *)user) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger getUser:user];
    }
}

RCT_EXPORT_METHOD(getUsers:(NSArray<NSString *> *)users) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger getUsers:users];
    }
}

RCT_REMAP_METHOD(editUser, editUserCustomData:(NSDictionary *)customData privateCustomData:(NSDictionary *)privateCustomData) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger editUserWithCustomData:customData privateCustomData:privateCustomData];
    }
}

RCT_EXPORT_METHOD(setStatus:(BOOL)online) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger setStatus:online];
    }
}

RCT_EXPORT_METHOD(subscribe:(NSArray<NSString *> *)users) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger subscribe:users];
    }
}

RCT_EXPORT_METHOD(unsubscribe:(NSArray<NSString *> *)users) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger unsubscribe:users];
    }
}

RCT_EXPORT_METHOD(manageNotifications:(NSArray<NSString *> *)notifications) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        NSMutableArray<NSNumber *> *enumNotifications = [NSMutableArray new];
        for (NSString *notification in notifications) {
            if ([notification isEqualToString:kSendMessage]) {
                [enumNotifications addObject:@(VIMessengerNotificationSendMessage)];
            } else if ([notification isEqualToString:kEditMessage]){
                [enumNotifications addObject:@(VIMessengerNotificationEditMessage)];
            }
        }
        [messenger managePushNotifications:enumNotifications];
    }
}

- (void)messenger:(VIMessenger *)messenger didCreateConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditMessage:(VIMessageEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditUser:(VIUserEvent *)event {
    [self sendEventWithName:kEventMesEditUser body:[self convertUserEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didGetConversation:(VIConversationEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didGetUser:(VIUserEvent *)event {
    [self sendEventWithName:kEventMesGetUser body:[self convertUserEvent:event]];
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
    [self sendEventWithName:kEventMesSetStatus body:[self convertUserStatusEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didSubscribe:(VISubscribeEvent *)event {
    [self sendEventWithName:kEventMesSubscribe body:[self convertSubscriptionEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didUnsubscribe:(VISubscribeEvent *)event {
    [self sendEventWithName:kEventMesUnsubscribe body:[self convertSubscriptionEvent:event]];
}

@end
