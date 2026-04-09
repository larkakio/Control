'use client'

import { useCallback, useState } from 'react'

const STORAGE_KEY = 'control-game-progress'

export type Progress = {
  maxUnlockedLevel: number
}

const defaultProgress: Progress = { maxUnlockedLevel: 1 }

function readProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Progress
    if (
      typeof parsed.maxUnlockedLevel === 'number' &&
      parsed.maxUnlockedLevel >= 1
    ) {
      return { maxUnlockedLevel: Math.min(parsed.maxUnlockedLevel, 99) }
    }
  } catch {
    /* ignore */
  }
  return defaultProgress
}

export function useGameProgress() {
  const [progress, setProgress] = useState<Progress>(() => readProgress())

  const unlockNext = useCallback((completedLevelId: number) => {
    setProgress((prev) => {
      const next = {
        maxUnlockedLevel: Math.max(prev.maxUnlockedLevel, completedLevelId + 1),
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return { progress, unlockNext }
}
