package com.voximplant.reactnative.calls.bridge

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap

/**
 * Converts a [ReadableMap] received through the React Native bridge into a typed map.
 *
 * Entries whose value is not a [V] are skipped.
 */
internal inline fun <reified V : Any> ReadableMap.asMapOf(): Map<String, V> = buildMap {
    entryIterator.forEach { (key, value) ->
        if (value is V) put(key, value)
    }
}

/**
 * Converts a map into a [WritableMap] so it can be passed back through the React Native bridge.
 */
internal fun Map<String, Any>.asWritableMap(): WritableMap = run(Arguments::makeNativeMap)
