/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "VIMessagingModule.h"
#import "RCTConvert.h"
#import "Constants.h"
#import "Utils.h"
#import "CallManager.h"

@interface VIMessagingModule()
@property(nonatomic, assign) BOOL hasListeners;
@property(nonatomic, weak, readonly, getter=getMessenger) VIMessenger *messenger;
@end

@implementation VIMessagingModule
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventMesEditUser,
             kEventMesSetStatus,
             kEventMesSubscribe,
             kEventMesUnsubscribe,
             kEventMesCreateConversation,
             kEventMesRemoveConversation,
             kEventMesEditConversation,
             kEventMesTyping,
             kEventMesSendMessage,
             kEventMesEditMessage,
             kEventMesRemoveMessage,
             kEventMesRead];
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (VIMessenger *)getMessenger {
    return [CallManager getClient].messenger;
}

- (void)startObserving {
    [self.messenger addDelegate:self];
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving {
    [self.messenger removeDelegate:self];
}

- (NSDictionary *)convertUserEvent:(VIUserEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    
    VIUser *user = event.user;
    if (user) {
        NSMutableDictionary *userDictionary = [NSMutableDictionary new];
        [userDictionary setObject:@(user.deleted) forKey:kEventMesParamIsDeleted];
        if (user.imId) {
            [userDictionary setObject:user.imId forKey:kEventMesParamIMId];
        }
        if (user.name) {
            [userDictionary setObject:user.name forKey:kEventMesParamName];
        }
        if (user.displayName) {
            [userDictionary setObject:user.displayName forKey:kEventMesParamDisplayName];
        }
        if (user.conversationList) {
            [userDictionary setObject:user.conversationList forKey:kEventMesParamConversationList];
        }
        if (user.customData) {
            [userDictionary setObject:user.customData forKey:kEventMesParamCustomData];
        }
        if (user.privateCustomData) {
            [userDictionary setObject:user.privateCustomData forKey:kEventMesParamPrivateCustomData];
        }
        if (user.notifications) {
            NSMutableArray<NSString *> *notifications = [NSMutableArray new];
            for (NSString* notification in user.notifications) {
                [notifications addObject:[Utils convertMessengerNotificationToString:notification]];
            }
            [userDictionary setObject:notifications forKey:kEventMesParamUserNotifications];
        }
        if (user.leaveConversationList) {
            [userDictionary setObject:user.leaveConversationList forKey:kEventMesParamLeaveConversationList];
        }
        [dictionary setObject:userDictionary forKey:kEventMesParamUser];
    }
    
    return dictionary;
}

- (NSDictionary *)convertStatusEvent:(VIStatusEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.online) forKey:kEventMesParamOnline];

    return dictionary;
}

- (NSDictionary *)convertSubscriptionEvent:(VISubscriptionEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    if (event.users) {
        [dictionary setObject:event.users forKey:kEventMesParamUsers];
    }

    return dictionary;
}

- (NSDictionary *)convertConversationEvent:(VIConversationEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.sequence) forKey:kEventMesParamSequence];
    [dictionary setObject:@(event.timestamp) forKey:kEventMesParamTimestamp];

    VIConversation *conversation = event.conversation;
    if (conversation) {
        NSMutableDictionary *conversationDictionary = [NSMutableDictionary new];
        [conversationDictionary setObject:@(conversation.createdTime) forKey:kEventMesParamCreatedTime];
        [conversationDictionary setObject:@(conversation.lastUpdateTime) forKey:kEventMesParamLastUpdateTime];
        [conversationDictionary setObject:@(conversation.lastSequence) forKey:kEventMesParamLastSequence];
        [conversationDictionary setObject:@(conversation.direct) forKey:kEventMesParamDirect];
        [conversationDictionary setObject:@(conversation.publicJoin) forKey:kEventMesParamPublicJoin];
        [conversationDictionary setObject:@(conversation.uber) forKey:kEventMesParamUber];
        if (conversation.customData) {
            [conversationDictionary setObject:conversation.customData forKey:kEventMesParamCustomData];
        }
        if (conversation.uuid) {
            [conversationDictionary setObject:conversation.uuid forKey:kEventMesParamUuid];
        }
        if (conversation.title) {
            [conversationDictionary setObject:conversation.title forKey:kEventMesParamTitle];
        }
        if (conversation.participants) {
            [conversationDictionary setObject:[self converConversationParticipantsToArray:conversation.participants]
                                       forKey:kEventMesParamParticipants];
        }
        [dictionary setObject:conversationDictionary forKey:kEventMesParamConversation];
    }
    return dictionary;
}

- (NSArray<VIConversationParticipant *> *)convertDictionaryToParicipants:(NSArray<NSDictionary <NSString *, NSNumber *> *> *)participants {
    NSMutableArray<VIConversationParticipant *> *conversationParticipants = [NSMutableArray new];
    for (NSDictionary *participant in participants) {
        if ([participant objectForKey:kEventMesParamEventIMUserId]) {
            VIConversationParticipant * conversationParticipant = [[VIConversationParticipant alloc]
                                                                   initWithIMUserId:[participant objectForKey:kEventMesParamEventIMUserId]];
            if ([participant objectForKey:kEventMesParamCanWrite]) {
                conversationParticipant.canWrite = ((NSNumber *)[participant objectForKey:kEventMesParamCanWrite]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamCanManageParticipants]) {
                conversationParticipant.canManageParticipants = ((NSNumber *)[participant objectForKey:kEventMesParamCanManageParticipants]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamCanEditMessages]) {
                conversationParticipant.canEditMessages = ((NSNumber *)[participant objectForKey:kEventMesParamCanEditMessages]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamCanEditAllMessages]) {
                conversationParticipant.canEditAllMessages = ((NSNumber *)[participant objectForKey:kEventMesParamCanEditAllMessages]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamCanRemoveMessages]) {
                conversationParticipant.canRemoveMessages = ((NSNumber *)[participant objectForKey:kEventMesParamCanRemoveMessages]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamCanRemoveAllMessages]) {
                conversationParticipant.canRemoveAllMessages = ((NSNumber *)[participant objectForKey:kEventMesParamCanRemoveAllMessages]).boolValue;
            }
            if ([participant objectForKey:kEventMesParamOwner]) {
                conversationParticipant.owner = ((NSNumber *)[participant objectForKey:kEventMesParamOwner]).boolValue;
            }
            [conversationParticipants addObject:conversationParticipant];
        }
    }
    return conversationParticipants;
}

- (NSArray *)converConversationParticipantsToArray:(NSArray<VIConversationParticipant *> *)participants {
    NSMutableArray<NSDictionary *> *conversationParticipants = [NSMutableArray new];
    for (VIConversationParticipant *participant in participants) {
        NSMutableDictionary * conversationParticipant = [NSMutableDictionary new];
        if (participant.imUserId) {
            [conversationParticipant setObject:participant.imUserId forKey:kEventMesParamEventIMUserId];
            [conversationParticipant setObject:@(participant.canWrite) forKey:kEventMesParamCanWrite];
            [conversationParticipant setObject:@(participant.canManageParticipants) forKey:kEventMesParamCanManageParticipants];
            [conversationParticipant setObject:@(participant.canEditMessages) forKey:kEventMesParamCanEditMessages];
            [conversationParticipant setObject:@(participant.canEditAllMessages) forKey:kEventMesParamCanEditAllMessages];
            [conversationParticipant setObject:@(participant.canRemoveMessages) forKey:kEventMesParamCanRemoveMessages];
            [conversationParticipant setObject:@(participant.canRemoveAllMessages) forKey:kEventMesParamCanRemoveAllMessages];
            [conversationParticipant setObject:@(participant.lastReadEventSequence) forKey:kEventMesParamLastRead];
            [conversationParticipant setObject:@(participant.owner) forKey:kEventMesParamOwner];
            [conversationParticipants addObject:conversationParticipant];
        }
    }
    return conversationParticipants;
}

- (NSDictionary *)convertConversationListEvent:(VIConversationListEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:event.conversationList forKey:kEventMesParamConversationList];
    return dictionary;
}


- (NSDictionary *)convertConversationServiceEvent:(VIConversationServiceEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.sequence) forKey:kEventMesParamSequence];
    if (event.conversationUUID) {
        [dictionary setObject:event.conversationUUID forKey:kEventMesParamConversationUuid];
    }
    return dictionary;
}

- (NSDictionary *)convertMessageEvent:(VIMessageEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.sequence) forKey:kEventMesParamSequence];
    [dictionary setObject:@(event.timestamp) forKey:kEventMesParamTimestamp];

    VIMessage *message = event.message;
    if (message) {
        NSMutableDictionary *messageDictionary = [NSMutableDictionary new];
        [messageDictionary setObject:@(message.sequence) forKey:kEventMesParamSequence];
        if (message.conversation) {
            [messageDictionary setObject:message.conversation forKey:kEventMesParamConversation];
        }
        if (message.uuid) {
            [messageDictionary setObject:message.uuid forKey:kEventMesParamUuid];
        }
        if (message.text) {
            [messageDictionary setObject:message.text forKey:kEventMesParamText];
        }
        if (message.payload) {
            [messageDictionary setObject:message.payload forKey:kEventMesParamPayload];
        }
        [dictionary setObject:messageDictionary forKey:kEventMesParamMessage];
    }
    return dictionary;
}

- (NSDictionary *)convertRetrasmitEvent:(VIRetransmitEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.fromSequence) forKey:kEventMesParamFromSequence];
    [dictionary setObject:@(event.toSequence) forKey:kEventMesParamToSequence];
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
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    if (event.errorDescription) {
        [dictionary setObject:event.errorDescription forKey:kEventMesParamDescription];
    }
    [dictionary setObject:[NSNumber numberWithInteger:event.errorCode] forKey:kEventMesParamCode];
    
    return dictionary;
}

- (NSDictionary *)createErrorEventInvalidArgument:(VIMessengerAction)action {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:kEventNameMesError forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:action] forKey:kEventMesParamAction];
    [dictionary setObject:[NSNumber numberWithInteger:10001] forKey:kEventMesParamCode];
    [dictionary setObject:kInvalidArguments forKey:kEventMesParamDescription];
    return dictionary;
}

RCT_REMAP_METHOD(getUserByName, getUserByName:(NSString *)user responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getUserByName:user
                  completion:[VIMessengerCompletion<VIUserEvent*> success:^(VIUserEvent * _Nonnull result) {
        __strong VIMessagingModule *strongSelf = weakSelf;
        NSDictionary *event = [strongSelf convertUserEvent:result];
        callback(@[event, [NSNull null]]);
    } failure:^(VIErrorEvent * _Nonnull errorEvent) {
        __strong VIMessagingModule *strongSelf = weakSelf;
        NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
        callback(@[[NSNull null], error]);
    }]];
}

RCT_REMAP_METHOD(getUserById, getUserById:(nonnull NSNumber *)imUserId responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getUserByIMId:imUserId
                  completion:[VIMessengerCompletion<VIUserEvent*> success:^(VIUserEvent * _Nonnull result) {
        __strong VIMessagingModule *strongSelf = weakSelf;
        NSDictionary *event = [strongSelf convertUserEvent:result];
        callback(@[event, [NSNull null]]);
    } failure:^(VIErrorEvent * _Nonnull errorEvent) {
        __strong VIMessagingModule *strongSelf = weakSelf;
        NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
        callback(@[[NSNull null], error]);
    }]];
}

RCT_REMAP_METHOD(getUsersByName, getUsersByName:(NSArray<NSString *> *)users responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getUsersByName:users
                   completion:[VIMessengerCompletion<NSArray<VIUserEvent *> *>
                               success:^(NSArray<VIUserEvent *> * _Nonnull result) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSMutableArray *userEvents = [NSMutableArray new];
                                   for (VIUserEvent *resultEvent in result) {
                                       [userEvents addObject:[strongSelf convertUserEvent:resultEvent]];
                                   }
                                   callback(@[userEvents, [NSNull null]]);
                               }
                               failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                   callback(@[[NSNull null], error]);
                               }]];
}

RCT_REMAP_METHOD(getUsersById, getUsersById:(NSArray<NSNumber *> *)users responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getUsersByIMId:users
                   completion:[VIMessengerCompletion<NSArray<VIUserEvent *> *>
                               success:^(NSArray<VIUserEvent *> * _Nonnull result) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSMutableArray *userEvents = [NSMutableArray new];
                                   for (VIUserEvent *resultEvent in result) {
                                       [userEvents addObject:[strongSelf convertUserEvent:resultEvent]];
                                   }
                                   callback(@[userEvents, [NSNull null]]);
                               }
                               failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                   callback(@[[NSNull null], error]);
                               }]];
}

RCT_REMAP_METHOD(editUser, editUserCustomData:(NSDictionary *)customData
                            privateCustomData:(NSDictionary *)privateCustomData
                             responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger editUserWithCustomData:customData
                    privateCustomData:privateCustomData
                           completion:[VIMessengerCompletion<VIUserEvent*>
                                       success:^(VIUserEvent * _Nonnull result) {
                                           __strong VIMessagingModule *strongSelf = weakSelf;
                                           NSDictionary *event = [strongSelf convertUserEvent:result];
                                           callback(@[event, [NSNull null]]);
                                       } failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                           __strong VIMessagingModule *strongSelf = weakSelf;
                                           NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                           callback(@[[NSNull null], error]);
                                       }]];
}

RCT_REMAP_METHOD(setStatus, setStatus:(BOOL)online responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger setStatus:online
                   completion:[VIMessengerCompletion<VIStatusEvent*>
                               success:^(VIStatusEvent * _Nonnull result) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *event = [strongSelf convertStatusEvent:result];
                                   callback(@[event, [NSNull null]]);
                               }
                               failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                   callback(@[[NSNull null], error]);
                               }]];
}

RCT_REMAP_METHOD(subscribe, subscribe:(NSArray<NSNumber *> *)users responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger subscribe:users
                   completion:[VIMessengerCompletion<VISubscriptionEvent *>
                               success:^(VISubscriptionEvent * _Nonnull result) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *event = [strongSelf convertSubscriptionEvent:result];
                                   callback(@[event, [NSNull null]]);
                               }
                               failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                   __strong VIMessagingModule *strongSelf = weakSelf;
                                   NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                   callback(@[[NSNull null], error]);
                               }]];
}

RCT_REMAP_METHOD(unsubscribe, unsubscribe:(NSArray<NSNumber *> *)users responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger unsubscribe:users
                     completion:[VIMessengerCompletion<VISubscriptionEvent *>
                                 success:^(VISubscriptionEvent * _Nonnull result) {
                                     __strong VIMessagingModule *strongSelf = weakSelf;
                                     NSDictionary *event = [strongSelf convertSubscriptionEvent:result];
                                     callback(@[event, [NSNull null]]);
                                 }
                                 failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                     __strong VIMessagingModule *strongSelf = weakSelf;
                                     NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                     callback(@[[NSNull null], error]);
                                 }]];
}

RCT_EXPORT_METHOD(unsubscribeFromAll:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger unsubscribeFromAll:[VIMessengerCompletion<VISubscriptionEvent *>
                                        success:^(VISubscriptionEvent * _Nonnull result) {
                                            __strong VIMessagingModule *strongSelf = weakSelf;
                                            NSDictionary *event = [strongSelf convertSubscriptionEvent:result];
                                            callback(@[event, [NSNull null]]);
                                        }
                                        failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                            __strong VIMessagingModule *strongSelf = weakSelf;
                                            NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                            callback(@[[NSNull null], error]);
                                        }]];
}

RCT_EXPORT_METHOD(getSubscriptions:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getSubscriptionList:[VIMessengerCompletion<VISubscriptionEvent *>
                                         success:^(VISubscriptionEvent * _Nonnull result) {
                                             __strong VIMessagingModule *strongSelf = weakSelf;
                                             NSDictionary *event = [strongSelf convertSubscriptionEvent:result];
                                             callback(@[event, [NSNull null]]);
                                         }
                                         failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                             __strong VIMessagingModule *strongSelf = weakSelf;
                                             NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                             callback(@[[NSNull null], error]);
                                         }]];
}

RCT_REMAP_METHOD(manageNotifications, manageNotifications:(NSArray<NSString *> *)notifications responseCallback:(RCTResponseSenderBlock)callback) {
    NSMutableArray<VIMessengerNotification> *messengerNotifications = [NSMutableArray new];
    for (NSString *notification in notifications) {
        if ([notification isEqualToString:kSendMessage]) {
            [messengerNotifications addObject:VIMessengerNotificationSendMessage];
        } else if ([notification isEqualToString:kEditMessage]){
            [messengerNotifications addObject:VIMessengerNotificationEditMessage];
        }
    }
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger managePushNotifications:messengerNotifications
                                 completion:[VIMessengerCompletion<VIUserEvent *>
                                             success:^(VIUserEvent * _Nonnull result) {
                                                 __strong VIMessagingModule *strongSelf = weakSelf;
                                                 NSDictionary *event = [strongSelf convertUserEvent:result];
                                                 callback(@[event, [NSNull null]]);
                                             }
                                             failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                                 __strong VIMessagingModule *strongSelf = weakSelf;
                                                 NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                                 callback(@[[NSNull null], error]);
                                             }]];
}

RCT_REMAP_METHOD(createConversation, createConversationWithConfig:(NSDictionary *)config responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversationConfig *conversationConfig = [VIConversationConfig new];
    conversationConfig.title = [config objectForKey:kEventMesParamTitle];
    conversationConfig.customData = [config objectForKey:kEventMesParamCustomData];
    if ([config objectForKey:kEventMesParamDirect]) {
        conversationConfig.direct = [config objectForKey:kEventMesParamDirect];
    }
    if ([config objectForKey:kEventMesParamPublicJoin]) {
        conversationConfig.publicJoin = [config objectForKey:kEventMesParamPublicJoin];
    }
    if ([config objectForKey:kEventMesParamUber]) {
        conversationConfig.uber = [config objectForKey:kEventMesParamUber];
    }
    if ([config objectForKey:kEventMesParamParticipants]) {
        conversationConfig.participants = [self convertDictionaryToParicipants:[config objectForKey:kEventMesParamParticipants]];
    }
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger createConversation:conversationConfig
                            completion:[VIMessengerCompletion<VIConversationEvent *>
                                        success:^(VIConversationEvent * _Nonnull result) {
                                            __strong VIMessagingModule *strongSelf = weakSelf;
                                            NSDictionary *event = [strongSelf convertConversationEvent:result];
                                            callback(@[event, [NSNull null]]);
                                        }
                                        failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                            __strong VIMessagingModule *strongSelf = weakSelf;
                                            NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                            callback(@[[NSNull null], error]);
                                        }]];
}

RCT_REMAP_METHOD(getConversation, getConversation:(NSString *)uuid responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getConversation:uuid
                         completion:[VIMessengerCompletion<VIConversationEvent *>
                                     success:^(VIConversationEvent * _Nonnull result) {
                                         __strong VIMessagingModule *strongSelf = weakSelf;
                                         NSDictionary *event = [strongSelf convertConversationEvent:result];
                                         callback(@[event, [NSNull null]]);
                                     }
                                     failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                         __strong VIMessagingModule *strongSelf = weakSelf;
                                         NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                         callback(@[[NSNull null], error]);
                                     }]];
}

RCT_REMAP_METHOD(getConversations, getConversations:(NSArray<NSString *> *)conversations responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getConversations:conversations
                          completion:[VIMessengerCompletion<NSArray<VIConversationEvent *> *>
                                      success:^(NSArray<VIConversationEvent *> * _Nonnull result) {
                                          __strong VIMessagingModule *strongSelf = weakSelf;
                                          NSMutableArray *conversations = [NSMutableArray new];
                                          for (VIConversationEvent *event in result) {
                                              NSDictionary *conversation = [strongSelf convertConversationEvent:event];
                                              [conversations addObject:conversation];
                                          }
                                          callback(@[conversations, [NSNull null]]);
                                      }
                                      failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                          __strong VIMessagingModule *strongSelf = weakSelf;
                                          NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                          callback(@[[NSNull null], error]);
                                      }]];
}

RCT_EXPORT_METHOD(getPublicConversations: (RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger getPublicConversations:[VIMessengerCompletion<VIConversationListEvent *>
                                            success:^(VIConversationListEvent * _Nonnull result) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *event = [strongSelf convertConversationListEvent:result];
                                                callback(@[event, [NSNull null]]);
                                            }
                                            failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                                callback(@[[NSNull null], error]);
                                            }]];
}

RCT_REMAP_METHOD(addParticipants, addParticipantsToConversation:(NSString *)uuid
                                                   participants:(NSArray<NSDictionary *> *)participants
                                               responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    [conversation addParticipants:[self convertDictionaryToParicipants:participants]
                       completion:[VIMessengerCompletion<VIConversationEvent *>
                                   success:^(VIConversationEvent * _Nonnull result) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *event = [strongSelf convertConversationEvent:result];
                                       callback(@[event, [NSNull null]]);
                                   }
                                   failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                       callback(@[[NSNull null], error]);
                                   }]];
}

RCT_REMAP_METHOD(editParticipants, editParticipnatsInConversation:(NSString *)uuid
                                                     participants:(NSArray<NSDictionary *> *)participants
                                                 responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    [conversation editParticipants:[self convertDictionaryToParicipants:participants]
                       completion:[VIMessengerCompletion<VIConversationEvent *>
                                   success:^(VIConversationEvent * _Nonnull result) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *event = [strongSelf convertConversationEvent:result];
                                       callback(@[event, [NSNull null]]);
                                   }
                                   failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                       callback(@[[NSNull null], error]);
                                   }]];
}

RCT_REMAP_METHOD(removeParticipants, removeParticipantsFromConversation:(NSString *)uuid
                                                           participants:(NSArray<NSDictionary *> *)participants
                                                       responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    [conversation removeParticipants:[self convertDictionaryToParicipants:participants]
                        completion:[VIMessengerCompletion<VIConversationEvent *>
                                    success:^(VIConversationEvent * _Nonnull result) {
                                        __strong VIMessagingModule *strongSelf = weakSelf;
                                        NSDictionary *event = [strongSelf convertConversationEvent:result];
                                        callback(@[event, [NSNull null]]);
                                    }
                                    failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                        __strong VIMessagingModule *strongSelf = weakSelf;
                                        NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                        callback(@[[NSNull null], error]);
                                    }]];
}

RCT_REMAP_METHOD(updateConversation, updateConversation:(NSString *)uuid
                                                   title:(NSString *)title
                                              publicJoin:(BOOL)publicJoin
                                              customData:(NSDictionary *)customData
                                                  isUber:(BOOL)isUber
                                                  direct:(BOOL)direct
                                        responseCallback:(RCTResponseSenderBlock)callback
                                              ) {
    VIConversationConfig *config = [VIConversationConfig new];
    config.title = title;
    config.publicJoin = publicJoin;
    config.customData = customData;
    config.uber = isUber;
    config.direct = direct;
    VIConversation *conversation = [self.messenger recreateConversation:config uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation update:[VIMessengerCompletion<VIConversationEvent *>
                              success:^(VIConversationEvent * _Nonnull result) {
                                  __strong VIMessagingModule *strongSelf = weakSelf;
                                  NSDictionary *event = [strongSelf convertConversationEvent:result];
                                  callback(@[event, [NSNull null]]);
                              }
                              failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                  __strong VIMessagingModule *strongSelf = weakSelf;
                                  NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                  callback(@[[NSNull null], error]);
                              }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionEditConversation];
        callback(@[[NSNull null], error]);
    }
}

RCT_EXPORT_METHOD(typing:(NSString *)uuid responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation typing:[VIMessengerCompletion<VIConversationServiceEvent *>
                              success:^(VIConversationServiceEvent * _Nonnull result) {
                                  __strong VIMessagingModule *strongSelf = weakSelf;
                                  NSDictionary *event = [strongSelf convertConversationServiceEvent:result];
                                  callback(@[event, [NSNull null]]);
                              }
                              failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                  __strong VIMessagingModule *strongSelf = weakSelf;
                                  NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                  callback(@[[NSNull null], error]);
                              }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionTyping];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(markAsRead, markAsReadForConversation:(NSString *)uuid
                                              sequqnce:(nonnull NSNumber *)sequence
                                      responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation markAsRead:sequence.longLongValue
                      completion:[VIMessengerCompletion<VIConversationServiceEvent *>
                                  success:^(VIConversationServiceEvent * _Nonnull result) {
                                      __strong VIMessagingModule *strongSelf = weakSelf;
                                      NSDictionary *event = [strongSelf convertConversationServiceEvent:result];
                                      callback(@[event, [NSNull null]]);
                                  }
                                  failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                      __strong VIMessagingModule *strongSelf = weakSelf;
                                      NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                      callback(@[[NSNull null], error]);
                                  }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionIsRead];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(sendMessage, sendMessageToConversation:(NSString *)uuid
                                                message:(NSString *)text
                                                payload:(NSArray<NSDictionary *> *)payload
                                       responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation sendMessage:text
                          payload:payload
                       completion:[VIMessengerCompletion<VIMessageEvent *>
                                   success:^(VIMessageEvent * _Nonnull result) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *event = [strongSelf convertMessageEvent:result];
                                       callback(@[event, [NSNull null]]);
                                   }
                                   failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                       __strong VIMessagingModule *strongSelf = weakSelf;
                                       NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                       callback(@[[NSNull null], error]);
                                   }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionSendMessage];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(updateMessage, updateMessageInConversation:(NSString *)conversationUuid
                                                       uuid:(NSString *)uuid
                                                       text:(NSString *)text
                                                    payload:(NSArray<NSDictionary *> *) payload
                                           responseCallback:(RCTResponseSenderBlock)callback) {
    VIMessage *message = [self.messenger recreateMessage:uuid conversation:conversationUuid text:[NSString string] payload:nil sequence:0];
    if (message) {
        __weak VIMessagingModule *weakSelf = self;
        [message update:text payload:payload
             completion:[VIMessengerCompletion<VIMessageEvent *>
                         success:^(VIMessageEvent * _Nonnull result) {
                             __strong VIMessagingModule *strongSelf = weakSelf;
                             NSDictionary *event = [strongSelf convertMessageEvent:result];
                             callback(@[event, [NSNull null]]);
                         }
                         failure:^(VIErrorEvent * _Nonnull errorEvent) {
                             __strong VIMessagingModule *strongSelf = weakSelf;
                             NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                             callback(@[[NSNull null], error]);
                         }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionEditMessage];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(removeMessage, removeMessageFromConversation:(NSString *)conversationUuid
                                                         uuid:(NSString *)uuid
                                             responseCallback:(RCTResponseSenderBlock)callback) {
    VIMessage *message = [self.messenger recreateMessage:uuid conversation:conversationUuid text:[NSString string] payload:nil sequence:0];
    if (message) {
        __weak VIMessagingModule *weakSelf = self;
        [message remove:[VIMessengerCompletion<VIMessageEvent *> success:^(VIMessageEvent * _Nonnull result) {
            __strong VIMessagingModule *strongSelf = weakSelf;
            NSDictionary *event = [strongSelf convertMessageEvent:result];
            callback(@[event, [NSNull null]]);
        } failure:^(VIErrorEvent * _Nonnull errorEvent) {
            __strong VIMessagingModule *strongSelf = weakSelf;
            NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
            callback(@[[NSNull null], error]);
        }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionRemoveMessage];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(leaveConversation, leaveConversation:(NSString *)uuid responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger leaveConversation:uuid
                           completion:[VIMessengerCompletion<VIConversationEvent *>
                                       success:^(VIConversationEvent * _Nonnull result) {
                                           __strong VIMessagingModule *strongSelf = weakSelf;
                                           NSDictionary *event = [strongSelf convertConversationEvent:result];
                                           callback(@[event, [NSNull null]]);
                                       }
                                       failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                           __strong VIMessagingModule *strongSelf = weakSelf;
                                           NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                           callback(@[[NSNull null], error]);
                                       }]];
}

RCT_REMAP_METHOD(joinConversation, joinConversation:(NSString *)uuid responseCallback:(RCTResponseSenderBlock)callback) {
    __weak VIMessagingModule *weakSelf = self;
    [self.messenger joinConversation:uuid
                          completion:[VIMessengerCompletion<VIConversationEvent *>
                                      success:^(VIConversationEvent * _Nonnull result) {
                                          __strong VIMessagingModule *strongSelf = weakSelf;
                                          NSDictionary *event = [strongSelf convertConversationEvent:result];
                                          callback(@[event, [NSNull null]]);
                                      }
                                      failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                          __strong VIMessagingModule *strongSelf = weakSelf;
                                          NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                          callback(@[[NSNull null], error]);
                                      }]];
}


RCT_REMAP_METHOD(retransmitEvents, retransmitEvents:(NSString *)uuid
                                               from:(nonnull NSNumber *)from
                                                 to:(nonnull NSNumber *)to
                                   responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation retransmitEventsFrom:from.longLongValue
                                        to:to.longLongValue
                                completion:[VIMessengerCompletion<VIRetransmitEvent *>
                                            success:^(VIRetransmitEvent * _Nonnull result) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *event = [strongSelf convertRetrasmitEvent:result];
                                                callback(@[event, [NSNull null]]);
                                            }
                                            failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                                callback(@[[NSNull null], error]);
                                            }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionRetransmitEvents];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(retransmitEventsFrom, retransmitEventsFrom:(NSString *)uuid
                                                       from:(nonnull NSNumber *)from
                                                      count:(nonnull NSNumber *)count
                                           responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation retransmitEventsFrom:from.longLongValue
                                     count:count.unsignedIntegerValue
                                completion:[VIMessengerCompletion<VIRetransmitEvent *>
                                            success:^(VIRetransmitEvent * _Nonnull result) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *event = [strongSelf convertRetrasmitEvent:result];
                                                callback(@[event, [NSNull null]]);
                                            }
                                            failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                                callback(@[[NSNull null], error]);
                                            }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionRetransmitEvents];
        callback(@[[NSNull null], error]);
    }
}

RCT_REMAP_METHOD(retransmitEventsTo, retransmitEventsTo:(NSString *)uuid
                                                     to:(nonnull NSNumber *)to
                                                  count:(nonnull NSNumber *)count
                                       responseCallback:(RCTResponseSenderBlock)callback) {
    VIConversation *conversation = [self.messenger recreateConversation:[VIConversationConfig new] uuid:uuid lastSequence:0 lastUpdateTime:0 createdTime:0];
    if (conversation) {
        __weak VIMessagingModule *weakSelf = self;
        [conversation retransmitEventsTo:to.longLongValue
                                   count:count.unsignedIntegerValue
                              completion:[VIMessengerCompletion<VIRetransmitEvent *>
                                            success:^(VIRetransmitEvent * _Nonnull result) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *event = [strongSelf convertRetrasmitEvent:result];
                                                callback(@[event, [NSNull null]]);
                                            }
                                            failure:^(VIErrorEvent * _Nonnull errorEvent) {
                                                __strong VIMessagingModule *strongSelf = weakSelf;
                                                NSDictionary *error = [strongSelf convertErrorEvent:errorEvent];
                                                callback(@[[NSNull null], error]);
                                            }]];
    } else {
        NSDictionary *error = [self createErrorEventInvalidArgument:VIMessengerActionRetransmitEvents];
        callback(@[[NSNull null], error]);
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

- (void)messenger:(VIMessenger *)messenger didReceiveReadConfirmation:(VIConversationServiceEvent *)event {
    [self sendEventWithName:kEventMesRead body:[self convertConversationServiceEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didReceiveTypingNotification:(VIConversationServiceEvent *)event {
    [self sendEventWithName:kEventMesTyping body:[self convertConversationServiceEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didRemoveConversation:(VIConversationEvent *)event {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setObject:[Utils convertMessengerEventTypeToString:event.eventType] forKey:kEventMesParamEventType];
    [dictionary setObject:[Utils convertMessengerEventActionToString:event.action] forKey:kEventMesParamAction];
    [dictionary setObject:event.imUserId forKey:kEventMesParamEventIMUserId];
    [dictionary setObject:@(event.sequence) forKey:kEventMesParamSequence];
    [dictionary setObject:@(event.timestamp) forKey:kEventMesParamTimestamp];
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

- (void)messenger:(VIMessenger *)messenger didSendMessage:(VIMessageEvent *)event {
    [self sendEventWithName:kEventMesSendMessage body:[self convertMessageEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didUnsubscribe:(VISubscriptionEvent *)event {
    [self sendEventWithName:kEventMesUnsubscribe body:[self convertSubscriptionEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didSetStatus:(nonnull VIStatusEvent *)event {
    [self sendEventWithName:kEventMesSetStatus body:[self convertStatusEvent:event]];
}

- (void)messenger:(VIMessenger *)messenger didSubscribe:(nonnull VISubscriptionEvent *)event {
    [self sendEventWithName:kEventMesSubscribe body:[self convertSubscriptionEvent:event]];
}

- (void)messenger:(nonnull VIMessenger *)messenger didGetConversation:(nonnull VIConversationEvent *)event { }
- (void)messenger:(nonnull VIMessenger *)messenger didGetPublicConversations:(nonnull VIConversationListEvent *)event { }
- (void)messenger:(nonnull VIMessenger *)messenger didGetSubscriptionList:(nonnull VISubscriptionEvent *)event { }
- (void)messenger:(nonnull VIMessenger *)messenger didGetUser:(nonnull VIUserEvent *)event { }
- (void)messenger:(nonnull VIMessenger *)messenger didReceiveError:(nonnull VIErrorEvent *)event { }
- (void)messenger:(nonnull VIMessenger *)messenger didRetransmitEvents:(nonnull VIRetransmitEvent *)event { }


@end
