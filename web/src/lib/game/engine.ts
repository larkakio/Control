import type { Direction, GameState, LevelDef, Pos } from './types'

export function cellAt(level: LevelDef, pos: Pos) {
  return level.grid[pos.r]?.[pos.c]
}

export function isInside(level: LevelDef, pos: Pos) {
  return (
    pos.r >= 0 &&
    pos.c >= 0 &&
    pos.r < level.grid.length &&
    pos.c < (level.grid[0]?.length ?? 0)
  )
}

export function step(pos: Pos, dir: Direction): Pos {
  switch (dir) {
    case 'up':
      return { r: pos.r - 1, c: pos.c }
    case 'down':
      return { r: pos.r + 1, c: pos.c }
    case 'left':
      return { r: pos.r, c: pos.c - 1 }
    case 'right':
      return { r: pos.r, c: pos.c + 1 }
  }
}

export function applyMove(
  level: LevelDef,
  state: GameState,
  dir: Direction,
): GameState {
  if (state.status !== 'playing') return state

  const next = step(state.agent, dir)
  if (!isInside(level, next)) return { ...state, moves: state.moves + 1 }

  const cell = cellAt(level, next)
  if (cell === 'wall') return { ...state, moves: state.moves + 1 }

  if (cell === 'void') {
    return {
      ...state,
      agent: next,
      status: 'lost',
      moves: state.moves + 1,
    }
  }

  const won = cell === 'goal'
  return {
    ...state,
    agent: next,
    status: won ? 'won' : 'playing',
    moves: state.moves + 1,
  }
}

export function initialState(level: LevelDef): GameState {
  return {
    levelId: level.id,
    agent: { ...level.start },
    status: 'playing',
    moves: 0,
  }
}
