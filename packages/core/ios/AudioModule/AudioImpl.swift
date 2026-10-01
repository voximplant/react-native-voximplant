//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import Foundation
import VoximplantCore
import React

final class AudioManagerDelegate: VIAudioManagerDelegate {
    var onDeviceAdded: (() -> Void)?
    var onDeviceRemoved: (() -> Void)?
    
    func audioManager(_ audioManager: VIAudioManager, didAddDevice device: VIAudioDevice) {
        onDeviceAdded?()
    }
    
    func audioManager(_ audioManager: VIAudioManager, didRemoveDevice device: VIAudioDevice) {
        onDeviceRemoved?()
    }
    
    // Currently not in used
    func audioManager(_ audioManager: VIAudioManager, didReceiveError error: VIAudioDeviceError) {}
}

@objcMembers public final class AudioImpl: NSObject {
    public typealias AudioDevice = [String: Any]
    
    public var currentDevice: AudioDevice? { audioManager.currentDevice?.dictionaryValue }
    public var deviceList: [AudioDevice] { audioManager.deviceList.map { $0.dictionaryValue } }
    public var onAudioDeviceChanged: ((AudioDevice) -> Void)?
    public var onAudioDeviceListChanged: (([AudioDevice]) -> Void)?
    
    private let audioManager = VIAudioManager.shared
    private let audioManagerDelegate = AudioManagerDelegate()
    private var previousDevice: VIAudioDevice?
    
    override public init() {
        super.init()
        audioManager.delegate = audioManagerDelegate
        previousDevice = audioManager.currentDevice
        setupDelegateCallbacks()
    }
    
    public func callKitProviderDidActivateAudioSession() {
        audioManager.callKitProviderDidActivateAudioSession()
    }
    
    public func callKitProviderDidDeactivateAudioSession() {
        audioManager.callKitProviderDidDeactivateAudioSession()
    }

    public func getDevice(id: String) -> AudioDevice? {
        audioManager.deviceList.first(where: { $0.id == id })?.dictionaryValue
    }

    public func hasDevice(id: String) -> Bool {
        audioManager.deviceList.contains { $0.id == id }
    }
    
    public func selectDevice(
        id: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let device = audioManager.deviceList.first(where: { $0.id == id }) else {
            reject("NOT_FOUND", "Audio device with id \(id) is not found in the device list", nil)
            return
        }
        guard device != audioManager.currentDevice else {
            resolve(nil)
            return
        }
        audioManager.setActiveDevice(device) { [weak self] audioDeviceError in
            guard let self else { return }
            if let audioDeviceError {
                reject(audioDeviceError.errorCode, audioDeviceError.description, nil)
            } else {
                resolve(nil)
                self.previousDevice = device
                self.onAudioDeviceChanged?(device.dictionaryValue)
            }
        }
    }
}

extension AudioImpl {
    private func setupDelegateCallbacks() {
        audioManagerDelegate.onDeviceAdded = { [weak self] in
            guard let self else { return }
            self.onAudioDeviceListChanged?(self.deviceList)
            if let currentDevice = audioManager.currentDevice, currentDevice != previousDevice {
                self.previousDevice = currentDevice
                self.onAudioDeviceChanged?(currentDevice.dictionaryValue)
            }
        }
        
        audioManagerDelegate.onDeviceRemoved = { [weak self] in
            guard let self else { return }
            self.onAudioDeviceListChanged?(self.deviceList)
            if let currentDevice = audioManager.currentDevice, currentDevice != previousDevice {
                self.previousDevice = currentDevice
                self.onAudioDeviceChanged?(currentDevice.dictionaryValue)
            }
        }
    }
}
