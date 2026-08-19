import { motion } from 'framer-motion'
import { subjects } from '../data/subjects'
import type { Subject } from '../types'

interface Props {
  onPick: (subject: Subject) => void
  onBack: () => void
}

export default function SubjectPickerScreen({ onPick, onBack }: Props) {
  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8">
      <button onClick={onBack} className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 font-bold shadow">
        ← Back
      </button>
      <h1 className="mb-8 mt-4 text-3xl font-black text-white drop-shadow-sm sm:text-4xl">Pick a Subject</h1>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:gap-6">
        {subjects.map((s) => (
          <motion.button
            key={s.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPick(s.key)}
            className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br ${s.color} p-6 text-white shadow-xl`}
          >
            <span className="text-5xl">{s.icon}</span>
            <span className="text-xl font-extrabold">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
