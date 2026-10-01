package com.voximplant.reactnative.bridge

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap

/**
 * Converts a [ReadableMap] received through the React Native bridge into a [Map] of strings.
 *
 * Primitive values are coerced to strings; nested maps and arrays are skipped.
 */
internal fun ReadableMap.asStringMap(): Map<String, String> = buildMap {
    val iterator = keySetIterator()
    while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        when (getType(key)) {
            ReadableType.String -> getString(key)?.let { put(key, it) }
            ReadableType.Number -> put(key, getDouble(key).toString())
            ReadableType.Boolean -> put(key, getBoolean(key).toString())
            else -> Unit
        }
    }
}

/**
 * Converts this [Map] into a [WritableMap] so it can be passed through the React Native bridge.
 */
internal fun Map<String, Any>.asWritableMap(): WritableMap = run(Arguments::makeNativeMap)
