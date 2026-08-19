import { motion } from 'framer-motion'
import { subjects, getTopicKey } from '../data/subjects'
import type { Progress, Subject, TopicMeta } from '../types'

interface Props {
  subject: Subject
  progress: Progress
  onPick: (topic: TopicMeta) => void
  onBack: () => void
}

export default function TopicPickerScreen({ subject, progress, onPick, onBack }: Props) {
  const meta = subjects.find((s) => s.key === subject)!

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8">
      <button onClick={onBack} className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 font-bold shadow">
        ← Back
      </button>
      <h1 className="mb-8 mt-4 text-center text-3xl font-black text-white drop-shadow-sm sm:text-4xl">
        {meta.icon} {meta.label} Topics
      </h1>
      <div className="flex w-full max-w-xl flex-col gap-3">
        {meta.topics.map((t) => {
          const stat = progress.topicStats[getTopicKey(subject, t.key)]
          const accuracy = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null
          return (
            <motion.button
              key={t.key}
              whileTap={t.available ? { scale: 0.97 } : {}}
              disabled={!t.available}
              onClick={() => t.available && onPick(t)}
              className={`flex min-h-16 items-center justify-between rounded-2xl px-6 py-4 text-left shadow-lg ${
                t.available ? 'bg-white text-slate-800' : 'cursor-not-allowed bg-white/50 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-3 text-lg font-extrabold">
                <span className="text-2xl">{t.icon}</span> {t.label}
              </span>
              {accuracy !== null && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                  {accuracy}% best
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
