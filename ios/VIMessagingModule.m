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
#import "VIConversationServiceEvent.h"
#import "VIPayload.h"
#import "VIMessageEvent.h"
#import "VIMessage.h"
#import "VIRetransmitEvent.h"
#import "VIErrorEvent.h"

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
             kEventMesEditConversation,
             kEventMesTyping,
             kEventMesSendMessage,
             kEventMesEditMessage,
             kEventMesRemoveMessage,
             kEventMesDelivered,
             kEventMesRead,
             kEventMesRetransmitEvents,
             kEventMesError];
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

- (NSDictionary *)convertConversationServiceEvent:(VIConversationServiceEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.seq) {
        [dictionary setObject:event.seq forKey:kEventMesParamSequence];
    }
    if (event.timestamp) {
        [dictionary setObject:event.timestamp forKey:kEventMesParamUserTimestamp];
    }
    if (event.conversationUUID) {
        [dictionary setObject:event.conversationUUID forKey:kEventMesParamConversationUuid];
    }
    
    return dictionary;
}

- (NSArray<VIPayload *> *)convertArrayToPayloadsArray:(NSArray<NSDictionary *> *)array {
    NSMutableArray<VIPayload *> *payloads = [NSMutableArray new];
    for (NSDictionary *dictionary in array) {
        VIPayload *payload = [[VIPayload alloc] initWithTitle:[RCTConvert NSString:dictionary[@"title"]]
                                                         type:[RCTConvert NSString:dictionary[@"type"]]
                                               dataDictionary:[RCTConvert NSDictionary:dictionary[@"data"]]];
        [payloads addObject:payload];
    }
    return payloads;
}

- (NSArray<NSDictionary *> *)convertPayloadsArrayToArray:(NSArray<VIPayload *> *)payloads {
    NSMutableArray<NSDictionary *> *array = [NSMutableArray new];
    for (VIPayload *payload in payloads) {
        NSMutableDictionary *dictionary = [NSMutableDictionary new];
        if (payload.title) {
            [dictionary setObject:payload.title forKey:kEventMesParamTitle];
        }
        if (payload.type) {
            [dictionary setObject:payload.type forKey:kEventMesParamType];
        }
        if (payload.data) {
            [dictionary setObject:payload.data forKey:kEventMesParamData];
        }
        [array addObject:dictionary];
    }
    return array;
}

- (NSDictionary *)convertMessageEvent:(VIMessageEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.seq) {
        [dictionary setObject:event.seq forKey:kEventMesParamSequence];
    }
    if (event.timestamp) {
        [dictionary setObject:event.timestamp forKey:kEventMesParamUserTimestamp];
    }
    VIMessage *message = event.message;
    if (message) {
        NSMutableDictionary *messageDictionary = [NSMutableDictionary new];
        if (message.conversation) {
            [messageDictionary setObject:message.conversation forKey:kEventMesParamConversation];
        }
        if (message.sender) {
            [messageDictionary setObject:message.sender forKey:kEventMesParamSender];
        }
        if (message.uuid) {
            [messageDictionary setObject:message.uuid forKey:kEventMesParamUuid];
        }
        if (message.seq) {
            [messageDictionary setObject:message.seq forKey:kEventMesParamSequence];
        }
        if (message.text) {
            [messageDictionary setObject:message.text forKey:kEventMesParamText];
        }
        if (message.payload) {
            [messageDictionary setObject:[self convertPayloadsArrayToArray:message.payload] forKey:kEventMesParamPayload];
        }
        [dictionary setObject:messageDictionary forKey:kEventMesParamMessage];
    }
    
    return dictionary;
}

- (NSDictionary *)convertRetrasmitEvent:(VIRetransmitEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.fromSequence) {
        [dictionary setObject:event.fromSequence forKey:kEventMesParamFromSequence];
    }
    if (event.toSequence) {
        [dictionary setObject:event.toSequence forKey:kEventMesParamToSequence];
    }
    if (event.events) {
        NSMutableArray *eventsArray = [NSMutableArray new];
        for (VIMessengerEvent *messengerEvent in event.events) {
            if ([messengerEvent isKindOfClass:[VIConversationEvent class]]) {
                NSDictionary *conversationEvent = [self convertConversationEvent:(VIConversationEvent *)messengerEvent];
                [eventsArray addObject:conversationEvent];
            }
            if ([messengerEvent isKindOfClass:[VIMessageEvent class]]) {
                NSDictionary *messageEvent = [self convertMessageEvent:(VIMessageEvent *)messengerEvent];
                [eventsArray addObject:messageEvent];
            }
        }
        [dictionary setObject:eventsArray forKey:kEventMesParamEvents];
    }
    
    return dictionary;
}

- (NSDictionary *)convertErrorEvent:(VIErrorEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.incomingAction] forKey:kEventMesParamAction];
    if (event.userId) {
        [dictionary setObject:event.userId forKey:kEventMesParamEventUserId];
    }
    if (event.errorDescription) {
        [dictionary setObject:event.errorDescription forKey:kEventMesParamDescription];
    }
    [dictionary setObject:[NSNumber numberWithInteger:event.code] forKey:kEventMesParamCode];
    
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
                                                  isUber:(BOOL)isUber
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
                                                      uberConversation:isUber];
        conversation.title = title;
        conversation.publicJoin = publicJoin;
        conversation.distinct = distinct;
        conversation.customData = customData;
        [conversation update];
    }
}

RCT_EXPORT_METHOD(typing:(NSString *)uuid) {
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
        [conversation typing];
    }
}

RCT_REMAP_METHOD(sendMessage, sendMessageToConversation:(NSString *)uuid message:(NSString *)message payload:(NSArray<NSDictionary *> *)payload) {
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
        [conversation sendMessage:message payload:[self convertArrayToPayloadsArray:payload]];
    }
}

RCT_REMAP_METHOD(updateMessage, updateMessageInConversation:(NSString *)conversationUuid uuid:(NSString *)uuid text:(NSString *)text payload:(NSArray<NSDictionary *> *) payload) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIMessage *message = [messenger recreateMessage:uuid
                                           conversation:conversationUuid
                                                 sender:nil
                                                   text:nil
                                                payload:nil
                                               sequence:nil];
        message.text = text;
        message.payload = [self convertArrayToPayloadsArray:payload];
        [message update];
    }
}

RCT_REMAP_METHOD(removeMessage, removeMessageFromConversation:(NSString *)conversationUuid uuid:(NSString *)uuid) {
    VIMessenger *messenger = [self getMessenger];
    if (messenger) {
        VIMessage *message = [messenger recreateMessage:uuid
                                           conversation:conversationUuid
                                                 sender:nil
                                                   text:nil
                                                payload:nil
                                               sequence:nil];
        [message remove];
    }
}

RCT_REMAP_METHOD(markAsDelivered, markAsDeliveredForConversation:(NSString *)uuid sequence:(NSNumber *)sequence) {
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
        [conversation markAsDelivered:sequence];
    }
}

RCT_REMAP_METHOD(markAsRead, markAsReadForConversation:(NSString *)uuid sequqnce:(NSNumber *)sequence) {
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
        [conversation markAsRead:sequence];
    }
}

RCT_REMAP_METHOD(retransmitEvents, retransmitEventsForConversation:(NSString *)uuid from:(nonnull NSNumber *)from to:(nonnull NSNumber *)to) {
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
        [conversation retransmitEventsFrom:from to:to];
    }
}

- (void)messenger:(VIMessenger *)messenger didCreateConversation:(VIConversationEvent *)event {
    [self sendEventWithName:kEventMesCreateConversation body:[self convertConversationEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didEditConversation:(VIConversationEvent *)event {
    [self sendEventWithName:kEventMesEditConversation body:[self convertConversationEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didEditMessage:(VIMessageEvent *)event {
    [self sendEventWithName:kEventMesEditMessage body:[self convertMessageEvent:event]];
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
    [self sendEventWithName:kEventMesDelivered body:[self convertConversationServiceEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didReceiveError:(VIErrorEvent *)event {
    [self sendEventWithName:kEventMesError body:[self convertErrorEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didReceiveReadConfirmation:(VIConversationServiceEvent *)event {
    [self sendEventWithName:kEventMesRead body:[self convertConversationServiceEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didReceiveTypingNotification:(VIConversationServiceEvent *)event {
    [self sendEventWithName:kEventMesTyping body:[self convertConversationServiceEvent:event]];
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
    [self sendEventWithName:kEventMesRemoveMessage body:[self convertMessageEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didRetransmitEvents:(VIRetransmitEvent *)event {
    [self sendEventWithName:kEventMesRetransmitEvents body:[self convertRetrasmitEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didSendMessage:(VIMessageEvent *)event {
    [self sendEventWithName:kEventMesSendMessage body:[self convertMessageEvent:event]];
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
