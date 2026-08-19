import { useCallback, useState } from 'react'
import type { Progress } from '../types'
import { loadProgress, saveProgress } from '../lib/storage'

export function useProgress() {
  const [progress, setProgressState] = useState<Progress>(() => loadProgress())

  const updateProgress = useCallback((updater: (prev: Progress) => Progress) => {
    setProgressState((prev) => {
      const next = updater(prev)
      saveProgress(next)
      return next
    })
  }, [])

  return { progress, updateProgress }
}
