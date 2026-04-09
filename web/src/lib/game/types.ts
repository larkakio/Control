export type Cell = 'floor' | 'wall' | 'void' | 'goal'

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Pos = { r: number; c: number }

export type LevelDef = {
  id: number
  name: string
  /** Top row first */
  grid: Cell[][]
  start: Pos
}

export type GameStatus = 'playing' | 'won' | 'lost'

export type GameState = {
  levelId: number
  agent: Pos
  status: GameStatus
  moves: number
}
