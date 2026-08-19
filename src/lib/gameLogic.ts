import type { Progress } from '../types'

export const BASE_POINTS = 10

export function streakMultiplier(streak: number): number {
  if (streak >= 5) return 3
  if (streak >= 3) return 2
  return 1
}

export function pointsForAnswer(streak: number): number {
  return BASE_POINTS * streakMultiplier(streak)
}

/** Level thresholds grow with triangular numbers: level n needs 100 * n(n+1)/2 total points. */
export function levelForPoints(points: number): number {
  let level = 1
  while (100 * (level * (level + 1)) / 2 <= points) {
    level++
  }
  return level
}

export function pointsForLevel(level: number): number {
  return (100 * ((level - 1) * level)) / 2
}

export function pointsToNextLevel(points: number): { current: number; needed: number; level: number } {
  const level = levelForPoints(points)
  const floor = pointsForLevel(level)
  const ceil = pointsForLevel(level + 1)
  return { current: points - floor, needed: ceil - floor, level }
}

export function starsForAccuracy(correct: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 1
  const pct = correct / total
  if (pct >= 0.9) return 3
  if (pct >= 0.7) return 2
  return 1
}

export interface BadgeDef {
  id: string
  label: string
  icon: string
  description: string
}

export const BADGES: BadgeDef[] = [
  { id: 'first_100_points', label: 'First 100 Points', icon: '🌟', description: 'Earned your first 100 points!' },
  { id: 'streak_5', label: 'On Fire!', icon: '🔥', description: 'Got a 5-answer streak in one round.' },
  { id: 'perfect_round', label: 'Perfect Round', icon: '🏆', description: 'Got every question right in a round.' },
]

export function topicMasterBadge(topicLabel: string): BadgeDef {
  return {
    id: `topic_master_${topicLabel}`,
    label: `${topicLabel} Master`,
    icon: '🎓',
    description: `Got a perfect round on ${topicLabel}.`,
  }
}

interface BadgeCheckInput {
  progress: Progress
  correct: number
  total: number
  bestStreakThisRound: number
  topicLabel: string
}

export function checkNewBadges({ progress, correct, total, bestStreakThisRound, topicLabel }: BadgeCheckInput): BadgeDef[] {
  const earned: BadgeDef[] = []
  const has = (id: string) => progress.badges.includes(id)

  if (!has('first_100_points') && progress.points >= 100) {
    earned.push(BADGES[0])
  }
  if (!has('streak_5') && bestStreakThisRound >= 5) {
    earned.push(BADGES[1])
  }
  if (total > 0 && correct === total) {
    if (!has('perfect_round')) earned.push(BADGES[2])
    const masterBadge = topicMasterBadge(topicLabel)
    if (!has(masterBadge.id)) earned.push(masterBadge)
  }
  return earned
}
