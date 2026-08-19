import type { Progress } from '../types'

const STORAGE_KEY = 'brainy-quest-progress-v1'

const defaultProgress: Progress = {
  points: 0,
  bestStreak: 0,
  badges: [],
  topicStats: {},
  missedQueue: {},
  soundOn: true,
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProgress }
    const parsed = JSON.parse(raw)
    return { ...defaultProgress, ...parsed }
  } catch {
    return { ...defaultProgress }
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage unavailable (private mode, etc.) — progress just won't persist
  }
}
