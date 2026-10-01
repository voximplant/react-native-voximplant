package com.voximplant.reactnative.core

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class CoreModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val impl: CoreModuleImpl = CoreModuleImpl(
        reactContext = reactContext,
        emitOnClientDisconnected = { reason -> emit("onClientDisconnected", reason) },
        emitOnClientReconnected = { emit("onClientReconnected", null) },
        emitOnClientReconnecting = { emit("onClientReconnecting", null) },
        emitOnLog = { log -> emit("onLog", log) }
    )

    override fun getName(): String = NAME

    @ReactMethod
    override fun initialize() = impl.initialize()

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getClientState(): String = impl.getClientState()

    @ReactMethod
    fun connect(options: ReadableMap, promise: Promise) =
        impl.connect(options, promise)

    @ReactMethod
    fun disconnect(promise: Promise) = impl.disconnect(promise)

    @ReactMethod
    fun login(username: String, password: String, promise: Promise) =
        impl.login(username, password, promise)

    @ReactMethod
    fun loginWithOneTimeKey(username: String, hash: String, promise: Promise) =
        impl.loginWithOneTimeKey(username, hash, promise)

    @ReactMethod
    fun loginWithAccessToken(username: String, accessToken: String, promise: Promise) =
        impl.loginWithAccessToken(username, accessToken, promise)

    @ReactMethod
    fun requestOneTimeKey(username: String, promise: Promise) =
        impl.requestOneTimeKey(username, promise)

    @ReactMethod
    fun refreshTokens(username: String, refreshToken: String, promise: Promise) =
        impl.refreshTokens(username, refreshToken, promise)

    @ReactMethod
    fun registerForPushNotifications(config: ReadableMap, promise: Promise) =
        impl.registerForPushNotifications(config, promise)

    @ReactMethod
    fun unregisterFromPushNotifications(config: ReadableMap, promise: Promise) =
        impl.unregisterFromPushNotifications(config, promise)

    @ReactMethod
    fun handlePushNotification(pushPayload: ReadableMap) =
        impl.handlePushNotification(pushPayload)
    @ReactMethod
    fun configureLoggerCallback(config: ReadableMap) =
        impl.configureLoggerCallback(config)

    @ReactMethod
    fun setLogcatEnabled(enabled: Boolean) =
        impl.setLogcatEnabled(enabled)

    @ReactMethod
    fun addListener(eventName: String) = Unit

    @ReactMethod
    fun removeListeners(count: Double) = Unit

    private fun emit(eventName: String, payload: Any?) {
        reactApplicationContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, payload)
    }

    companion object {
        const val NAME = "RNVICore"
    }
}
