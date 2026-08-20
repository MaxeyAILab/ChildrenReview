import { useMemo, useRef, useState } from 'react'
import type { Mode, Progress, Question, RoundResult, Subject, TopicMeta } from '../types'
import { questionsForTopic, getTopicKey } from '../data/subjects'
import { buildRoundQueue } from '../lib/quizEngine'
import { pointsForAnswer, starsForAccuracy, checkNewBadges, levelForPoints } from '../lib/gameLogic'
import { playCorrect, playStreak, playWrong } from '../lib/sound'
import { burstConfetti, bigConfetti } from '../lib/confetti'
import Companion, { type CompanionMood } from '../components/Companion'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'

interface Props {
  subject: Subject
  topic: TopicMeta
  length: number
  mode: Mode
  progress: Progress
  updateProgress: (updater: (prev: Progress) => Progress) => void
  onFinish: (result: RoundResult) => void
  onExit: () => void
}

const CHALLENGE_SECONDS = 15
const CHALLENGE_BONUS = 5

export default function QuizRoundScreen({ subject, topic, length, mode, progress, updateProgress, onFinish, onExit }: Props) {
  const topicKey = getTopicKey(subject, topic.key)
  const pool = useMemo(() => questionsForTopic(subject, topic.key), [subject, topic.key])
  const [queue, setQueue] = useState<Question[]>(() => buildRoundQueue(pool, length, progress.missedQueue[topicKey] ?? []))
  const [index, setIndex] = useState(0)
  const [startPoints] = useState(progress.points)
  const [startCoins] = useState(progress.coins)
  const [streak, setStreak] = useState(0)
  const [bestStreakRound, setBestStreakRound] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [mood, setMood] = useState<CompanionMood>('idle')
  const requeuedIds = useRef(new Set<string>())
  const missedIdsThisRound = useRef(new Set<string>())
  const lastWasWrong = useRef(false)

  const current = queue[index]
  const finished = index >= queue.length

  function handleAnswered(correct: boolean) {
    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreakRound((b) => Math.max(b, newStreak))
      setCorrectCount((c) => c + 1)

      let awarded = pointsForAnswer(newStreak)
      if (mode === 'challenge') awarded += CHALLENGE_BONUS

      updateProgress((prev) => ({
        ...prev,
        points: prev.points + awarded,
        coins: prev.coins + awarded,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      }))

      if (progress.soundOn) newStreak >= 3 ? playStreak() : playCorrect()
      if (newStreak >= 5) {
        bigConfetti()
        setMood('streak')
      } else if (lastWasWrong.current) {
        burstConfetti()
        setMood('comeback')
      } else {
        burstConfetti()
        setMood('happy')
      }
      lastWasWrong.current = false
    } else {
      setStreak(0)
      setWrongCount((c) => c + 1)
      if (progress.soundOn) playWrong()
      setMood('sad')
      lastWasWrong.current = true
      missedIdsThisRound.current.add(current.id)

      if (!requeuedIds.current.has(current.id)) {
        requeuedIds.current.add(current.id)
        setQueue((q) => {
          const copy = [...q]
          const insertAt = Math.min(copy.length, index + 2 + Math.floor(Math.random() * 4))
          copy.splice(insertAt, 0, current)
          return copy
        })
      }
    }
  }

  function handleContinue() {
    setMood('idle')
    if (index + 1 >= queue.length) {
      finishRound()
    } else {
      setIndex((i) => i + 1)
    }
  }

  function finishRound() {
    const total = queue.length
    const stars = starsForAccuracy(correctCount, total)
    const missedIds = Array.from(missedIdsThisRound.current)

    let newBadges: ReturnType<typeof checkNewBadges> = []

    updateProgress((prev) => {
      const stat = prev.topicStats[topicKey] ?? { correct: 0, total: 0 }
      const bestAccuracyBefore = stat.total > 0 ? stat.correct / stat.total : -1
      const thisAccuracy = total > 0 ? correctCount / total : 0
      const nextStat = thisAccuracy >= bestAccuracyBefore ? { correct: correctCount, total } : stat

      newBadges = checkNewBadges({
        progress: prev,
        correct: correctCount,
        total,
        bestStreakThisRound: bestStreakRound,
        topicLabel: topic.label,
      })

      return {
        ...prev,
        topicStats: { ...prev.topicStats, [topicKey]: nextStat },
        missedQueue: { ...prev.missedQueue, [topicKey]: missedIds },
        badges: [...prev.badges, ...newBadges.map((b) => b.id)],
      }
    })

    const pointsEarned = progress.points - startPoints
    const coinsEarned = progress.coins - startCoins
    const levelBefore = levelForPoints(startPoints)
    const levelAfter = levelForPoints(progress.points)

    const result: RoundResult = {
      subject,
      topic: topic.key,
      topicLabel: topic.label,
      total,
      correct: correctCount,
      bestStreak: bestStreakRound,
      pointsEarned,
      coinsEarned,
      stars,
      newBadges: newBadges.map((b) => b.id),
      leveledUp: levelAfter > levelBefore,
      newLevel: levelAfter,
    }
    onFinish(result)
  }

  if (!current || finished) return null

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-6">
      <div className="mb-3 flex w-full max-w-2xl items-center justify-between">
        <button onClick={onExit} className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold shadow">
          ✕ Quit
        </button>
        {streak >= 2 && (
          <span className="rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-amber-900 shadow">
            🔥 {streak} streak!
          </span>
        )}
      </div>

      <div className="mb-4 flex w-full max-w-2xl items-center justify-center gap-3">
        <span className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-black text-white shadow">
          ✅ {correctCount}/{length} correct
        </span>
        <span className="rounded-full bg-orange-400 px-3 py-1 text-sm font-black text-white shadow">
          ❌ {wrongCount}/{length} wrong
        </span>
      </div>

      <div className="mb-4 w-full max-w-2xl">
        <ProgressBar current={index} total={queue.length} />
      </div>

      <div className="mb-4">
        <Companion mood={mood} equipped={progress.equipped} />
      </div>

      <QuestionCard
        key={`${current.id}-${index}`}
        question={current}
        onAnswered={handleAnswered}
        onContinue={handleContinue}
        timerSeconds={mode === 'challenge' ? CHALLENGE_SECONDS : undefined}
      />
    </div>
  )
}
