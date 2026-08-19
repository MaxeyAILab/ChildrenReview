import { motion, AnimatePresence } from 'framer-motion'

export type CompanionMood = 'idle' | 'happy' | 'streak' | 'sad' | 'comeback'

const FACE: Record<CompanionMood, string> = {
  idle: '🦊',
  happy: '🦊',
  streak: '🦊',
  sad: '🦊',
  comeback: '🦊',
}

const BUBBLE: Record<CompanionMood, string | null> = {
  idle: null,
  happy: 'Nice one!',
  streak: 'On fire! 🔥',
  sad: "Aww, it's okay!",
  comeback: "There you go!",
}

export default function Companion({ mood = 'idle' }: { mood?: CompanionMood }) {
  const animation =
    mood === 'streak'
      ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.2, 1.2, 1.15, 1.15, 1] }
      : mood === 'happy' || mood === 'comeback'
        ? { y: [0, -18, 0, -8, 0], scale: [1, 1.1, 1, 1.05, 1] }
        : mood === 'sad'
          ? { rotate: [0, -4, 4, 0] }
          : { y: [0, -4, 0] }

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
      <motion.div
        key={mood}
        animate={animation}
        transition={{ duration: mood === 'idle' ? 2 : 0.6, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
        className="text-6xl drop-shadow-lg select-none"
      >
        {FACE[mood]}
      </motion.div>
    </div>
  )
}
