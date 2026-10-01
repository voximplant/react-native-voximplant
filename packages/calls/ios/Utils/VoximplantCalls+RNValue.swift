//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import Foundation
import VoximplantCalls
import React

extension CGSize {
    var dictionaryValue: [String: Any] {
        [
            "width": width,
            "height": height
        ]
    }
}

extension VIQualityPreset {
    var rnValue: String {
        switch self {
#if os(iOS)
        case .low: "LOW"
#endif
        case .medium: "MEDIUM"
        case .high: "HIGH"
        }
    }

    init?(rnValue: String) {
        switch rnValue {
#if os(iOS)
        case "LOW": self = .low
#endif
        case "MEDIUM": self = .medium
        case "HIGH": self = .high
        default: return nil
        }
    }
}

extension VICameraDevice {
    var dictionaryValue: [String: Any] {
        [
            "id": id,
            "type": type.rnValue,
            "supportedResolutions": []
        ]
    }
}

extension VICameraDeviceType {
    var rnValue: String {
        switch self {
        case .frontCamera: "FRONT"
        case .backCamera: "BACK"
        default: "UNKNOWN"
        }
    }
}

extension VIVideoSourceError {
    var errorCode: String {
        switch type {
        case .cameraNotFound: "CAMERA_NOT_FOUND"
        case .permissionRequired: "PERMISSION_REQUIRED"
        case .interrupted: "INTERRUPTED"
        default: "CAMERA_ERROR"
        }
    }
}

extension VILocalVideoSourceStopReason {
    var rnValue: String {
        switch self {
        case .normal: "NORMAL"
        case .bySystem: "BY_SYSTEM"
        default: "INTERNAL_ERROR"
        }
    }
}

extension VICallDirection {
    var rnValue: String {
        switch self {
        case .incoming: "INCOMING"
        case .outgoing: "OUTGOING"
        default: "UNKNOWN"
        }
    }
}

extension VICall {
    var dictionaryValue: [String: String] {
        [
            "id": id,
            "direction": direction.rnValue
        ]
    }
}

extension VICallState {
    var rnValue: String {
        switch self {
        case .created: "CREATED"
        case .connecting: "CONNECTING"
        case .connected: "CONNECTED"
        case .reconnecting: "RECONNECTING"
        case .disconnecting: "DISCONNECTING"
        case .disconnected: "DISCONNECTED"
        case .failed: "FAILED"
        default: "DISCONNECTED"
        }
    }
}

extension VICallError {
    var errorCode: String {
        switch type {
        case .rejected: "REJECTED"
        case .timeout: "TIMEOUT"
        case .mediaIsOnHold: "MEDIA_IS_ON_HOLD"
        case .alreadyInThisState: "ALREADY_IN_THIS_STATE"
        case .operationIsNotSupported, .incorrectOperation: "INCORRECT_OPERATION"
        case .internalError: "INTERNAL_ERROR"
        case .invalidCallState: "INVALID_CALL_STATE"
        case .invalidArgument: "INVALID_ARGUMENT"
        case .interrupted: "INTERRUPTED"
        case .unknown: "UNKNOWN"
        case .permissionRequired: "PERMISSION_REQUIRED"
        default: "UNKNOWN"
        }
    }
}

extension VIRejectMode {
    init(rnValue: String) {
        switch rnValue {
        case "BUSY": self = .busy
        case "DECLINE": self = .decline
        default: self = .decline
        }
    }
}

extension VICallDisconnectReason {
    var rnValue: String {
        switch self {
        case .localEnded: "LOCAL_ENDED"
        case .remoteEnded: "REMOTE_ENDED"
        case .answeredElsewhere: "ANSWERED_ELSEWHERE"
        case .connectionLost: "CONNECTION_LOST"
        default: "UNKNOWN"
        }
    }
}

extension VICandidateType {
    var rnValue: String {
        switch self {
        case .host: "HOST"
        case .serverReflexive: "SERVER_REFLEXIVE"
        case .peerReflexive: "PEER_REFLEXIVE"
        case .relay: "RELAY"
        case .unknown: "UNKNOWN"
        default: "UNKNOWN"
        }
    }
}

extension VINetworkType {
    var rnValue: String {
        switch self {
        case .cellular: "CELLULAR"
        case .ethernet: "ETHERNET"
        case .wifi: "WIFI"
        case .wimax: "WIMAX"
        case .vpn: "VPN"
        case .unknown: "UNKNOWN"
        default: "UNKNOWN"
        }
    }
}

extension VIVideoStreamType {
    var rnValue: String {
        switch self {
        case .video: "VIDEO"
        case .screenSharing: "SCREEN_SHARING"
        default: "VIDEO"
        }
    }
}

extension VIVideoStreamLayerStats {
    var dictionaryValue: [String: Any] {
        [
            "fps": sentFps,
            "frameWidth": sentFrameWidth,
            "frameHeight": sentFrameHeight,
            "bytesSent": 0,
            "packetsSent": 0,
            "packetsLost": 0
        ]
    }
}

extension VICallStats {
    var connectionDictValue: [String: Any] {
        [
            "availableOutgoingBitrate": availableOutgoingBitrate,
            "rtt": rtt,
            "localCandidateType": localCandidateType.rnValue,
            "remoteCandidateType": remoteCandidateType.rnValue,
            "networkType": networkType.rnValue
        ]
    }

    var localStatsDictValue: [String: Any] {
        [
            "timestamp": timestamp,
            "connection": connectionDictValue,
            "localAudio": localAudioStats.mapValues { $0.dictionaryValue },
            "localVideo": localVideoStats.mapValues { $0.dictionaryValue }
        ]
    }
}

extension VIConferenceStats {
    var dictionaryValue: [String: Any] {
        [
            "timestamp": timestamp,
            "connection": connectionDictValue,
            "localAudio": localAudioStats.mapValues { $0.dictionaryValue },
            "localVideo": localVideoStats.mapValues { $0.dictionaryValue },
            "remote": endpointStatsDict
        ]
    }

    private var endpointStatsDict: [String: Any] {
        endpointStats.mapValues { stats in
            [
                "audio": stats.remoteAudioStats.mapValues { $0.dictionaryValue },
                "video": stats.remoteVideoStats.mapValues { $0.dictionaryValue }
            ]
        }
    }

    private var connectionDictValue: [String: Any] {
        [
            "availableOutgoingBitrate": availableOutgoingBitrate,
            "rtt": rtt,
            "localCandidateType": localCandidateType.rnValue,
            "remoteCandidateType": remoteCandidateType.rnValue,
            "networkType": networkType.rnValue
        ]
    }
}

extension VIOutboundVideoStats {
    var dictionaryValue: [String: Any] {
        [
            "codec": codec as Any,
            "bytesSent": bytesSent,
            "packetsSent": packetsSent,
            "sourceFrameWidth": sourceFrameWidth,
            "sourceFrameHeight": sourceFrameHeight,
            "sourceFps": sourceFps,
            "type": streamType.rnValue,
            "layers": layers.map { $0.dictionaryValue }
        ]
    }
}

extension VIOutboundAudioStats {
    var dictionaryValue: [String: Any] {
        [
            "codec": codec as Any,
            "bytesSent": bytesSent,
            "packetsSent": packetsSent,
            "audioLevel": audioLevel,
            "packetsLost": 0
        ]
    }
}

extension VIInboundAudioStats {
    var dictionaryValue: [String: Any] {
        [
            "codec": codec as Any,
            "bytesReceived": bytesReceived,
            "packetsReceived": packetsReceived,
            "packetsLost": packetsLost,
            "audioLevel": audioLevel
        ]
    }
}

extension VIInboundVideoStats {
    var dictionaryValue: [String: Any] {
        [
            "codec": codec as Any,
            "bytesReceived": bytesReceived,
            "packetsReceived": packetsReceived,
            "packetsLost": packetsLost,
            "frameWidth": frameWidth,
            "frameHeight": frameHeight,
            "fps": fps,
            "type": streamType.rnValue
        ]
    }
}

extension VIConferenceDisconnectReason {
    var rnValue: String {
        switch self {
        case .localEnded: "LOCAL_ENDED"
        case .remoteEnded: "REMOTE_ENDED"
        case .connectionLost: "CONNECTION_LOST"
        default: "UNKNOWN"
        }
    }
}

extension VIVideoStreamReceiveStopReason {
    var rnValue: String {
        switch self {
        case .manual: "MANUAL"
        case .automatic: "AUTOMATIC"
        default: "MANUAL"
        }
    }
}

extension VILocalVideoStream {
    var rnValue: [String: Any] { ["id": id, "source": "CAMERA"] }
}
