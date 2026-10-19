// Retour haptique cross-plateforme :
// - App native (Capacitor) : le vrai Taptic Engine via @capacitor/haptics
// - Android/Chrome : navigator.vibrate(pattern)
// - iOS Safari 17.5+ : un input[type=checkbox][switch] basculé déclenche le Taptic Engine
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const isNative = Capacitor.isNativePlatform()

function nativeImpact(pattern: number | number[]): void {
  // Un tableau décrit une séquence tap–pause–tap ; on la joue via notification
  if (Array.isArray(pattern)) {
    void Haptics.notification({ type: NotificationType.Success }).catch(() =>
      Haptics.impact({ style: ImpactStyle.Medium }),
    )
    return
  }
  const style = pattern >= 12 ? ImpactStyle.Heavy : pattern >= 8 ? ImpactStyle.Medium : ImpactStyle.Light
  void Haptics.impact({ style }).catch(() => {})
}

let iosHapticEl: HTMLInputElement | undefined

function webHaptic(pattern: number | number[]): void {
  navigator.vibrate?.(pattern)

  if (!iosHapticEl) {
    iosHapticEl = document.createElement('input')
    iosHapticEl.type = 'checkbox'
    iosHapticEl.setAttribute('switch', '')
    iosHapticEl.setAttribute('aria-hidden', 'true')
    iosHapticEl.tabIndex = -1
    Object.assign(iosHapticEl.style, {
      position: 'fixed',
      left: '-200px',
      top: '0',
      opacity: '0',
      pointerEvents: 'none',
    })
    document.body.appendChild(iosHapticEl)
  }
  iosHapticEl.click()
}

export function haptic(pattern: number | number[] = 10): void {
  if (isNative) {
    nativeImpact(pattern)
  } else {
    webHaptic(pattern)
  }
}
