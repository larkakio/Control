import type { LevelDef } from './types'

/**
 * Level 1: short path to the goal; void is off the direct route.
 * Level 2: larger sector; must route around walls and avoid the void.
 */
export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: 'Sector 01 — Breach',
    grid: [
      ['wall', 'wall', 'goal', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'void', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
    ],
    start: { r: 4, c: 2 },
  },
  {
    id: 2,
    name: 'Sector 02 — Shift',
    grid: [
      ['wall', 'wall', 'wall', 'goal', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'void', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
    ],
    start: { r: 6, c: 3 },
  },
]

export function getLevel(id: number): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id)
}
