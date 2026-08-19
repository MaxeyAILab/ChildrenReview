import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { RoundResult } from '../types'
import { BADGES, topicMasterBadge } from '../lib/gameLogic'
import { playLevelUp } from '../lib/sound'
import { bigConfetti } from '../lib/confetti'
import Companion from '../components/Companion'

interface Props {
  result: RoundResult
  soundOn: boolean
  onPlayAgain: () => void
  onNewTopic: () => void
  onHome: () => void
}

export default function RoundSummaryScreen({ result, soundOn, onPlayAgain, onNewTopic, onHome }: Props) {
  useEffect(() => {
    bigConfetti()
    if (result.leveledUp && soundOn) playLevelUp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const badgeDefs = result.newBadges.map((id) => BADGES.find((b) => b.id === id) ?? topicMasterBadge(result.topicLabel))

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8 text-center">
      <h1 className="mb-2 text-3xl font-black text-white drop-shadow-sm sm:text-4xl">Round Complete!</h1>
      <Companion mood={result.stars === 3 ? 'streak' : 'happy'} />

      <div className="mt-4 flex gap-2 text-5xl">
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

      <div className="mt-6 w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-2 gap-4 text-left">
          <Stat label="Score" value={`${result.correct} / ${result.total}`} />
          <Stat label="Best Streak" value={`🔥 ${result.bestStreak}`} />
          <Stat label="Points Earned" value={`+${result.pointsEarned}`} />
          <Stat label="Topic" value={result.topicLabel} />
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
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
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
          className="rounded-2xl bg-white py-4 text-lg font-extrabold text-slate-700 shadow-lg"
        >
          Pick New Topic 🗺️
        </motion.button>
        <button onClick={onHome} className="py-2 font-bold text-white/90 underline">
          Home
        </button>
      </div>
    </div>
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
