//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCalls
import React

@objcMembers public final class CallManager: NSObject {
    public static let shared = CallManager()
    public var calls: [String] {
        callManager.calls.map { $0.key }
    }
    public var conferences: [String] {
        callManager.conferences.map { $0.key }
    }
    public weak var callDelegate: CallDelegate? {
        didSet {
            callDelegateWrapper.delegate = callDelegate
        }
    }
    public weak var conferenceDelegate: ConferenceDelegate? {
        didSet {
            confDelegateWrapper.conferenceDelegate = conferenceDelegate
        }
    }
    public weak var endpointDelegate: EndpointDelegate? {
        didSet {
            confDelegateWrapper.endpointDelegate = endpointDelegate
        }
    }

    private let callManager = VICallManager.shared
    private let callDelegateWrapper = CallDelegateWrapper()
    private let confDelegateWrapper = ConferenceDelegateWrapper()
    private let videoStreamManager = VideoStreamManager.shared

    override private init() {
        super.init()
        callManager.delegate = callDelegateWrapper
    }

    public func createCall(destination: String, settings: [String: Any]?) -> String? {
        let callSettings = makeCallSettings(from: settings)
        let call = callManager.createCall(destination: destination, settings: callSettings)
        call?.delegate = callDelegateWrapper
        return call?.id
    }

    public func hasCall(id: String) -> Bool {
        callManager.calls[id] != nil
    }

    public func createConf(confName: String, settings: [String: Any]?) -> String? {
        let confSettings = makeConfSettings(from: settings)
        let conf = callManager.createConference(conferenceName: confName, settings: confSettings)
        conf?.delegate = confDelegateWrapper
        return conf?.id
    }

    public func hasConference(id: String) -> Bool {
        callManager.conferences[id] != nil
    }

    public func answer(id: String, settings: [String: Any]?) {
        let callSettings = makeCallSettings(from: settings)
        callManager.calls[id]?.delegate = callDelegateWrapper
        callManager.calls[id]?.answer(with: callSettings)
    }

    public func reject(id: String, mode: String, headers: [String: String]?) {
        callManager.calls[id]?.reject(with: VIRejectMode(rnValue: mode), headers: headers)
    }

    public func sendDTMF(id: String, tones: String) {
        let call = callManager.calls[id]
        call?.sendDTMF(tones, completion: { _ in })
    }

    public func sendMessage(id: String, text: String) {
        if let call = callManager.calls[id] {
            call.sendMessage(text)
        } else if let conf = callManager.conferences[id] {
            conf.sendMessage(text)
        }
    }

    public func startCall(id: String) {
        callManager.calls[id]?.start()
    }

    public func joinConference(id: String) {
        callManager.conferences[id]?.join()
    }

    public func startSendingVideo(
        id: String,
        streamId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let localVideoStream = videoStreamManager.getStream(byId: streamId) as? VILocalVideoStream else {
            reject("INTERNAL_ERROR", "Local video stream is not found", nil)
            return
        }

        let startVideo: (VILocalVideoStream, @escaping (VICallError?) -> Void) -> Void

        if let call = callManager.calls[id] {
            startVideo = { call.startSendingVideo(with: $0, completion: $1) }
        } else if let conf = callManager.conferences[id] {
            startVideo = { conf.startSendingVideo(with: $0, completion: $1) }
        } else {
            reject("INTERNAL_ERROR", "Call is not found", nil)
            return
        }

        startVideo(localVideoStream) { callError in
            if let callError {
                reject(callError.errorCode, callError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }

    public func getEndpointIdForConference(id: String) -> String? {
        callManager.conferences[id]?.endpointId
    }

    public func getEndpointsForConference(id: String) -> [String] {
        callManager.conferences[id]?.endpoints.map { $0.id } ?? []
    }

    public func hasEndpointForConference(id: String, endpointId: String) -> Bool {
        callManager.conferences[id]?.endpoints.contains { $0.id == endpointId } ?? false
    }

    public func hasAudioStreamForEndpoint(id: String, streamId: String) -> Bool {
        getEndpoint(id: id)?.remoteAudioStreams.contains { $0.id == streamId } ?? false
    }

    public func hasVideoStreamForEndpoint(id: String, streamId: String) -> Bool {
        getEndpoint(id: id)?.remoteVideoStreams.contains { $0.id == streamId } ?? false
    }

    public func getDisplayNameForEndpoint(id: String) -> String? {
        let endpoint = getEndpoint(id: id)
        return endpoint?.userDisplayName
    }

    public func getIsMutedForEndpoint(id: String) -> Bool {
        let endpoint = getEndpoint(id: id)
        return endpoint?.isMuted ?? false
    }

    public func getSipUriForEndpoint(id: String) -> String? {
        let endpoint = getEndpoint(id: id)
        return endpoint?.sipUri
    }

    public func getUsernameForEndpoint(id: String) -> String? {
        let endpoint = getEndpoint(id: id)
        return endpoint?.user
    }

    public func getIsVoiceActivityDetectedForEndpoint(id: String) -> Bool {
        let endpoint = getEndpoint(id: id)
        return endpoint?.isVoiceActive ?? false
    }

    public func requestVideoSizeForEndpoint(
        id: String,
        streamId: String,
        size: [String: Any],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let endpoint = getEndpoint(id: id) else {
            reject("INTERNAL_ERROR", "Endpoint is not found", nil)
            return
        }
        guard let width = size["width"] as? Int,
              let height = size["height"] as? Int else {
            reject("INTERNAL_ERROR", "Invalid size: width and height should be provided", nil)
            return
        }
        guard let videoStream = getRemoteVideoStream(streamId: streamId) else {
            reject("INTERNAL_ERROR", "Remote video stream is not found", nil)
            return
        }
        let size = CGSize(width: width, height: height)
        endpoint.requestVideoSize(size, for: videoStream) { error in
            if let error {
                reject(error.errorCode, error.description, nil)
            } else {
                resolve(nil)
            }
        }
    }

    public func stopSendingVideo(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let stopVideo: (@escaping (VICallError?) -> Void) -> Void

        if let call = callManager.calls[id] {
            stopVideo = { call.stopSendingVideo(completion: $0) }
        } else if let conf = callManager.conferences[id] {
            stopVideo = { conf.stopSendingVideo(completion: $0) }
        } else {
            reject("INTERNAL_ERROR", "Call is not found", nil)
            return
        }

        stopVideo { callError in
            if let callError {
                reject(callError.errorCode, callError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }

    public func hold(
        id: String,
        enable: Bool,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let call = callManager.calls[id] else {
            reject("INTERNAL_ERROR", "Call is not found", nil)
            return
        }
        call.hold(enable) { callError in
            if let callError {
                reject(callError.errorCode, callError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }

    public func sendInfo(id: String, body: String, mimeType: String, headers: [String: String]?) {
        if let call = callManager.calls[id] {
            call.sendInfo(body, mimeType: mimeType, headers: headers)
        } else if let conf = callManager.conferences[id] {
            conf.sendInfo(body, mimeType: mimeType, headers: headers)
        }
    }

    public func startReceivingVideoForEndpoint(id: String, streamId: String) {
        let endpoint = getEndpoint(id: id)
        guard let remoteVideoStream = getRemoteVideoStream(streamId: streamId) else { return }
        endpoint?.startReceiving(from: remoteVideoStream)
    }

    public func stopReceivingVideoForEndpoint(id: String, streamId: String) {
        let endpoint = getEndpoint(id: id)
        guard let remoteVideoStream = getRemoteVideoStream(streamId: streamId) else { return }
        endpoint?.stopReceiving(from: remoteVideoStream)
    }

    public func getVideoStreamsForEndpoint(id: String) -> [String] {
        let endpoint = getEndpoint(id: id)
        return endpoint?.remoteVideoStreams.map { $0.id } ?? []
    }

    public func getAudioStreamsForEndpoint(id: String) -> [String] {
        let endpoint = getEndpoint(id: id)
        return endpoint?.remoteAudioStreams.map { $0.id } ?? []
    }

    public func getLocalVideoStreams(id: String) -> [[String: String]] {
        if let call = callManager.calls[id] {
            return call.localVideoStreams.map { [ "id": $0.id, "source": "CAMERA" ]}
        } else {
            return callManager.conferences[id]?.localVideoStreams.map { [ "id": $0.id, "source": "CAMERA" ]} ?? []
        }
    }

    public func getLocalVideoStream(id: String, streamId: String) -> [String: String]? {
        if let stream = callManager.calls[id]?.localVideoStreams.first(where: { $0.id == streamId }) {
            return ["id": stream.id, "source": "CAMERA"]
        }
        if let stream = callManager.conferences[id]?.localVideoStreams.first(where: { $0.id == streamId }) {
            return ["id": stream.id, "source": "CAMERA"]
        }
        return nil
    }

    public func getRemoteVideoStreams(id: String) -> [String] {
        callManager.calls[id]?.remoteVideoStreams.map { $0.id } ?? []
    }

    public func hasRemoteVideoStreamForCall(id: String, streamId: String) -> Bool {
        callManager.calls[id]?.remoteVideoStreams.contains { $0.id == streamId } ?? false
    }

    public func getCallState(id: String) -> String {
        callManager.calls[id]?.state.rnValue ?? "DISCONNECTED"
    }

    public func getCallDirection(id: String) -> String {
        callManager.calls[id]?.direction.rnValue ?? "OUTGOING"
    }

    public func getConfState(id: String) -> String {
        callManager.conferences[id]?.state.rnValue ?? "DISCONNECTED"
    }

    public func getRemoteUsername(id: String) -> String? {
        callManager.calls[id]?.user
    }

    public func getDuration(id: String) -> TimeInterval {
        callManager.calls[id]?.duration ?? .zero
    }

    public func getRemoteDisplayName(id: String) -> String? {
        callManager.calls[id]?.userDisplayName
    }

    public func getIsMuted(id: String) -> Bool {
        callManager.calls[id]?.isMuted ?? false
    }

    public func getIsOnHold(id: String) -> Bool {
        callManager.calls[id]?.isOnHold ?? false
    }

    public func hangup(id: String, headers: [String: String]?) {
        if let call = callManager.calls[id] {
            call.hangup(withHeaders: headers)
        } else if let conf = callManager.conferences[id] {
            conf.hangup(withHeaders: headers)
        }
    }

    public func mute(id: String, value: Bool) {
        if let call = callManager.calls[id] {
            call.muteAudio(value)
        } else if let conf = callManager.conferences[id] {
            conf.muteAudio(value)
        }
    }

    func getRemoteVideoStream(streamId: String) -> VIRemoteVideoStream? {
        var allStreams = callManager.calls.values.flatMap { $0.remoteVideoStreams }
        let confencesStreams = callManager.conferences.values
            .flatMap { $0.endpoints }
            .flatMap { $0.remoteVideoStreams }
        allStreams.append(contentsOf: confencesStreams)
        return allStreams.first(where: { $0.id == streamId })
    }
}

extension CallManager {
    private func makeCallSettings(from settings: [String: Any]?) -> VICallSettings {
        let callSetings = VICallSettings()
        guard let settings else { return callSetings }

        callSetings.customData = settings["customData"] as? String
        callSetings.extraHeaders = settings["extraHeaders"] as? [String: String]
        callSetings.receiveVideo = settings["receiveVideo"] as? Bool ?? false
        callSetings.statsCollectionInterval = settings["statsCollectionInterval"] as? TimeInterval ?? .zero
        if let codec = settings["preferredVideoCodec"] as? String {
            switch codec {
            case "H264":
                callSetings.preferredVideoCodec = .h264
            case "VP8":
                callSetings.preferredVideoCodec = .vp8
            case "AUTO":
                callSetings.preferredVideoCodec = .auto
            default:
                break
            }
        }

        if let streamId = settings["localVideoStream"] as? String {
            callSetings.localVideoStream = videoStreamManager.getStream(byId: streamId) as? VILocalVideoStream
        }
        return callSetings
    }

    private func makeConfSettings(from settings: [String: Any]?) -> VIConferenceSettings {
        let confSettings = VIConferenceSettings()
        guard let settings else { return confSettings }

        confSettings.customData = settings["customData"] as? String
        confSettings.extraHeaders = settings["extraHeaders"] as? [String: String]
        confSettings.muteAudio = settings["muteAudio"] as? Bool ?? false
        confSettings.statsCollectionInterval = settings["statsCollectionInterval"] as? TimeInterval ?? .zero
        if let codec = settings["preferredVideoCodec"] as? String {
            switch codec {
            case "H264":
                confSettings.preferredVideoCodec = .h264
            case "VP8":
                confSettings.preferredVideoCodec = .vp8
            case "AUTO":
                confSettings.preferredVideoCodec = .auto
            default:
                break
            }
        }

        if let streamId = settings["localVideoStream"] as? String {
            confSettings.localVideoStream = videoStreamManager.getStream(byId: streamId) as? VILocalVideoStream
        }
        return confSettings
    }

    private func getEndpoint(id: String) -> VIEndpoint? {
        callManager.conferences.values
            .flatMap { $0.endpoints }
            .first { $0.id == id }
    }
}
