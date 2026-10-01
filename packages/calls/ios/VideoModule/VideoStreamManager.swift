//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCalls
import React

@objcMembers public final class VideoStreamManager: NSObject {
    public static let shared = VideoStreamManager()

    private var localVideoStreams: [VILocalVideoStream] = []

    override private init() {
        super.init()
    }

    public func createLocalStream(videoSourceType: String) -> String? {
        let videoSource: VILocalVideoSource
        switch videoSourceType {
        case "CAMERA":
            videoSource = VICameraVideoSource.shared
        default:
            return nil
        }
        guard let videoStream = VILocalVideoStream(videoSource: videoSource) else { return nil }
        localVideoStreams.append(videoStream)
        return videoStream.id
    }

    public func removeLocalStream(id: String) {
        localVideoStreams.removeAll(where: { $0.id == id })
    }

    public func removeAllLocalStreams() {
        localVideoStreams.removeAll()
    }

    public func getLocalStream(streamId: String) -> [String: Any]? {
        localVideoStreams.first(where: { $0.id == streamId })?.rnValue
    }

    public func getLocalStreams() -> [[String: Any]] {
        localVideoStreams.map { $0.rnValue }
    }

    public func getStream(byId id: String) -> VIVideoStream? {
        if let localVideoStream = localVideoStreams.first(where: { $0.id == id }) {
            return localVideoStream
        } else {
            return CallManager.shared.getRemoteVideoStream(streamId: id)
        }
    }
}
