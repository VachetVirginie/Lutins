// Retour haptique cross-plateforme :
// - Android/Chrome : navigator.vibrate(pattern)
// - iOS 17.5+ : un input[type=checkbox][switch] basculé déclenche le Taptic Engine
let iosHapticEl: HTMLInputElement | undefined

export function haptic(pattern: number | number[] = 10): void {
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
