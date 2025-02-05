package com.haqq.wallet.haptic

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class HapticManager(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  var vibrateMap: MutableMap<String, LongArray> = HashMap()
  override fun getName() = "RNHaptic"

  private var reactContext: ReactApplicationContext

  init {
    this.reactContext = reactContext

    this.vibrateMap["selection"] = longArrayOf(0, 50);
    this.vibrateMap["success"] = longArrayOf(0, 40, 60, 20);
    this.vibrateMap["warning"] = longArrayOf(0, 20, 60, 40);
    this.vibrateMap["error"] = longArrayOf(0, 20, 40, 30, 40, 40);
  }

  @ReactMethod
  fun vibrate(effect: String) {
    this.vibrateMap[effect]?.let {
      val vibrator = reactContext.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

      vibrator.vibrate(
        VibrationEffect.createWaveform(
          it,
          -1
        )
      )
    }
  }
}
