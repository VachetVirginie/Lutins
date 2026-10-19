/**
 * Sound design minimal, Web Audio pure — aucun asset, tout est synthétisé.
 * Le contexte est créé paresseusement au premier geste utilisateur.
 */
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** La cire qui se fissure : un cri sec + un froid petit "ting" d'éclat. */
export function waxCrack() {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime

  // le claquement : bruit blanc filtré, très bref
  const dur = .18
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3.2)
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(3200, t)
  bp.frequency.exponentialRampToValueAtTime(900, t + dur)
  bp.Q.value = 1.2
  const g = ac.createGain()
  g.gain.setValueAtTime(.5, t)
  g.gain.exponentialRampToValueAtTime(.001, t + dur)
  src.connect(bp).connect(g).connect(ac.destination)
  src.start(t)

  // le "ting" de l'éclat qui rebondit
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1900, t + .02)
  osc.frequency.exponentialRampToValueAtTime(1250, t + .14)
  const og = ac.createGain()
  og.gain.setValueAtTime(0, t)
  og.gain.linearRampToValueAtTime(.08, t + .03)
  og.gain.exponentialRampToValueAtTime(.0005, t + .3)
  osc.connect(og).connect(ac.destination)
  osc.start(t + .02)
  osc.stop(t + .35)
}

/**
 * La traversée du sceau : souffle ascendant (le vortex qui aspire),
 * un "thoom" grave au moment de la plongée, et des étincelles aiguës.
 */
export function portalWhoosh() {
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime

  // le souffle : bruit blanc, bandpass qui grimpe — l'air aspiré vers la porte
  const dur = 1.15
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const p = i / data.length
    data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * Math.min(1, p * 1.15)) ** 1.6
  }
  const src = ac.createBufferSource()
  src.buffer = buf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(220, t)
  bp.frequency.exponentialRampToValueAtTime(3400, t + .85)
  bp.Q.value = .9
  const g = ac.createGain()
  g.gain.setValueAtTime(.001, t)
  g.gain.exponentialRampToValueAtTime(.34, t + .6)
  g.gain.exponentialRampToValueAtTime(.001, t + dur)
  src.connect(bp).connect(g).connect(ac.destination)
  src.start(t)

  // le "thoom" de la plongée : sub basse qui s'ouvre quand on passe la porte
  const th = ac.createOscillator()
  th.type = 'sine'
  th.frequency.setValueAtTime(58, t + .55)
  th.frequency.exponentialRampToValueAtTime(31, t + 1.05)
  const tg = ac.createGain()
  tg.gain.setValueAtTime(0, t)
  tg.gain.linearRampToValueAtTime(.4, t + .58)
  tg.gain.exponentialRampToValueAtTime(.001, t + 1.15)
  th.connect(tg).connect(ac.destination)
  th.start(t + .55)
  th.stop(t + 1.2)

  // pluie d'étincelles après le passage
  for (let i = 0; i < 4; i++) {
    const f = 1600 + i * 700
    const st = t + .68 + i * .07
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, st)
    osc.frequency.exponentialRampToValueAtTime(f * .72, st + .22)
    const og = ac.createGain()
    og.gain.setValueAtTime(0, st)
    og.gain.linearRampToValueAtTime(.055, st + .02)
    og.gain.exponentialRampToValueAtTime(.0005, st + .3)
    osc.connect(og).connect(ac.destination)
    osc.start(st)
    osc.stop(st + .32)
  }
}
