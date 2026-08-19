let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, gainPeak: number) {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start)
  gain.gain.setValueAtTime(0, audioCtx.currentTime + start)
  gain.gain.linearRampToValueAtTime(gainPeak, audioCtx.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(audioCtx.currentTime + start)
  osc.stop(audioCtx.currentTime + start + duration + 0.05)
}

export function playCorrect() {
  tone(660, 0, 0.12, 'sine', 0.2)
  tone(880, 0.1, 0.18, 'sine', 0.2)
}

export function playStreak() {
  tone(523, 0, 0.1, 'triangle', 0.22)
  tone(659, 0.09, 0.1, 'triangle', 0.22)
  tone(784, 0.18, 0.1, 'triangle', 0.22)
  tone(1047, 0.27, 0.22, 'triangle', 0.25)
}

export function playWrong() {
  tone(300, 0, 0.16, 'sine', 0.12)
  tone(240, 0.12, 0.22, 'sine', 0.1)
}

export function playLevelUp() {
  tone(523, 0, 0.12, 'square', 0.15)
  tone(659, 0.11, 0.12, 'square', 0.15)
  tone(784, 0.22, 0.12, 'square', 0.15)
  tone(1047, 0.33, 0.3, 'square', 0.18)
}

export function playTap() {
  tone(440, 0, 0.06, 'sine', 0.08)
}
