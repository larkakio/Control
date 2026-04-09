import { describe, expect, it } from 'vitest'

import { applyMove, initialState } from './engine'
import { getLevel } from './levels'

describe('applyMove', () => {
  it('reaches goal on level 1', () => {
    const level = getLevel(1)!
    let state = initialState(level)
    const moves = [
      'left',
      'up',
      'up',
      'up',
      'right',
      'up',
    ] as const
    for (const d of moves) {
      state = applyMove(level, state, d)
    }
    expect(state.status).toBe('won')
  })

  it('does not pass through wall', () => {
    const level = getLevel(1)!
    let state = initialState(level)
    state = applyMove(level, state, 'left')
    const at = { ...state.agent }
    state = applyMove(level, state, 'left')
    expect(state.agent).toEqual(at)
  })
})
