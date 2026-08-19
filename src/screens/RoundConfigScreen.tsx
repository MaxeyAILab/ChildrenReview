import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Mode, TopicMeta } from '../types'

interface Props {
  topic: TopicMeta
  onStart: (length: number, mode: Mode) => void
  onBack: () => void
}

const LENGTHS = [10, 20]

export default function RoundConfigScreen({ topic, onStart, onBack }: Props) {
  const [length, setLength] = useState(20)
  const [mode, setMode] = useState<Mode>('normal')

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8">
      <button onClick={onBack} className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 font-bold shadow">
        ← Back
      </button>
      <h1 className="mb-1 mt-4 text-3xl font-black text-white drop-shadow-sm">{topic.icon} {topic.label}</h1>
      <p className="mb-8 font-bold text-white/90">Set up your round</p>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <p className="mb-3 font-extrabold text-slate-700">How many questions?</p>
        <div className="mb-6 grid grid-cols-2 gap-3">
          {LENGTHS.map((n) => (
            <button
              key={n}
              onClick={() => setLength(n)}
              className={`min-h-16 rounded-2xl text-xl font-extrabold shadow-sm ${
                length === n ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="mb-3 font-extrabold text-slate-700">Mode</p>
        <div className="mb-2 grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('normal')}
            className={`min-h-16 rounded-2xl px-3 text-lg font-extrabold shadow-sm ${
              mode === 'normal' ? 'bg-sky-400 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            🌤️ Normal
          </button>
          <button
            onClick={() => setMode('challenge')}
            className={`min-h-16 rounded-2xl px-3 text-lg font-extrabold shadow-sm ${
              mode === 'challenge' ? 'bg-rose-400 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ⏱️ Challenge
          </button>
        </div>
        <p className="mb-6 text-center text-xs font-semibold text-slate-400">
          {mode === 'challenge' ? 'A timer adds bonus excitement — for extra points!' : 'No timer, no rush. Just for fun!'}
        </p>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onStart(length, mode)}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-xl font-black text-white shadow-lg"
        >
          Let's Go! 🎮
        </motion.button>
      </div>
    </div>
  )
}
