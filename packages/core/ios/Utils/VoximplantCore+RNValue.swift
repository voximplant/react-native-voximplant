//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCore

extension VIClientState {
    var rnValue: String {
        switch self {
        case .disconnected: "DISCONNECTED"
        case .disconnecting: "DISCONNECTING"
        case .connecting: "CONNECTING"
        case .reconnecting: "RECONNECTING"
        case .connected: "CONNECTED"
        case .loggingIn: "LOGGING_IN"
        case .loggedIn: "LOGGED_IN"
        default: "UNKNOWN"
        }
    }
}

extension VIAuth {
    var dictionaryValue: [String: Any] {
        [
            "accessExpire": self.accessExpire,
            "accessToken": self.accessToken,
            "refreshExpire": self.refreshExpire,
            "refreshToken": self.refreshToken
        ]
    }
}

extension VILoginResult {
    var dictionaryValue: [String: Any] {
        var dict: [String: Any] = [:]
        dict["displayName"] = self.displayName
        if let auth {
            dict["loginTokens"] = auth.dictionaryValue
        }
        return dict
    }
}

extension VIDisconnectReason {
    var rnValue: String {
        switch self {
        case .alreadyDisconnected: "ALREADY_DISCONNECTED"
        case .appMovedToBackground: "APP_MOVED_TO_BACKGROUND"
        case .userInitiated: "USER_INITIATED"
        case .connectionLost: "CONNECTION_LOST"
        default: "UNKNOWN"
        }
    }
}

extension VIPushTokenError {
    var errorCode: String {
        switch self.type {
        case .timeout: "TIMEOUT"
        case .canceled: "CANCELLED"
        case .connectionClosed: "CONNECTION_CLOSED"
        case .invalidToken: "INVALID_TOKEN"
        case .internalError: "INTERNAL_ERROR"
        default: "INTERNAL_ERROR"
        }
    }
}

extension VILoginError {
    var errorCode: String {
        switch self.type {
        case .invalidPassword: "INVALID_PASSWORD"
        case .mauAccessDenied: "MAU_ACCESS_DENIED"
        case .accountFrozen: "ACCOUNT_FROZEN"
        case .invalidUser: "INVALID_USERNAME"
        case .timeout: "TIMEOUT"
        case .invalidState: "INVALID_STATE"
        case .internalError: "INTERNAL_ERROR"
        case .networkIssues: "NETWORK_ISSUES"
        case .tokenExpired: "TOKEN_EXPIRED"
        case .interrupted: "INTERRUPTED"
        default: "INTERNAL_ERROR"
        }
    }
}

extension VIConnectionError {
    var errorCode: String {
        switch self.type {
        case .timeout: "TIMEOUT"
        case .invalidState: "INVALID_STATE"
        case .internalError: "INTERNAL_ERROR"
        case .networkIssues: "NETWORK_ISSUES"
        case .interrupted: "INTERRUPTED"
        default: "INTERNAL_ERROR"
        }
    }
}

extension VIAudioDevice.VIDeviceType {
    var rnValue: String {
        switch self {
        case .speaker: "SPEAKER"
        case .receiver: "EARPIECE"
        case .bluetooth: "BLUETOOTH"
        case .wired: "WIRED"
        case .unsupported: "UNSUPPORTED"
        default: "UNSUPPORTED"
        }
    }
}

extension VIAudioDevice {
    var dictionaryValue: [String: Any] {
        [
            "id": self.id,
            "name": self.name,
            // Android specific, always false
            "hasMic": false,
            "type": self.type.rnValue
        ]
    }
}

extension VILogLevel {
    init(logLevel: String?) {
        guard let logLevel else {
            self = .info
            return
        }
        switch logLevel {
        case "VERBOSE", "DEBUG":
            self = .debug
        case "INFO":
            self = .info
        case "WARNING":
            self = .warning
        case "ERROR":
            self = .error
        default:
            self = .info
        }
    }

    var rnValue: String {
        switch self {
        case .debug, .local: "DEBUG"
        case .info: "INFO"
        case .warning: "WARNING"
        case .error: "ERROR"
        case .disabled: "ERROR"
        default: "INFO"
        }
    }
}

extension VIAudioDeviceError {
    var errorCode: String {
        switch self.type {
        case .deviceAlreadyActive: "ALREADY_ACTIVE"
        case .noSuchDeviceInDeviceList: "NOT_FOUND"
        case .unsupportedDevice: "UNSUPPORTED"
        case .internalError: "INTERNAL_ERROR"
        default: "INTERNAL_ERROR"
        }
    }
}
