import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question } from '../types'
import { shuffle } from '../lib/quizEngine'

interface Props {
  question: Question
  onAnswered: (correct: boolean) => void
  onContinue: () => void
  timerSeconds?: number
}

type Phase = 'answering' | 'feedback'

export default function QuestionCard({ question, onAnswered, onContinue, timerSeconds }: Props) {
  const [phase, setPhase] = useState<Phase>('answering')
  const [selected, setSelected] = useState<string | null>(null)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timerSeconds ?? 0)

  // matching-specific state
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})
  const [mistakeMade, setMistakeMade] = useState(false)
  const [shakeMatch, setShakeMatch] = useState<string | null>(null)
  const [matchOrder] = useState(() => (question.pairs ? shuffle(question.pairs.map((p) => p.match)) : []))

  useEffect(() => {
    setPhase('answering')
    setSelected(null)
    setWasCorrect(false)
    setShowHint(false)
    setSelectedTerm(null)
    setMatched({})
    setMistakeMade(false)
    setShakeMatch(null)
    setTimeLeft(timerSeconds ?? 0)
  }, [question.id, timerSeconds])

  const hasTimer = !!timerSeconds && question.type !== 'matching'

  useEffect(() => {
    if (!hasTimer || phase !== 'answering') return
    if (timeLeft <= 0) {
      setSelected(null)
      setWasCorrect(false)
      setPhase('feedback')
      onAnswered(false)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTimer, phase, timeLeft])

  function chooseOption(opt: string) {
    if (phase !== 'answering') return
    const correct = opt.trim().toLowerCase() === (question.answer ?? '').trim().toLowerCase()
    setSelected(opt)
    setWasCorrect(correct)
    setPhase('feedback')
    onAnswered(correct)
  }

  function tapTerm(term: string) {
    if (matched[term]) return
    setSelectedTerm(term)
  }

  function tapMatch(matchVal: string) {
    if (!selectedTerm) return
    const pair = question.pairs?.find((p) => p.term === selectedTerm)
    if (!pair) return
    if (pair.match === matchVal) {
      const next = { ...matched, [selectedTerm]: matchVal }
      setMatched(next)
      setSelectedTerm(null)
      if (question.pairs && Object.keys(next).length === question.pairs.length) {
        const correct = !mistakeMade
        setWasCorrect(correct)
        setPhase('feedback')
        onAnswered(correct)
      }
    } else {
      setMistakeMade(true)
      setShakeMatch(matchVal)
      setTimeout(() => setShakeMatch(null), 400)
      setSelectedTerm(null)
    }
  }

  const isChoice = question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'fill_blank'

  return (
    <div className="w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white p-6 shadow-xl sm:p-8"
      >
        {hasTimer && phase === 'answering' && (
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className={`h-full rounded-full ${timeLeft <= 3 ? 'bg-rose-400' : 'bg-sky-400'}`}
              animate={{ width: `${(timeLeft / (timerSeconds ?? 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        )}

        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold leading-snug text-slate-800 sm:text-2xl">{question.question}</h2>
          {question.hint && (
            <button
              onClick={() => setShowHint((h) => !h)}
              className="shrink-0 rounded-full bg-amber-100 p-3 text-2xl leading-none active:scale-95"
              aria-label="Show hint"
            >
              💡
            </button>
          )}
        </div>

        <AnimatePresence>
          {showHint && question.hint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
            >
              Hint: {question.hint}
            </motion.p>
          )}
        </AnimatePresence>

        {isChoice && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options?.map((opt) => {
              const isSelected = selected === opt
              const isAnswerOpt = opt.trim().toLowerCase() === (question.answer ?? '').trim().toLowerCase()
              let style = 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              if (phase === 'feedback') {
                if (isAnswerOpt) style = 'bg-emerald-400 text-white'
                else if (isSelected) style = 'bg-orange-300 text-white'
                else style = 'bg-slate-100 text-slate-400'
              }
              return (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.96 }}
                  disabled={phase === 'feedback'}
                  onClick={() => chooseOption(opt)}
                  className={`min-h-16 rounded-2xl px-5 py-4 text-left text-lg font-bold shadow-sm transition-colors ${style}`}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>
        )}

        {question.type === 'matching' && question.pairs && (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              {question.pairs.map((p) => (
                <button
                  key={p.term}
                  disabled={!!matched[p.term]}
                  onClick={() => tapTerm(p.term)}
                  className={`min-h-16 rounded-2xl px-4 py-3 text-left font-bold shadow-sm transition-colors ${
                    matched[p.term]
                      ? 'bg-emerald-400 text-white'
                      : selectedTerm === p.term
                        ? 'bg-sky-400 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {p.term}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {matchOrder.map((m) => {
                const isUsed = Object.values(matched).includes(m)
                return (
                  <motion.button
                    key={m}
                    disabled={isUsed}
                    onClick={() => tapMatch(m)}
                    animate={shakeMatch === m ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    className={`min-h-16 rounded-2xl px-4 py-3 text-left font-bold shadow-sm transition-colors ${
                      isUsed ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        <AnimatePresence>
          {phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-2xl p-4 ${wasCorrect ? 'bg-emerald-50' : 'bg-orange-50'}`}
            >
              <p className={`mb-1 text-lg font-extrabold ${wasCorrect ? 'text-emerald-600' : 'text-orange-600'}`}>
                {wasCorrect ? 'Correct! 🎉' : "Not quite — that's okay!"}
              </p>
              <p className="text-slate-700">{question.explanation}</p>
              <button
                onClick={onContinue}
                className="mt-4 w-full rounded-2xl bg-slate-800 py-3 text-lg font-bold text-white active:scale-95 sm:w-auto sm:px-8"
              >
                Continue →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
