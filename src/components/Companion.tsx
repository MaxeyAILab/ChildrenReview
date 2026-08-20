import { motion, AnimatePresence } from 'framer-motion'
import type { Progress } from '../types'
import { findItem } from '../data/shopItems'

export type CompanionMood = 'idle' | 'happy' | 'streak' | 'sad' | 'comeback'

const DEFAULT_FACE = '🦊'

const BUBBLE: Record<CompanionMood, string | null> = {
  idle: null,
  happy: 'Nice one!',
  streak: 'On fire! 🔥',
  sad: "Aww, it's okay!",
  comeback: "There you go!",
}

interface Props {
  mood?: CompanionMood
  equipped?: Progress['equipped']
  size?: 'md' | 'lg'
}

export default function Companion({ mood = 'idle', equipped, size = 'md' }: Props) {
  const animation =
    mood === 'streak'
      ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1.2, 1.15, 1.15, 1] }
      : mood === 'happy' || mood === 'comeback'
        ? { y: [0, -18, 0, -8, 0], scale: [1, 1.1, 1, 1.05, 1] }
        : mood === 'sad'
          ? { rotate: [0, -4, 4, 0] }
          : { y: [0, -4, 0] }

  const base = findItem(equipped?.base)
  const hat = findItem(equipped?.hat)
  const accessory = findItem(equipped?.accessory)
  const background = findItem(equipped?.background)
  const face = base?.emoji ?? DEFAULT_FACE

  const ringSize = size === 'lg' ? 'h-32 w-32' : 'h-24 w-24'
  const faceSize = size === 'lg' ? 'text-7xl' : 'text-6xl'

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {BUBBLE[mood] && (
          <motion.div
            key={mood + BUBBLE[mood]}
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.8 }}
            className="mb-1 rounded-2xl bg-white px-3 py-1 text-sm font-bold text-amber-600 shadow-md"
          >
            {BUBBLE[mood]}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative flex items-center justify-center rounded-full ${ringSize} ${
          background ? `bg-gradient-to-br ${background.gradient}` : ''
        }`}
      >
        {hat && (
          <span className="absolute -top-3 text-3xl drop-shadow" aria-hidden>
            {hat.emoji}
          </span>
        )}
        <motion.div
          key={mood}
          animate={animation}
          transition={{ duration: mood === 'idle' ? 2 : 0.6, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
          className={`${faceSize} drop-shadow-lg select-none`}
        >
          {face}
        </motion.div>
        {accessory && (
          <span className="absolute -right-1 bottom-0 text-2xl drop-shadow" aria-hidden>
            {accessory.emoji}
          </span>
        )}
      </div>
    </div>
  )
}
