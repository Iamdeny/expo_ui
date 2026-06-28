package com.debyweb.expo_ui.memory

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.*

class MemoryInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "MemoryInfo"

    @ReactMethod
    fun getMemoryInfoAsync(promise: Promise) {
        try {
            val info = getMemoryInfo()
            promise.resolve(info)
        } catch (e: Exception) {
            promise.reject("ERR_MEMORY", e.message)
        }
    }

    private fun getMemoryInfo(): WritableMap {
        val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memoryInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memoryInfo)

        return Arguments.createMap().apply {
            putDouble("totalMemory", memoryInfo.totalMem.toDouble())
            putDouble("freeMemory", memoryInfo.availMem.toDouble())
            putDouble("usedMemory", (memoryInfo.totalMem - memoryInfo.availMem).toDouble())
        }
    }
}
