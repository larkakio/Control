'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { applyMove, initialState } from '@/lib/game/engine'
import { getLevel, LEVELS } from '@/lib/game/levels'
import type { Direction, LevelDef } from '@/lib/game/types'
import { useGameProgress } from '@/lib/game/useGameProgress'

import { SwipeField } from './SwipeField'

function cellClass(cell: LevelDef['grid'][0][0], isAgent: boolean) {
  const base =
    'relative flex aspect-square items-center justify-center rounded-sm border text-[10px] font-mono uppercase tracking-tighter sm:text-xs'
  if (isAgent) {
    return `${base} border-cyan-300 bg-cyan-500/30 shadow-[0_0_18px_rgba(34,211,238,0.85)]`
  }
  switch (cell) {
    case 'wall':
      return `${base} border-zinc-700 bg-zinc-900/90`
    case 'void':
      return `${base} border-fuchsia-600/60 bg-fuchsia-950/50 shadow-[inset_0_0_12px_rgba(217,70,239,0.35)]`
    case 'goal':
      return `${base} border-amber-300/80 bg-amber-400/15 shadow-[0_0_14px_rgba(251,191,36,0.55)] animate-pulse`
    default:
      return `${base} border-cyan-500/25 bg-black/40`
  }
}

export function ControlGame() {
  const { progress, unlockNext } = useGameProgress()
  const [levelId, setLevelId] = useState(1)
  const [gameState, setGameState] = useState(() =>
    initialState(getLevel(1)!),
  )

  const goToLevel = useCallback((id: number) => {
    const l = getLevel(id)
    if (!l) return
    setLevelId(id)
    setGameState(initialState(l))
  }, [])

  const level = getLevel(levelId)

  const onSwipe = useCallback(
    (dir: Direction) => {
      if (!level || gameState.status !== 'playing') return
      setGameState((s) => applyMove(level, s, dir))
    },
    [level, gameState.status],
  )

  const reset = useCallback(() => {
    const l = getLevel(levelId)
    if (l) setGameState(initialState(l))
  }, [levelId])

  const unlockGate = useRef(false)
  useEffect(() => {
    if (gameState.status === 'won' && level) {
      if (!unlockGate.current) {
        unlockGate.current = true
        unlockNext(level.id)
      }
    } else {
      unlockGate.current = false
    }
  }, [gameState.status, level, unlockNext])

  if (!level) return null

  const locked = levelId > progress.maxUnlockedLevel

  return (
    <section className="flex w-full max-w-md flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="font-[family-name:var(--font-control)] text-lg font-semibold tracking-wide text-cyan-200">
          {level.name}
        </h2>
        <p className="text-xs text-zinc-500">
          Swipe anywhere on the grid. Reach the golden goal. Magenta rifts
          erase you.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {LEVELS.map((l) => {
          const open = l.id <= progress.maxUnlockedLevel
          const active = l.id === levelId
          return (
            <button
              key={l.id}
              type="button"
              disabled={!open}
              onClick={() => goToLevel(l.id)}
              className={`rounded border px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                  : open
                    ? 'border-zinc-600 text-zinc-300 hover:border-cyan-500/50'
                    : 'cursor-not-allowed border-zinc-800 text-zinc-600'
              }`}
            >
              L{l.id}
              {!open ? ' 🔒' : ''}
            </button>
          )
        })}
      </div>

      {locked ? (
        <p className="text-sm text-rose-400">Complete the previous sector.</p>
      ) : (
        <>
          <SwipeField
            className="touch-none select-none rounded-lg border border-cyan-500/30 bg-black/50 p-2 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            onSwipe={onSwipe}
            disabled={gameState.status !== 'playing'}
          >
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${level.grid[0].length}, minmax(0, 1fr))`,
              }}
            >
              {level.grid.map((row, r) =>
                row.map((cell, c) => {
                  const isAgent =
                    gameState.agent.r === r && gameState.agent.c === c
                  const showCell =
                    cell === 'wall' ||
                    cell === 'void' ||
                    cell === 'goal' ||
                    isAgent
                  const display =
                    cell === 'wall'
                      ? '██'
                      : cell === 'void'
                        ? '⨯'
                        : cell === 'goal'
                          ? '◎'
                          : isAgent
                            ? '◆'
                            : '·'
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={cellClass(cell, isAgent)}
                    >
                      <span
                        className={
                          showCell ? 'opacity-100' : 'opacity-20'
                        }
                        aria-hidden
                      >
                        {display}
                      </span>
                      <span className="sr-only">
                        {cell}
                        {isAgent ? ', agent' : ''}
                      </span>
                    </div>
                  )
                }),
              )}
            </div>
          </SwipeField>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
            <span>Moves: {gameState.moves}</span>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-zinc-600 px-2 py-1 text-zinc-200 hover:border-cyan-500/60"
            >
              Reset sector
            </button>
          </div>

          {gameState.status === 'won' && (
            <div
              className="rounded-lg border border-emerald-500/50 bg-emerald-950/40 p-4 text-center shadow-[0_0_24px_rgba(52,211,153,0.25)]"
              role="status"
            >
              <p className="font-semibold text-emerald-300">Sector cleared</p>
              <p className="mt-1 text-sm text-emerald-200/90">
                {level.id < LEVELS.length
                  ? 'Next sector is now online.'
                  : 'All sectors stabilized.'}
              </p>
              {level.id < LEVELS.length && (
                <button
                  type="button"
                  className="mt-3 w-full rounded border border-emerald-400/60 bg-emerald-500/20 py-2 text-sm font-medium text-emerald-100"
                  onClick={() => goToLevel(level.id + 1)}
                >
                  Enter next sector
                </button>
              )}
            </div>
          )}

          {gameState.status === 'lost' && (
            <div
              className="rounded-lg border border-fuchsia-600/50 bg-fuchsia-950/30 p-4 text-center"
              role="status"
            >
              <p className="font-semibold text-fuchsia-300">
                Consumed by the void
              </p>
              <button
                type="button"
                className="mt-3 w-full rounded border border-fuchsia-500/50 py-2 text-sm text-fuchsia-100"
                onClick={reset}
              >
                Re-run sector
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
