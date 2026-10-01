//
//  Copyright (c) 2011-2026, Zingaya, Inc. All rights reserved.
//

import Foundation
import VoximplantCore
import React

final class ClientSessionDelegate: VIClientSessionDelegate {
    var onDisconnect: ((VIDisconnectReason) -> Void)?
    var onReconnecting: (() -> Void)?
    var onReconnect: (() -> Void)?
    
    func client(_ client: VIClient, didDisconnectWithReason reason: VIDisconnectReason) {
        onDisconnect?(reason)
    }
    
    func clientDidReconnect(_ client: VIClient) {
        onReconnect?()
    }
    
    func clientDidStartReconnecting(_ client: VIClient) {
        onReconnecting?()
    }
}

final class LoggerDelegate: VILogDelegate {
    var onLog: ((String, String) -> Void)?

    func didReceiveLogMessage(_ logMessage: String, logLevel: VILogLevel) {
        onLog?(logMessage, logLevel.rnValue)
    }
}

@objcMembers public final class CoreImpl: NSObject {
    public var clientState: String { client.state.rnValue }
    
    public var onDisconnect: ((String) -> Void)?
    public var onReconnect: (() -> Void)?
    public var onReconnecting: (() -> Void)?
    public var onLog: (([String: Any]) -> Void)?

    private let client: VIClient
    private let clientSessionDelegate = ClientSessionDelegate()
    private let loggerDelegate = LoggerDelegate()
    private var disconnectResolveBlocks = Atomic<[RCTPromiseResolveBlock]>([])
    
    override public init() {
        VIClient.versionExtension = "react-2.0.0"
        client = VIClient.shared
        super.init()
        client.delegate = clientSessionDelegate
        setupDelegateCallbacks()
    }

    public func configureLogger(logLevel: String?, timestamp: Bool) {
        VICore.configureLogger(
            logDelegate: loggerDelegate,
            logLevel: VILogLevel(logLevel: logLevel),
            withTimestamps: timestamp
        )
    }
    
    public func connect(
        nodeString: String,
        gateways: [String],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let viNode = toVINode(from: nodeString) else {
            reject("INVALID_ARGUMENT", "Invalid node", nil)
            return
        }
        client.connect(to: viNode, gateways: gateways) { connectionError in
            if let connectionError {
                reject(connectionError.errorCode, connectionError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }
    
    public func disconnect(resolve: @escaping RCTPromiseResolveBlock) {
        disconnectResolveBlocks.mutate({ $0.append(resolve) })
        client.disconnect()
    }
    
    public func login(
        username: String,
        password: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        client.login(withPassword: password, user: username) { loginResult, loginError in
            if let loginResult, loginError == nil {
                resolve(loginResult.dictionaryValue)
            } else if let loginError {
                reject(loginError.errorCode, loginError.description, nil)
            }
        }
    }
    
    public func login(
        username: String,
        accessToken: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        client.login(withToken: accessToken, user: username) { loginResult, loginError in
            if let loginResult, loginError == nil {
                resolve(loginResult.dictionaryValue)
            } else if let loginError {
                reject(loginError.errorCode, loginError.description, nil)
            }
        }
    }
    
    public func login(
        username: String,
        hash: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        client.login(withOneTimeKey: hash, user: username) { loginResult, loginError in
            if let loginResult, loginError == nil {
                resolve(loginResult.dictionaryValue)
            } else if let loginError {
                reject(loginError.errorCode, loginError.description, nil)
            }
        }
    }
    
    public func refreshTokens(
        username: String,
        refreshToken: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        client.refreshTokens(forUser: username, refreshToken: refreshToken) { loginTokens, loginError in
            if let loginTokens, loginError == nil {
                resolve(loginTokens.dictionaryValue)
            } else if let loginError {
                reject(loginError.errorCode, loginError.description, nil)
            }
        }
    }
    
    public func registerForPushNotifications(
        token: String,
        bundleId: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let voipToken = Data(token.utf8)
        client.registerVoIPPushNotificationsToken(voipToken, bundleId: bundleId) { pushTokenError in
            if let pushTokenError {
                reject(pushTokenError.errorCode, pushTokenError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }
    
    public func unregisterFromPushNotifications(
        token: String,
        bundleId: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let voipToken = Data(token.utf8)
        client.unregisterVoIPPushNotificationsToken(voipToken, bundleId: bundleId) { pushTokenError in
            if let pushTokenError {
                reject(pushTokenError.errorCode, pushTokenError.description, nil)
            } else {
                resolve(nil)
            }
        }
    }

    public func handlePushNotification(pushPayload: [AnyHashable: Any]) {
        _ = client.handlePushNotification(pushPayload: pushPayload)
    }
    
    public func requestOneTimeKey(
        username: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        client.requestOneTimeKey(forUser: username) { oneTimeKey, loginError in
            if let oneTimeKey, loginError == nil {
                resolve(oneTimeKey)
            } else if let loginError {
                reject(loginError.errorCode, loginError.description, nil)
            }
        }
    }
}

extension CoreImpl {
    private func setupDelegateCallbacks() {
        clientSessionDelegate.onDisconnect = { [weak self] reason in
            self?.disconnectResolveBlocks.access(\.self).forEach { $0(nil) }
            self?.disconnectResolveBlocks.mutate([])
            self?.onDisconnect?(reason.rnValue)
        }
        
        clientSessionDelegate.onReconnect = { [weak self] in
            self?.onReconnect?()
        }
        
        clientSessionDelegate.onReconnecting = { [weak self] in
            self?.onReconnecting?()
        }

        loggerDelegate.onLog = { [weak self] logMessage, logLevel in
            let payload = ["message": logMessage, "level": logLevel]
            self?.onLog?(payload)
        }
    }
    
    private func toVINode(from string: String) -> VINode? {
        switch string {
        case "NODE_1": .node1
        case "NODE_2": .node2
        case "NODE_3": .node3
        case "NODE_4": .node4
        case "NODE_5": .node5
        case "NODE_6": .node6
        case "NODE_7": .node7
        case "NODE_8": .node8
        case "NODE_9": .node9
        case "NODE_10": .node10
        case "NODE_11": .node11
        case "NODE_12": .node12
        case "NODE_13": .node13
        default: nil
        }
    }
}
