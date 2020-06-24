/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
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
    if ([eventType isEqualToString:VIMessengerEventTypeIsRead]) {
        return kEventNameMesRead;
    } else if ([eventType isEqualToString:VIMessengerEventTypeCreateConversation]) {
        return kEventNameMesCreateConversation;
    } else if ([eventType isEqualToString:VIMessengerEventTypeEditConversation]) {
        return kEventNameMesEditConversation;
    } else if ([eventType isEqualToString:VIMessengerEventTypeEditMessage]) {
        return kEventNameMesEditMessage;
    } else if ([eventType isEqualToString:VIMessengerEventTypeEditUser]) {
        return kEventNameMesEditUser;
    } else if ([eventType isEqualToString:VIMessengerEventTypeError]) {
        return kEventNameMesError;
    } else if ([eventType isEqualToString:VIMessengerEventTypeGetConversation]) {
        return kEventNameMesGetConversation;
    } else if ([eventType isEqualToString:VIMessengerEventTypeGetPublicConversations]) {
        return kEventNameMesGetPublicConversations;
    } else if ([eventType isEqualToString:VIMessengerEventTypeGetSubscriptionList]) {
        return kEventNameMesGetSubscriptionList;
    } else if ([eventType isEqualToString:VIMessengerEventTypeGetUser]) {
        return kEventNameMesGetUser;
    } else if ([eventType isEqualToString:VIMessengerEventTypeRemoveConversation]) {
        return kEventNameMesRemoveConversation;
    } else if ([eventType isEqualToString:VIMessengerEventTypeRemoveMessage]) {
        return kEventNameMesRemoveMessage;
    } else if ([eventType isEqualToString:VIMessengerEventTypeRetransmitEvents]) {
        return kEventNameMesRetransmitEvents;
    } else if ([eventType isEqualToString:VIMessengerEventTypeSendMessage]) {
        return kEventNameMesSendMessage;
    } else if ([eventType isEqualToString:VIMessengerEventTypeSetStatus]) {
        return kEventNameMesSetStatus;
    } else if ([eventType isEqualToString:VIMessengerEventTypeSubscribe]) {
        return kEventNameMesSubscribe;
    } else if ([eventType isEqualToString:VIMessengerEventTypeTyping]) {
        return kEventNameMesTyping;
    } else if ([eventType isEqualToString:VIMessengerEventTypeUnsubscribe]) {
        return kEventNameMesUnsubscribe;
    } else {
        return kEventNameMesUnknown;
    }
}

+ (NSString *)convertMessengerEventActionToString:(VIMessengerAction)action {
    if ([action isEqualToString:VIMessengerActionAddParticipants]) {
        return kEventMesActionAddParticipants;
    } else if ([action isEqualToString:VIMessengerActionCreateConversation]) {
        return kEventMesActionCreateConversation;
    } else if ([action isEqualToString:VIMessengerActionEditConversation]) {
        return kEventMesActionEditConversation;
    } else if ([action isEqualToString:VIMessengerActionEditMessage]) {
        return kEventMesActionEditMessage;
    } else if ([action isEqualToString:VIMessengerActionEditParticipants]) {
        return kEventMesActionEditParticipants;
    } else if ([action isEqualToString:VIMessengerActionEditUser]) {
        return kEventMesActionEditUser;
    } else if ([action isEqualToString:VIMessengerActionGetConversation]) {
        return kEventMesActionGetConversation;
    } else if ([action isEqualToString:VIMessengerActionGetConversations]) {
        return kEventMesActionGetConversations;
    } else if ([action isEqualToString:VIMessengerActionGetSubscriptionList]) {
        return kEventMesActionGetSubscriptionList;
    } else if ([action isEqualToString:VIMessengerActionGetPublicConversations]) {
        return kEventMesActionGetPublicConversations;
    } else if ([action isEqualToString:VIMessengerActionGetUser]) {
        return kEventMesActionGetUser;
    } else if ([action isEqualToString:VIMessengerActionGetUsers]) {
        return kEventMesActionGetUsers;
    } else if ([action isEqualToString:VIMessengerActionIsRead]) {
        return kEventMesActionRead;
    } else if ([action isEqualToString:VIMessengerActionJoinConversation]) {
        return kEventMesActionJoinConversation;
    } else if ([action isEqualToString:VIMessengerActionLeaveConversation]) {
        return kEventMesActionLeaveConversation;
    } else if ([action isEqualToString:VIMessengerActionRemoveConversation]) {
        return kEventMesActionRemoveConversation;
    } else if ([action isEqualToString:VIMessengerActionManageNotifications]) {
        return kEventMesActionManageNotifications;
    } else if ([action isEqualToString:VIMessengerActionRemoveMessage]) {
        return kEventMesActionRemoveMessage;
    } else if ([action isEqualToString:VIMessengerActionRemoveParticipants]) {
        return kEventMesActionRemoveParticipants;
    } else if ([action isEqualToString:VIMessengerActionRetransmitEvents]) {
        return kEventMesActionRetransmitEvents;
    } else if ([action isEqualToString:VIMessengerActionSendMessage]) {
        return kEventMesActionSendMessage;
    } else if ([action isEqualToString:VIMessengerActionSetStatus]) {
        return kEventMesActionSetStatus;
    } else if ([action isEqualToString:VIMessengerActionSubscribe]) {
        return kEventMesActionSubscribe;
    } else if ([action isEqualToString:VIMessengerActionTyping]) {
        return kEventMesActionTyping;
    } else if ([action isEqualToString:VIMessengerActionUnsubscribe]) {
        return kEventMesActionUnsubscribe;
    } else {
        return kEventMesActionUnknown;
    }
}

+ (NSString *)convertMessengerNotificationToString:(VIMessengerNotification)notification {
    if ([notification isEqualToString:VIMessengerNotificationEditMessage]) {
        return kEditMessage;
    } else {
        return kSendMessage;
    }
}

+ (NSString *)convertLogSeverity:(VILogSeverity)severity {
    switch (severity) {
        case VILogSeverityError:
            return kEventParamLogLevelError;
        case VILogSeverityWarning:
            return kEventParamLogLevelWarning;
        case VILogSeverityInfo:
            return kEventParamLogLevelInfo;
        case VILogSeverityDebug:
            return kEventParamLogLevelDebug;
        case VILogSeverityVerbose:
            return kEventParamLogLevelVerbose;
        default:
            return kEventParamLogLevelInfo;
    }
}

+ (NSDictionary *)convertAuthParamsToDictionary:(VIAuthParams *)authParams {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setValue:@(authParams.accessExpire) forKey:kEventParamAccessExpire];
    [dictionary setValue:authParams.accessToken forKey:kEventParamAccessToken];
    [dictionary setValue:@(authParams.refreshExpire) forKey:kEventParamRefreshExpire];
    [dictionary setValue:authParams.refreshToken forKey:kEventParamRefreshToken];
    return dictionary;
}

+ (NSString *)convertVideoStreamTypeToString:(VIVideoStreamType)videoStreamType {
    switch (videoStreamType) {
        case VIVideoStreamTypeScreenSharing:
            return kVideoStreamTypeScreenSharing;
        case VIVideoStreamTypeVideo:
        default:
            return kVideoStreamTypeVideo;
    }
}

+ (NSString *)convertAudioFileErrorToString:(VIAudioFileErrorCode)audioFileError {
    switch (audioFileError) {
        case VIAudioFileErrorCodeDestroyed:
            return kAudioFileErrorDestroyed;
        case VIAudioFileErrorCodeInterrupted:
            return kAudioFileErrorInterrupted;
        case VIAudioFileErrorCodeAlreadyPlaying:
            return kAudioFileErrorAlreadyPlaying;
        case VIAudioFileErrorCodeCallKitActivated:
            return kAudioFileErrorCallKitActivated;
        case VIAudioFileErrorCodeCallKitDeactivated:
            return kAudioFileErrorCallKitDeactivated;
        case VIAudioFileErrorCodeFailedToConfigureAudioSession:
            return kAudioFileErrorFailedToConfigureAudioSession;
        case VIAudioFileErrorCodeInternal:
        default:
            return kAudioFileErrorInternal;
    }
}

@end
