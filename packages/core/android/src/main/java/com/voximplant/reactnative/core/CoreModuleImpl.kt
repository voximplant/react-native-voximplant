package com.voximplant.reactnative.core

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.voximplant.android.sdk.core.AuthParams
import com.voximplant.android.sdk.core.Client
import com.voximplant.android.sdk.core.ClientSessionListener
import com.voximplant.android.sdk.core.ClientState
import com.voximplant.android.sdk.core.ConnectOptions
import com.voximplant.android.sdk.core.ConnectionCallback
import com.voximplant.android.sdk.core.ConnectionError
import com.voximplant.android.sdk.core.DisconnectReason
import com.voximplant.android.sdk.core.GenerateOneTimeKeyCallback
import com.voximplant.android.sdk.core.LoginCallback
import com.voximplant.android.sdk.core.LoginError
import com.voximplant.android.sdk.core.MobileServices
import com.voximplant.android.sdk.core.Node
import com.voximplant.android.sdk.core.PushConfig
import com.voximplant.android.sdk.core.PushTokenError
import com.voximplant.android.sdk.core.RefreshTokenCallback
import com.voximplant.android.sdk.core.RegisterPushTokenCallback
import com.voximplant.android.sdk.core.VICore
import com.voximplant.android.sdk.core.logging.LogLevel
import com.voximplant.android.sdk.core.logging.Logger
import com.voximplant.reactnative.bridge.asStringMap
import com.voximplant.reactnative.bridge.asWritableMap
import java.text.SimpleDateFormat
import java.util.Collections
import java.util.Date
import java.util.Locale

class CoreModuleImpl(
    private val reactContext: ReactApplicationContext,
    private val emitOnClientDisconnected: (reason: String) -> Unit,
    private val emitOnClientReconnected: () -> Unit,
    private val emitOnClientReconnecting: () -> Unit,
    private val emitOnLog: (WritableMap) -> Unit,
) {
    private val disconnectPromises: MutableList<Promise> = Collections.synchronizedList(mutableListOf())

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US)

    val listener = object : ClientSessionListener {
        override fun onConnectionClosed(reason: DisconnectReason) {
            val promisesToResolve = synchronized(disconnectPromises) {
                disconnectPromises.toList().also { disconnectPromises.clear() }
            }

            promisesToResolve.forEach { promise -> promise.resolve(null) }
            emitOnClientDisconnected(
                when (reason) {
                    DisconnectReason.AlreadyDisconnected -> "ALREADY_DISCONNECTED"
                    DisconnectReason.UserInitiated -> "USER_INITIATED"
                    DisconnectReason.ConnectionLost -> "CONNECTION_LOST"
                },
            )
        }

        override fun onReconnected() = emitOnClientReconnected()

        override fun onReconnecting() = emitOnClientReconnecting()
    }

    fun initialize() {
        VICore.subVersion = "react-2.0.0"
        VICore.initialize(reactContext)
        Client.setClientSessionListener(listener)
    }

    fun getClientState(): String = when (Client.clientState) {
        ClientState.Disconnecting -> "DISCONNECTING"
        ClientState.Disconnected -> "DISCONNECTED"
        ClientState.Connecting -> "CONNECTING"
        ClientState.Connected -> "CONNECTED"
        ClientState.LoggingIn -> "LOGGING_IN"
        ClientState.LoggedIn -> "LOGGED_IN"
        ClientState.Reconnecting -> "RECONNECTING"
    }

    fun connect(options: ReadableMap, promise: Promise) = Client.connect(
        options = ConnectOptions(
            node = when (options.getString("node")) {
                "NODE_1" -> Node.Node1
                "NODE_2" -> Node.Node2
                "NODE_3" -> Node.Node3
                "NODE_4" -> Node.Node4
                "NODE_5" -> Node.Node5
                "NODE_6" -> Node.Node6
                "NODE_7" -> Node.Node7
                "NODE_8" -> Node.Node8
                "NODE_9" -> Node.Node9
                "NODE_10" -> Node.Node10
                "NODE_11" -> Node.Node11
                "NODE_12" -> Node.Node12
                "NODE_13" -> Node.Node13
                else -> null
            } ?: run {
                promise.reject(code = "INVALID_ARGUMENT", message = "Invalid node")
                return
            },
        ).apply {
            gateways = options.getArray("gateways")?.toArrayList()?.filterIsInstance<String>().orEmpty()
            services = when (options.getString("services")) {
                "GOOGLE" -> MobileServices.Google
                "HUAWEI" -> MobileServices.Huawei
                null -> this.services
                else -> {
                    promise.reject(code = "INVALID_ARGUMENT", message = "Invalid services")
                    return
                }
            }
        },
        callback = object : ConnectionCallback {
            override fun onFailure(error: ConnectionError) = promise.reject(
                code = when (error) {
                    ConnectionError.InternalError -> "INTERNAL_ERROR"
                    ConnectionError.Interrupted -> "INTERRUPTED"
                    ConnectionError.InvalidState -> "INVALID_STATE"
                    ConnectionError.NetworkIssues -> "NETWORK_ISSUES"
                    ConnectionError.Timeout -> "TIMEOUT"
                },
                message = when (error) {
                    ConnectionError.InternalError -> "Internal error"
                    ConnectionError.Interrupted -> "Interrupted"
                    ConnectionError.InvalidState -> "Invalid state"
                    ConnectionError.NetworkIssues -> "Network issues"
                    ConnectionError.Timeout -> "Timeout"
                },
            )

            override fun onSuccess() = promise.resolve(null)
        },
    )

    fun disconnect(promise: Promise) {
        disconnectPromises.add(promise)
        Client.disconnect()
    }

    fun login(username: String, password: String, promise: Promise) = Client.login(
        username = username,
        password = password,
        callback = object : LoginCallback {
            override fun onFailure(loginError: LoginError) = promise.reject(
                code = loginError.asErrorCode(),
                message = loginError.asErrorMessage(),
            )

            override fun onSuccess(displayName: String, authParams: AuthParams?) = promise.resolve(
                buildMap {
                    put("displayName", displayName)
                    if (authParams != null) {
                        put("loginTokens", authParams.toMap().asWritableMap())
                    }
                }.asWritableMap(),
            )
        },
    )

    fun loginWithOneTimeKey(username: String, hash: String, promise: Promise) = Client.loginWithOneTimeKey(
        username = username,
        hash = hash,
        callback = object : LoginCallback {
            override fun onFailure(loginError: LoginError) = promise.reject(
                code = loginError.asErrorCode(),
                message = loginError.asErrorMessage(),
            )

            override fun onSuccess(displayName: String, authParams: AuthParams?) = promise.resolve(
                buildMap {
                    put("displayName", displayName)
                    if (authParams != null) {
                        put("loginTokens", authParams.toMap().asWritableMap())
                    }
                }.asWritableMap(),
            )
        },
    )

    fun loginWithAccessToken(username: String, accessToken: String, promise: Promise) = Client.loginWithAccessToken(
        username = username,
        accessToken = accessToken,
        callback = object : LoginCallback {
            override fun onFailure(loginError: LoginError) = promise.reject(
                code = loginError.asErrorCode(),
                message = loginError.asErrorMessage(),
            )

            override fun onSuccess(displayName: String, authParams: AuthParams?) = promise.resolve(
                buildMap {
                    put("displayName", displayName)
                    if (authParams != null) {
                        put("loginTokens", authParams.toMap().asWritableMap())
                    }
                }.asWritableMap(),
            )
        },
    )

    fun requestOneTimeKey(username: String, promise: Promise) = Client.requestOneTimeKey(
        username = username,
        callback = object : GenerateOneTimeKeyCallback {
            override fun onFailure(error: LoginError) = promise.reject(
                code = error.asErrorCode(),
                message = error.asErrorMessage(),
            )

            override fun onSuccess(key: String) = promise.resolve(key)
        },
    )

    fun refreshTokens(username: String, refreshToken: String, promise: Promise) = Client.refreshToken(
        username = username,
        refreshToken = refreshToken,
        callback = object : RefreshTokenCallback {
            override fun onFailure(error: LoginError) = promise.reject(
                code = error.asErrorCode(),
                message = error.asErrorMessage(),
            )

            override fun onSuccess(authParams: AuthParams) = promise.resolve(authParams.toMap().asWritableMap())
        },
    )

    fun registerForPushNotifications(config: ReadableMap, promise: Promise) = Client.registerForPushNotifications(
            pushConfig = PushConfig(
                token = config.getString("token") ?: run {
                    promise.reject(code = "INVALID_ARGUMENT", message = "Invalid token")
                    return
                },
                bundleId = config.getString("bundleId"),
            ),
            callback = object : RegisterPushTokenCallback {
                override fun onFailure(error: PushTokenError) = promise.reject(
                    code = error.asErrorCode(),
                    message = error.asErrorMessage(),
                )

                override fun onSuccess() = promise.resolve(null)
            },
        )

    fun unregisterFromPushNotifications(config: ReadableMap, promise: Promise) = Client.unregisterFromPushNotifications(
            pushConfig = PushConfig(
                token = config.getString("token") ?: run {
                    promise.reject(code = "INVALID_ARGUMENT", message = "Invalid token")
                    return
                },
                bundleId = config.getString("bundleId"),
            ),
            callback = object : RegisterPushTokenCallback {
                override fun onFailure(error: PushTokenError) = promise.reject(
                    code = error.asErrorCode(),
                    message = error.asErrorMessage(),
                )

                override fun onSuccess() = promise.resolve(null)
            },
        )

    fun handlePushNotification(pushPayload: ReadableMap) {
        Client.handlePushNotification(pushPayload.asStringMap())
    }

    fun configureLoggerCallback(config: ReadableMap) {
        if (config.hasKey("logLevel") && !config.isNull("logLevel")) {
            val levelStr = config.getString("logLevel")
            VICore.logging.level = when (levelStr) {
                "DEBUG" -> LogLevel.Debug
                "INFO" -> LogLevel.Info
                "WARNING" -> LogLevel.Warning
                "ERROR" -> LogLevel.Error
                "VERBOSE" -> LogLevel.Verbose
                else -> LogLevel.Info
            }
        }

        val isLoggerTimestampEnabled = if (config.hasKey("timestamp") && !config.isNull("timestamp")) {
            config.getBoolean("timestamp")
        } else {
            true
        }

        val isLoggerThreadIdEnabled = if (config.hasKey("threadID") && !config.isNull("threadID")) {
            config.getBoolean("threadID")
        } else {
            true
        }

        VICore.logging.logger = object : Logger {
            override fun log(
                level: LogLevel,
                threadId: Int,
                time: Date,
                message: String,
                throwable: Throwable?
            ) {
                val formattedMessage = buildString {
                    if (isLoggerTimestampEnabled) {
                        append(dateFormat.format(time))
                        append(" ")
                    }
                    if (isLoggerThreadIdEnabled) {
                        append("[$threadId]".padEnd(THREAD_ID_WIDTH))
                    }
                    append(message)
                }

                val payload = Arguments.createMap().apply {
                    putString("message", formattedMessage)
                    putString("level", when (level) {
                        LogLevel.Debug -> "DEBUG"
                        LogLevel.Info -> "INFO"
                        LogLevel.Warning -> "WARNING"
                        LogLevel.Error -> "ERROR"
                        LogLevel.Verbose -> "VERBOSE"
                    })
                }
                emitOnLog(payload)
            }
        }
    }

    fun setLogcatEnabled(enabled: Boolean) {
        VICore.logging.enableLogcat = enabled
    }

    private fun LoginError.asErrorCode(): String = when (this) {
        LoginError.InvalidPassword -> "INVALID_PASSWORD"
        LoginError.InvalidUsername -> "INVALID_USERNAME"
        LoginError.AccountFrozen -> "ACCOUNT_FROZEN"
        LoginError.InternalError -> "INTERNAL_ERROR"
        LoginError.InvalidState -> "INVALID_STATE"
        LoginError.Interrupted -> "INTERRUPTED"
        LoginError.MauAccessDenied -> "MAU_ACCESS_DENIED"
        LoginError.NetworkIssues -> "NETWORK_ISSUES"
        LoginError.TokenExpired -> "TOKEN_EXPIRED"
        LoginError.Timeout -> "TIMEOUT"
    }

    private fun LoginError.asErrorMessage(): String = when (this) {
        LoginError.InvalidPassword -> "Invalid password"
        LoginError.InvalidUsername -> "Invalid username"
        LoginError.AccountFrozen -> "Account frozen"
        LoginError.InternalError -> "Internal error"
        LoginError.InvalidState -> "Invalid state"
        LoginError.Interrupted -> "Interrupted"
        LoginError.MauAccessDenied -> "MAU access denied"
        LoginError.NetworkIssues -> "Network issues"
        LoginError.TokenExpired -> "Token expired"
        LoginError.Timeout -> "Timeout"
    }

    private fun AuthParams.toMap(): Map<String, Any> = buildMap {
        put("accessToken", accessToken)
        put("accessExpire", accessTokenTimeExpired)
        put("refreshToken", refreshToken)
        put("refreshExpire", refreshTokenTimeExpired)
    }

    private fun PushTokenError.asErrorCode(): String = when (this) {
        PushTokenError.InternalError -> "INTERNAL_ERROR"
        PushTokenError.Timeout -> "TIMEOUT"
        PushTokenError.ConnectionClosed -> "CONNECTION_CLOSED"
        PushTokenError.InvalidToken -> "INVALID_TOKEN"
        PushTokenError.Cancelled -> "CANCELLED"
    }

    private fun PushTokenError.asErrorMessage(): String = when (this) {
        PushTokenError.InternalError -> "Internal error"
        PushTokenError.Timeout -> "Timeout"
        PushTokenError.ConnectionClosed -> "Connection closed"
        PushTokenError.InvalidToken -> "Invalid token"
        PushTokenError.Cancelled -> "Cancelled"
    }

    companion object {
        private const val THREAD_ID_WIDTH = 9
    }
}
