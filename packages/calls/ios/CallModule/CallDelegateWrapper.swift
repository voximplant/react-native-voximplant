//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCalls

@objc public protocol CallDelegate: AnyObject {
    func didReceiveIncomingCall(_ payload: [String: Any])
    func callDidStartRinging(_ payload: [String: Any])
    func callDidConnect(_ payload: [String: Any])
    func callDidStopRinging(_ payload: [String: Any])
    func callDidDisconnect(_ payload: [String: Any])
    func callDidFail(_ payload: [String: Any])
    func callDidReceiveMessage(_ payload: [String: Any])
    func callDidReceiveInfo(_ payload: [String: Any])
    func callDidAddRemoteVideoStream(_ payload: [String: Any])
    func callDidRemoveRemoteVideoStream(_ payload: [String: Any])
    func callDidStartReconnecting(_ payload: [String: Any])
    func callDidReconnect(_ payload: [String: Any])
    func callDidReceiveStatistics(_ payload: [String: Any])
}

final class CallDelegateWrapper: VICallManagerDelegate, VICallDelegate {
    weak var delegate: CallDelegate?

    func callManager(
        _ callManager: VICallManager,
        didReceiveIncomingCall call: VICall,
        withVideo video: Bool,
        headers: [String: String]?
    ) {
        delegate?.didReceiveIncomingCall(["callId": call.id, "withVideo": video, "headers": headers as Any])
    }

    func call(_ call: VICall, didStartRingingWithHeaders headers: [String: String]?) {
        delegate?.callDidStartRinging(["callId": call.id, "headers": headers as Any])
    }

    func call(_ call: VICall, didConnectWithVideo video: Bool, headers: [String: String]?) {
        delegate?.callDidConnect(["callId": call.id, "headers": headers as Any])
    }

    func callDidStopRinging(_ call: VICall) {
        delegate?.callDidStopRinging(["callId": call.id])
    }

    func call(_ call: VICall, didDisconnectWithReason reason: VICallDisconnectReason, headers: [String: String]?) {
        delegate?.callDidDisconnect(["callId": call.id, "reason": reason.rnValue, "headers": headers as Any])
    }

    func call(_ call: VICall, didFailWithError error: VICallConnectionError, headers: [String: String]?) {
        delegate?.callDidFail(["callId": call.id, "code": error.code, "reason": error.description, "headers": headers as Any])
    }

    func call(_ call: VICall, didReceiveMessage message: String, headers: [String: String]?) {
        delegate?.callDidReceiveMessage(["callId": call.id, "text": message])
    }

    func call(_ call: VICall, didReceiveInfo body: String, type: String, headers: [String: String]?) {
        delegate?.callDidReceiveInfo(["callId": call.id, "body": body, "mimeType": type, "headers": headers as Any])
    }

    func call(_ call: VICall, didAddRemoteVideoStream videoStream: VIRemoteVideoStream) {
        delegate?.callDidAddRemoteVideoStream(["callId": call.id, "streamId": videoStream.id])
    }

    func call(_ call: VICall, didRemoveRemoteVideoStream videoStream: VIRemoteVideoStream) {
        delegate?.callDidRemoveRemoteVideoStream(["callId": call.id, "streamId": videoStream.id])
    }

    func callDidStartReconnecting(_ call: VICall) {
        delegate?.callDidStartReconnecting(["callId": call.id])
    }

    func callDidReconnect(_ call: VICall) {
        delegate?.callDidReconnect(["callId": call.id])
    }

    func call(_ call: VICall, didReceiveStatistics stats: VICallStats) {
        var payload: [String: Any] = ["callId": call.id]
        payload.merge(stats.localStatsDictValue, uniquingKeysWith: { _, _ in})
        var remoteStats: [String: Any] = [:]
        if let audioStream = call.remoteAudioStreams.first, let audioStreamStats = stats.remoteAudioStats {
            remoteStats["audio"] = [audioStream.id: audioStreamStats.dictionaryValue]
        }

        if let videoStream = call.remoteVideoStreams.first, let videoStreamStats = stats.remoteVideoStats {
            remoteStats["video"] = [videoStream.id: videoStreamStats.dictionaryValue]
        }

        if !remoteStats.isEmpty {
            payload["remote"] = remoteStats
        }

        delegate?.callDidReceiveStatistics(payload)
    }
}
