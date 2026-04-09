'use client'

import { useCallback, useRef, type ReactNode } from 'react'

import type { Direction } from '@/lib/game/types'

const MIN_SWIPE_PX = 48

type SwipeFieldProps = {
  className?: string
  children: ReactNode
  onSwipe: (dir: Direction) => void
  disabled?: boolean
}

export function SwipeField({
  className,
  children,
  onSwipe,
  disabled,
}: SwipeFieldProps) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      start.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [disabled],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || !start.current) return
      const dx = e.clientX - start.current.x
      const dy = e.clientY - start.current.y
      start.current = null

      if (Math.hypot(dx, dy) < MIN_SWIPE_PX) return

      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 'right' : 'left')
      } else {
        onSwipe(dy > 0 ? 'down' : 'up')
      }
    },
    [disabled, onSwipe],
  )

  return (
    <div
      role="application"
      aria-label="Swipe on the field to move the agent"
      className={className}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        start.current = null
      }}
    >
      {children}
    </div>
  )
}
