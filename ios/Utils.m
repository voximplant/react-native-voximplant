/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import "Utils.h"
#import "Constants.h"

@implementation Utils

+ (NSData *)dataFromHexString:(NSString *)string {
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

+ (NSString *)convertIntToCallError:(NSInteger)code {
    switch (code) {
        case 10004:
            return kCallErrorRejected;
        case 10005:
            return kCallErrorTimeout;
        case 10007:
            return kCallErrorMediaIsOnHold;
        case 10008:
            return kCallErrorAlreadyInThisState;
        default:
            return kCallErrorInternal;
    }
}

+ (VIVideoResizeMode)convertStringToVideoResizeMode:(NSString *)mode {
    if ([mode isEqual:kScaleTypeFill]) {
        return VIVideoResizeModeFill;
    } else {
        return VIVideoResizeModeFit;
    }
}

+ (VIAudioDevice *)convertStringToAudioDevice:(NSString *)device {
    if (!device) {
        return nil;
    }
    if ([device isEqualToString:kAudioDeviceEarpiece]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeReceiver];
    }
    if ([device isEqualToString:kAudioDeviceSpeaker]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeSpeaker];
    }
    if ([device isEqualToString:kAudioDeviceWired]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeWired];
    }
    if ([device isEqualToString:kAudioDeviceBluetooth]) {
        return [VIAudioDevice deviceWithType:VIAudioDeviceTypeBluetooth];
    }
    return [VIAudioDevice deviceWithType:VIAudioDeviceTypeNone];
}

+ (NSString *)convertAudioDeviceToString:(VIAudioDevice *)device {
    switch (device.type) {
        case VIAudioDeviceTypeReceiver:
            return kAudioDeviceEarpiece;
        case VIAudioDeviceTypeSpeaker:
            return kAudioDeviceSpeaker;
        case VIAudioDeviceTypeWired:
            return kAudioDeviceWired;
        case VIAudioDeviceTypeBluetooth:
            return kAudioDeviceBluetooth;
        default:
            return kAudioDeviceNone;
    }
}

+ (NSString *)convertMessengerEventTypeToString:(VIMessengerEventType)eventType {
    switch (eventType) {
        case VIMessengerEventTypeError:
            return kEventNameMesError;
        case VIMessengerEventTypeGetUser:
            return kEventNameMesGetUser;
        case VIMessengerEventTypeEditUser:
            return kEventNameMesEditUser;
        case VIMessengerEventTypeCreateConversation:
            return kEventNameMesCreateConversation;
        case VIMessengerEventTypeRemoveConversation:
            return kEventNameMesRemoveConversation;
        case VIMessengerEventTypeEditConversation:
            return kEventNameMesEditConversation;
        case VIMessengerEventTypeGetConversation:
            return kEventNameMesGetConversation;
        case VIMessengerEventTypeSubscribe:
            return kEventNameMesSubscribe;
        case VIMessengerEventTypeUnsubscribe:
            return kEventNameMesUnsubscribe;
        case VIMessengerEventTypeSendMessage:
            return kEventNameMesSendMessage;
        case VIMessengerEventTypeEditMessage:
            return kEventNameMesEditMessage;
        case VIMessengerEventTypeRemoveMessage:
            return kEventNameMesRemoveMessage;
        case VIMessengerEventTypeTyping:
            return kEventNameMesTyping;
        case VIMessengerEventTypeRead:
            return kEventNameMesRead;
        case VIMessengerEventTypeDelivered:
            return kEventNameMesDelivered;
        case VIMessengerEventTypeUserStatus:
            return kEventNameMesSetStatus;
        case VIMessengerEventTypeRetransmit:
            return kEventNameMesRetransmitEvents;
        case VIMessengerEventTypeUnknown:
            default:
            return kEventNameMesUnknown;
    }
}
+ (NSString *)convertMessengerEventActionToString:(VIMessengerActionType)action {
    switch (action) {
        case VIMessengerActionTypeCreateConversation:
            return kEventMesActionCreateConversation;
        case VIMessengerActionTypeRemoveConversation:
            return kEventMesActionRemoveConversation;
        case VIMessengerActionTypeJoinConversation:
            return kEventMesActionJoinConversation;
        case VIMessengerActionTypeLeaveConversation:
            return kEventMesActionLeaveConversation;
        case VIMessengerActionTypeEditConversation:
            return kEventMesActionEditConversation;
        case VIMessengerActionTypeGetUser:
            return kEventMesActionGetUser;
        case VIMessengerActionTypeGetUsers:
            return kEventMesActionGetUsers;
        case VIMessengerActionTypeEditUser:
            return kEventMesActionEditUser;
        case VIMessengerActionTypeGetConversation:
            return kEventMesActionGetConversation;
        case VIMessengerActionTypeGetConversations:
            return kEventMesActionGetConversations;
        case VIMessengerActionTypeAddParticipants:
            return kEventMesActionAddParticipants;
        case VIMessengerActionTypeEditParticipants:
            return kEventMesActionEditParticipants;
        case VIMessengerActionTypeRemoveParticipants:
            return kEventMesActionRemoveParticipants;
        case VIMessengerActionTypeMarkAsDelivered:
            return kEventMesActionDelivered;
        case VIMessengerActionTypeMarkAsRead:
            return kEventMesActionRead;
        case VIMessengerActionTypeTyping:
            return kEventMesActionTyping;
        case VIMessengerActionTypeRetransmitEvents:
            return kEventMesActionRetransmitEvents;
        case VIMessengerActionTypeSubscribe:
            return kEventMesActionSubscribe;
        case VIMessengerActionTypeUnsubscribe:
            return kEventMesActionUnsubscribe;
        case VIMessengerActionTypeSetStatus:
            return kEventMesActionSetStatus;
        case VIMessengerActionTypeSendMessage:
            return kEventMesActionSendMessage;
        case VIMessengerActionTypeEditMessage:
            return kEventMesActionEditMessage;
        case VIMessengerActionTypeRemoveMessage:
            return kEventMesActionRemoveMessage;
        case VIMessengerActionTypeManageNotifications:
            return kEventMesActionManageNotifications;
        case VIMessengerActionTypeUnknown:
        case VIMessengerActionTypeAddModerators:
        case VIMessengerActionTypeRemoveModerators:
            default:
            return kEventMesActionUnknown;
    }
}

+ (NSString *)convertMessengerNotificationToString:(VIMessengerNotification)notification {
    switch (notification) {
        case VIMessengerNotificationEditMessage:
            return kEditMessage;
        case VIMessengerNotificationSendMessage:
            return kSendMessage;
    }
}

@end
