import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, (current / total) * 100)
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-sm font-bold text-white/90">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-white/30">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
