//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import UIKit
import React
import VoximplantCalls

@objc(RNVIVideoViewManager)
final class RNVIVideoViewManager: RCTViewManager {
    override func view() -> UIView {
        return RNVIVideoViewImpl()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

final class RNVIVideoViewImpl: UIView {
    private var renderer: VIVideoRendererUIView?
    private var currentStream: VIVideoStream?
    private let videoStreamManager = VideoStreamManager.shared

    @objc var streamId: String = "" {
        didSet {
            guard streamId != oldValue, !streamId.isEmpty else { return }
            attachStream()
        }
    }

    @objc var scaleType: String = "FIT" {
        didSet {
            renderer?.resizeMode = scaleType == "FIT" ? .fit : .fill
        }
    }

    private func attachStream() {
        if let currentStream, let renderer {
            currentStream.removeRenderer(renderer)
        }

        guard let stream = videoStreamManager.getStream(byId: streamId) else { return }
        currentStream = stream

        let rendererView = VIVideoRendererUIView(resizeMode: scaleType == "FIT" ? .fit : .fill)
        rendererView.frame = bounds
        rendererView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

        subviews.forEach { $0.removeFromSuperview() }
        addSubview(rendererView)
        renderer = rendererView

        stream.addRenderer(rendererView) { _ in }
    }

    deinit {
        if let renderer {
            currentStream?.removeRenderer(renderer)
        }
    }
}
