import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Progress, RoundResult } from '../types'
import { BADGES, topicMasterBadge } from '../lib/gameLogic'
import { playLevelUp } from '../lib/sound'
import { bigConfetti } from '../lib/confetti'
import Companion from '../components/Companion'

interface Props {
  result: RoundResult
  soundOn: boolean
  equipped: Progress['equipped']
  onPlayAgain: () => void
  onNewTopic: () => void
  onHome: () => void
}

const MESSAGES: Record<1 | 2 | 3, string> = {
  3: "Amazing! You're a Champion! 🏆",
  2: 'Great Job! Keep it up! 🎉',
  1: "Nice Try! Let's review and try again! 💪",
}

export default function RoundSummaryScreen({ result, soundOn, equipped, onPlayAgain, onNewTopic, onHome }: Props) {
  useEffect(() => {
    bigConfetti()
    if (result.leveledUp && soundOn) playLevelUp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const badgeDefs = result.newBadges.map((id) => BADGES.find((b) => b.id === id) ?? topicMasterBadge(result.topicLabel))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <h1 className="mb-1 text-2xl font-black text-slate-800 sm:text-3xl">Round Complete!</h1>
        <p className="mb-3 font-bold text-emerald-600">{MESSAGES[result.stars]}</p>

        <div className="flex justify-center">
          <Companion mood={result.stars === 3 ? 'streak' : 'happy'} equipped={equipped} />
        </div>

        <div className="mt-2 flex justify-center gap-2 text-5xl">
          {[1, 2, 3].map((n) => (
            <motion.span
              key={n}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: n * 0.15, type: 'spring' }}
            >
              {n <= result.stars ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <p className="text-4xl font-black text-slate-800">
            {result.correct} / {result.total}
          </p>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Final Score</p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <Stat label="Best Streak" value={`🔥 ${result.bestStreak}`} />
            <Stat label="Points Earned" value={`+${result.pointsEarned}`} />
            <Stat label="Coins Earned" value={`🪙 +${result.coinsEarned}`} />
            <Stat label="Topic" value={result.topicLabel} />
          </div>
        </div>

        {result.leveledUp && (
          <div className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 font-extrabold text-amber-700">
            🎉 Level Up! You're now Level {result.newLevel}!
          </div>
        )}

        {badgeDefs.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {badgeDefs.map((b) => (
              <span key={b.id} className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex w-full flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onPlayAgain}
            className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-lg font-black text-white shadow-lg"
          >
            Play Again 🔁
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onNewTopic}
            className="rounded-2xl bg-slate-100 py-4 text-lg font-extrabold text-slate-700 shadow-sm"
          >
            Pick New Topic 🗺️
          </motion.button>
          <button onClick={onHome} className="py-1 font-bold text-slate-400 underline">
            Home
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="text-lg font-extrabold text-slate-800">{value}</p>
    </div>
  )
}
