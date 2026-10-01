package com.voximplant.reactnative.core

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CorePackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = when (name) {
        CoreModule.NAME -> CoreModule(reactContext)
        AudioModule.NAME -> AudioModule(reactContext)
        else -> null
    }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            CoreModule.NAME to ReactModuleInfo(
                name = CoreModule.NAME,
                className = CoreModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            ),
            AudioModule.NAME to ReactModuleInfo(
                name = AudioModule.NAME,
                className = AudioModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}
