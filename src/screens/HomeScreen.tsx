import { motion } from 'framer-motion'
import type { Progress } from '../types'
import Companion from '../components/Companion'
import { BADGES, pointsToNextLevel } from '../lib/gameLogic'

interface Props {
  progress: Progress
  onStart: () => void
  onToggleSound: () => void
}

export default function HomeScreen({ progress, onStart, onToggleSound }: Props) {
  const { current, needed, level } = pointsToNextLevel(progress.points)
  const pct = needed === 0 ? 100 : Math.min(100, (current / needed) * 100)

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8 text-center">
      <button
        onClick={onToggleSound}
        className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-2 text-xl shadow"
        aria-label="Toggle sound"
      >
        {progress.soundOn ? '🔊' : '🔇'}
      </button>

      <h1 className="mb-1 text-4xl font-black tracking-tight text-white drop-shadow-sm sm:text-5xl">Brainy Quest</h1>
      <p className="mb-6 font-bold text-white/90">Your adventure awaits!</p>

      <Companion mood="idle" />

      <div className="mt-6 w-full max-w-sm rounded-3xl bg-white/95 p-5 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-700">Level {level}</span>
          <span className="text-sm font-bold text-slate-500">{progress.points} pts</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-400">{needed - current} pts to level {level + 1}</p>

        {progress.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {progress.badges.map((id) => {
              const badge = BADGES.find((b) => b.id === id)
              const label = badge?.label ?? id.replace(/^topic_master_/, '').replace(/_/g, ' ') + ' Master'
              const icon = badge?.icon ?? '🎓'
              return (
                <span
                  key={id}
                  title={label}
                  className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700"
                >
                  {icon} {label}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="mt-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-5 text-2xl font-black text-white shadow-xl"
      >
        Start Adventure 🚀
      </motion.button>
    </div>
  )
}
