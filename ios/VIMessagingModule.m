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
#import "VIConversationParticipant.h"
#import "VIConversationEvent.h"
#import "VIConversation.h"

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
             kEventMesRemoveConversation,
             kEventMesEditConversation];
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
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

- (NSDictionary *)convertConversationEvent:(VIConversationEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.seq) {
        [dictionary setObject:event.seq forKey:kEventMesParamSequence];
    }
    
    VIConversation *conversation = event.conversation;
    if (conversation) {
        NSMutableDictionary *conversationDictionary = [NSMutableDictionary new];
        if (conversation.createdAt) {
            [conversationDictionary setObject:conversation.createdAt forKey:kEventMesParamCreatedAt];
        }
        if (conversation.lastUpdate) {
            [conversationDictionary setObject:conversation.lastUpdate forKey:kEventMesParamLastUpdate];
        }
        if (conversation.customData) {
            [conversationDictionary setObject:conversation.customData forKey:kEventMesParamCustomData];
        }
        if (conversation.lastRead) {
            [conversationDictionary setObject:conversation.lastRead forKey:kEventMesParamLastRead];
        }
        if (conversation.lastSeq) {
            [conversationDictionary setObject:conversation.lastSeq forKey:kEventMesParamLastSeq];
        }
        if (conversation.uuid) {
            [conversationDictionary setObject:conversation.uuid forKey:kEventMesParamUuid];
        }
        if (conversation.title) {
            [conversationDictionary setObject:conversation.title forKey:kEventMesParamTitle];
        }
        if (conversation.participants) {
            NSMutableArray<NSDictionary *> *conversationParticipants = [NSMutableArray new];
            for (VIConversationParticipant *participant in conversation.participants) {
                NSMutableDictionary * conversationParticipant = [NSMutableDictionary new];
                if (participant.userId) {
                    [conversationParticipant setObject:participant.userId forKey:kEventMesParamEventUserId];
                }
                [conversationParticipant setObject:@(participant.canWrite) forKey:kEventMesParamCanWrite];
                [conversationParticipant setObject:@(participant.canManageParticipants) forKey:kEventMesParamCanManageParticipants];
                [conversationParticipants addObject:conversationParticipant];
            }
            [conversationDictionary setObject:conversationParticipants forKey:kEventMesParamParticipants];
        }
        [conversationDictionary setObject:@(conversation.distinct) forKey:kEventMesParamDistinct];
        [conversationDictionary setObject:@(conversation.publicJoin) forKey:kEventMesParamPublicJoin];
        [conversationDictionary setObject:@(conversation.isUberConversation) forKey:kEventMesParamIsUber];
        
        [dictionary setObject:conversationDictionary forKey:kEventMesParamConversation];
    }
    
    return dictionary;
}

- (NSMutableArray<VIConversationParticipant *> *)convertDictionaryToParicipants:(NSArray<NSDictionary *> *)participants {
    NSMutableArray<VIConversationParticipant *> *conversationParticipants = [NSMutableArray new];
    for (NSDictionary *participant in participants) {
        VIConversationParticipant * conversationParticipant = [[VIConversationParticipant alloc] initWithUserId:[RCTConvert NSString:participant[@"userId"]]
                                                                                                       canWrite:[RCTConvert BOOL:participant[@"canWrite"]]
                                                                                          canManageParticipants:[RCTConvert BOOL:participant[@"canManageParticipants"]]];
        [conversationParticipants addObject:conversationParticipant];
    }
    return conversationParticipants;
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

RCT_REMAP_METHOD(createConversation, createConversationWithParticipants:(NSArray<NSDictionary *> *)participants
                                                                   title:(NSString *)title
                                                                distinct:(BOOL)distinct
                                                              publicJoin:(BOOL)publicJoin
                                                              customData:(NSDictionary *)customData
                                                                    uber:(BOOL)isUber) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger createConversation:[self convertDictionaryToParicipants:participants]
                           moderators:[NSArray new]
                                title:title
                             distinct:distinct
                     enablePublicJoin:publicJoin
                           customData:customData
                     uberConversation:isUber];
    }
}

RCT_EXPORT_METHOD(getConversation:(NSString *)uuid) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger getConversation:uuid];
    }
}

RCT_EXPORT_METHOD(getConversations:(NSArray<NSString *> *)conversations) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger getConversations:conversations];
    }
}

RCT_EXPORT_METHOD(removeConversation:(NSString *)uuid) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        [messenger removeConversation:uuid];
    }
}

RCT_REMAP_METHOD(addParticipants, addParticipantsToConversation:(NSString *)uuid
                                                   participants:(NSArray<NSDictionary *> *)participants) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIConversation *conversation = [messenger recreateConversation:nil
                                                                 title:nil
                                                              distinct:false
                                                      enablePublicJoin:false
                                                            customData:nil
                                                                  uuid:uuid
                                                              sequence:nil
                                                            moderators:nil
                                                            lastUpdate:nil
                                                              lastRead:nil
                                                             createdAt:nil
                                                      uberConversation:false];
        [conversation addParticipants:[self convertDictionaryToParicipants:participants]];
    }
}

RCT_REMAP_METHOD(editParticipants, editParticipnatsInConversation:(NSString *)uuid
                                                     participants:(NSArray<NSDictionary *> *)participants) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIConversation *conversation = [messenger recreateConversation:nil
                                                                 title:nil
                                                              distinct:false
                                                      enablePublicJoin:false
                                                            customData:nil
                                                                  uuid:uuid
                                                              sequence:nil
                                                            moderators:nil
                                                            lastUpdate:nil
                                                              lastRead:nil
                                                             createdAt:nil
                                                      uberConversation:false];
        [conversation editParticipants:[self convertDictionaryToParicipants:participants]];
    }
}

RCT_REMAP_METHOD(removeParticipants, removeParticipantsFromConversation:(NSString *)uuid
                                                           participants:(NSArray<NSDictionary *> *)participants) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIConversation *conversation = [messenger recreateConversation:nil
                                                                 title:nil
                                                              distinct:false
                                                      enablePublicJoin:false
                                                            customData:nil
                                                                  uuid:uuid
                                                              sequence:nil
                                                            moderators:nil
                                                            lastUpdate:nil
                                                              lastRead:nil
                                                             createdAt:nil
                                                      uberConversation:false];
        [conversation removeParticipants:[self convertDictionaryToParicipants:participants]];
    }
}

RCT_REMAP_METHOD(updateConversation, updateConversation:(NSString *)uuid
                                                   title:(NSString *)title
                                              publicJoin:(BOOL)publicJoin
                                                distinct:(BOOL)distinct
                                              customData:(NSDictionary *)customData) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIConversation *conversation = [messenger recreateConversation:nil
                                                                 title:nil
                                                              distinct:false
                                                      enablePublicJoin:false
                                                            customData:nil
                                                                  uuid:uuid
                                                              sequence:nil
                                                            moderators:nil
                                                            lastUpdate:nil
                                                              lastRead:nil
                                                             createdAt:nil
                                                      uberConversation:false];
        conversation.title = title;
        conversation.publicJoin = publicJoin;
        conversation.distinct = distinct;
        conversation.customData = customData;
        [conversation update];
    }
}

- (void)messenger:(VIMessenger *)messenger didCreateConversation:(VIConversationEvent *)event {
    [self sendEventWithName:kEventMesCreateConversation body:[self convertConversationEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didEditConversation:(VIConversationEvent *)event {
    [self sendEventWithName:kEventMesEditConversation body:[self convertConversationEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didEditMessage:(VIMessageEvent *)event {

}

- (void)messenger:(VIMessenger *)messenger didEditUser:(VIUserEvent *)event {
    [self sendEventWithName:kEventMesEditUser body:[self convertUserEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didGetConversation:(VIConversationEvent *)event {
    [self sendEventWithName:kEventMesGetConversation body:[self convertConversationEvent:event]];
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
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.seq) {
        [dictionary setObject:event.seq forKey:kEventMesParamSequence];
    }
    VIConversation *conversation = event.conversation;
    if (conversation) {
        NSMutableDictionary *conversationDictionary = [NSMutableDictionary new];
        if (conversation.uuid) {
            [conversationDictionary setObject:conversation.uuid forKey:kEventMesParamUuid];
        }
        [dictionary setObject:conversationDictionary forKey:kEventMesParamConversation];
    }
    [self sendEventWithName:kEventMesRemoveConversation body:dictionary];
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
