import confetti from 'canvas-confetti'

export function burstConfetti() {
  confetti({
    particleCount: 60,
    spread: 55,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f472b6', '#34d399', '#60a5fa'],
  })
}

export function bigConfetti() {
  const end = Date.now() + 600
  const colors = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#a78bfa']
  ;(function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors })
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
  confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors })
}
