package com.voximplant.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class CoreModule(reactContext: ReactApplicationContext) : NativeCoreSpec(reactContext) {
    private val impl: CoreModuleImpl = CoreModuleImpl(
        reactContext = reactContext,
        emitOnClientDisconnected = ::emitOnClientDisconnected,
        emitOnClientReconnected = ::emitOnClientReconnected,
        emitOnClientReconnecting = ::emitOnClientReconnecting,
        emitOnLog = ::emitOnLog,
    )

    override fun initialize() =
        impl.initialize()

    override fun getClientState(): String =
        impl.getClientState()

    override fun connect(options: ReadableMap, promise: Promise) =
        impl.connect(options, promise)

    override fun disconnect(promise: Promise) =
        impl.disconnect(promise)

    override fun login(username: String, password: String, promise: Promise) =
        impl.login(username, password, promise)

    override fun loginWithOneTimeKey(username: String, hash: String, promise: Promise) =
        impl.loginWithOneTimeKey(username, hash, promise)

    override fun loginWithAccessToken(username: String, accessToken: String, promise: Promise) =
        impl.loginWithAccessToken(username, accessToken, promise)

    override fun requestOneTimeKey(username: String, promise: Promise) =
        impl.requestOneTimeKey(username, promise)

    override fun refreshTokens(username: String, refreshToken: String, promise: Promise) =
        impl.refreshTokens(username, refreshToken, promise)

    override fun registerForPushNotifications(config: ReadableMap, promise: Promise) =
        impl.registerForPushNotifications(config, promise)

    override fun unregisterFromPushNotifications(config: ReadableMap, promise: Promise) =
        impl.unregisterFromPushNotifications(config, promise)

    override fun handlePushNotification(pushPayload: ReadableMap) =
        impl.handlePushNotification(pushPayload)

    override fun configureLoggerCallback(config: ReadableMap) =
        impl.configureLoggerCallback(config)

    override fun setLogcatEnabled(enabled: Boolean) =
        impl.setLogcatEnabled(enabled)

    companion object {
        const val NAME = "RNVICore"
    }
}
