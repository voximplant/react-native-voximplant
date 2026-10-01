//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import VoximplantCalls
import React

final class CameraVideoSourceDelegate: VICameraVideoSourceDelegate {
    var onCameraSourceStopped: ((VILocalVideoSourceStopReason) -> Void)?
    var onCameraSourceStarted: (() -> Void)?
    var onCameraSourceFailed: ((VIVideoSourceError) -> Void)?

    func cameraVideoSource(_ source: VICameraVideoSource, didStop reason: VILocalVideoSourceStopReason) {
        onCameraSourceStopped?(reason)
    }

    func cameraVideoSourceDidStart(_ source: VICameraVideoSource) {
        onCameraSourceStarted?()
    }

    func cameraVideoSource(_ source: VICameraVideoSource, didFailWith error: VIVideoSourceError) {
        onCameraSourceFailed?(error)
    }
}

@objcMembers public final class CameraVideoSource: NSObject {
    public static let shared = CameraVideoSource()

    public var preferredResolution: [String: Any] { cameraVideoSource.preferredResolution.dictionaryValue }
    public var currentDevice: [String: Any]? { cameraVideoSource.currentDevice?.dictionaryValue }
    public var devices: [[String: Any]] { cameraVideoSource.devices.map { $0.dictionaryValue } }
    public var onCameraSourceStopped: ((String) -> Void)?
    public var onCameraSourceStarted: (() -> Void)?
    public var onCameraSourceFailed: ((String, String) -> Void)?

    private let cameraVideoSource = VICameraVideoSource.shared
    private let cameraVideoSourceDelegate = CameraVideoSourceDelegate()

    override private init() {
        super.init()
        cameraVideoSource.delegate = cameraVideoSourceDelegate
        setupDelegateCallbacks()
    }

    public func setPreferredResolution(_ preference: [String: Any]) {
        if let width = preference["width"] as? NSNumber,
           let height = preference["height"] as? NSNumber {
            cameraVideoSource.changePreferredResolution(
                to: CGSize(width: width.doubleValue, height: height.doubleValue)
            )
            return
        }

        if let preset = preference["preset"] as? String,
           let qualityPreset = VIQualityPreset(rnValue: preset) {
            cameraVideoSource.changePreferredResolution(to: qualityPreset)
        }
    }

    public func getDevice(id: String) -> [String: Any]? {
        cameraVideoSource.devices.first(where: { $0.id == id })?.dictionaryValue
    }

    public func hasDevice(id: String) -> Bool {
        cameraVideoSource.devices.contains { $0.id == id }
    }

    public func selectDevice(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let device = cameraVideoSource.devices.first(where: { $0.id == id }) else {
            reject("CAMERA_NOT_FOUND", "Camera device with id \(id) is not found in the device list", nil)
            return
        }
        cameraVideoSource.selectCameraDevice(device) { error in
            if let error {
                reject(error.errorCode, error.description, nil)
            } else {
                resolve(nil)
            }
        }
    }
}

extension CameraVideoSource {
    private func setupDelegateCallbacks() {
        cameraVideoSourceDelegate.onCameraSourceStarted = { [weak self] in
            self?.onCameraSourceStarted?()
        }

        cameraVideoSourceDelegate.onCameraSourceStopped = { [weak self] reason in
            self?.onCameraSourceStopped?(reason.rnValue)
        }

        cameraVideoSourceDelegate.onCameraSourceFailed = { [weak self] error in
            self?.onCameraSourceFailed?(error.errorCode, error.description)
        }
    }
}
