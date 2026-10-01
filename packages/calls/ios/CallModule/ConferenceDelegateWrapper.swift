//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCalls

@objc public protocol ConferenceDelegate: AnyObject {
    func conferenceDidConnect(_ payload: [String: Any])
    func conferenceDidDisconnect(_ payload: [String: Any])
    func conferenceDidFail(_ payload: [String: Any])
    func conferenceDidAddEndpoint(_ payload: [String: Any])
    func conferenceDidRemoveEndpoint(_ payload: [String: Any])
    func conferenceDidReceiveMessage(_ payload: [String: Any])
    func conferenceDidReceiveInfo(_ payload: [String: Any])
    func conferenceDidStartReconnecting(_ payload: [String: Any])
    func conferenceDidReconnect(_ payload: [String: Any])
    func conferenceDidDetectLocalVoiceActivityChange(_ payload: [String: Any])
    func conferenceDidReceiveStatistics(_ payload: [String: Any])
}

@objc public protocol EndpointDelegate: AnyObject {
    func endpointDidAddRemoteVideoStream(_ payload: [String: Any])
    func endpointDidRemoveRemoteVideoStream(_ payload: [String: Any])
    func endpointDidDetectVoiceActivityChange(_ payload: [String: Any])
    func endpointDidChangeMuteStatus(_ payload: [String: Any])
    func endpointDidStartReceivingVideoStream(_ payload: [String: Any])
    func endpointDidStopReceivingVideoStream(_ payload: [String: Any])
}

final class ConferenceDelegateWrapper: VIConferenceDelegate {
    weak var conferenceDelegate: ConferenceDelegate?
    weak var endpointDelegate: EndpointDelegate?

    func conference(_ conference: VIConference, didConnectWithHeaders headers: [String: String]?) {
        conferenceDelegate?.conferenceDidConnect(["conferenceId": conference.id, "headers": headers as Any])
    }

    func conference(
        _ conference: VIConference,
        didDisconnectWithReason reason: VIConferenceDisconnectReason,
        headers: [String: String]?
    ) {
        let payload: [String: Any] = ["conferenceId": conference.id, "reason": reason.rnValue, "headers": headers as Any]
        conferenceDelegate?.conferenceDidDisconnect(payload)
    }

    func conference(_ conference: VIConference, didFailWithError error: VICallConnectionError, headers: [String: String]?) {
        let payload: [String: Any] = [
            "conferenceId": conference.id, "code": error.code, "reason": error.description, "headers": headers as Any
        ]
        conferenceDelegate?.conferenceDidFail(payload)
    }

    func conference(_ conference: VIConference, didAddEndpoint endpoint: VIEndpoint) {
        endpoint.delegate = self
        conferenceDelegate?.conferenceDidAddEndpoint(["conferenceId": conference.id, "endpointId": endpoint.id])
    }

    func conference(_ conference: VIConference, didRemoveEndpoint endpoint: VIEndpoint) {
        conferenceDelegate?.conferenceDidRemoveEndpoint(["conferenceId": conference.id, "endpointId": endpoint.id])
    }

    func conference(_ conference: VIConference, didReceiveMessage message: String, headers: [String: String]?) {
        conferenceDelegate?.conferenceDidReceiveMessage(["conferenceId": conference.id, "text": message])
    }

    func conference(_ conference: VIConference, didReceiveInfo body: String, type: String, headers: [String: String]?) {
        let payload: [String: Any] = ["conferenceId": conference.id, "body": body, "mimeType": type, "headers": headers as Any]
        conferenceDelegate?.conferenceDidReceiveInfo(payload)
    }

    func conferenceDidStartReconnecting(_ conference: VIConference) {
        conferenceDelegate?.conferenceDidStartReconnecting(["conferenceId": conference.id])
    }

    func conferenceDidReconnect(_ conference: VIConference) {
        conferenceDelegate?.conferenceDidReconnect(["conferenceId": conference.id])
    }

    func conference(_ conference: VIConference, didDetectLocalVoiceActivityChange voiceActivity: Bool) {
        let payload: [String: Any] = ["conferenceId": conference.id, "isVoiceActivityDetected": voiceActivity]
        conferenceDelegate?.conferenceDidDetectLocalVoiceActivityChange(payload)
    }

    func conference(_ conference: VIConference, didReceiveStatistics stats: VIConferenceStats) {
        var payload: [String: Any] = ["conferenceId": conference.id]
        payload.merge(stats.dictionaryValue, uniquingKeysWith: { _, new in new })
        conferenceDelegate?.conferenceDidReceiveStatistics(payload)
    }
}

extension ConferenceDelegateWrapper: VIEndpointDelegate {
    func endpoint(_ endpoint: VIEndpoint, didAddRemoteVideoStream videoStream: VIRemoteVideoStream) {
        endpointDelegate?.endpointDidAddRemoteVideoStream(["endpointId": endpoint.id, "streamId": videoStream.id])
    }

    func endpoint(_ endpoint: VIEndpoint, didRemoveRemoteVideoStream videoStream: VIRemoteVideoStream) {
        endpointDelegate?.endpointDidRemoveRemoteVideoStream(["endpointId": endpoint.id, "streamId": videoStream.id])
    }

    func endpoint(_ endpoint: VIEndpoint, didDetectVoiceActivityChange voiceActivity: Bool) {
        endpointDelegate?.endpointDidDetectVoiceActivityChange(["endpointId": endpoint.id, "isVoiceActivityDetected": voiceActivity])
    }

    func endpoint(_ endpoint: VIEndpoint, didChangeMuteStatus muteStatus: Bool) {
        endpointDelegate?.endpointDidChangeMuteStatus(["endpointId": endpoint.id, "isMuted": muteStatus])
    }

    func endpoint(_ endpoint: VIEndpoint, didStartReceivingVideoStream videoStream: VIRemoteVideoStream) {
        endpointDelegate?.endpointDidStartReceivingVideoStream(["endpointId": endpoint.id, "streamId": videoStream.id])
    }

    func endpoint(
        _ endpoint: VIEndpoint,
        didStopReceivingVideoStream videoStream: VIRemoteVideoStream,
        reason: VIVideoStreamReceiveStopReason
    ) {
        let payload = ["endpointId": endpoint.id, "streamId": videoStream.id, "reason": reason.rnValue]
        endpointDelegate?.endpointDidStopReceivingVideoStream(payload)
    }
}
