import { describe, it, expect } from 'vitest'
import {
  STRATEGIES,
  scoreBoard,
  detectOutcome,
  chooseComputerMove,
} from './game.js'

describe('scoreBoard', () => {
  it('returns an 8-element array for an empty board', () => {
    const state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    expect(scoreBoard(state)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('produces the expected scores for a known board', () => {
    const state = [1, -1, 0, 0, 1, 0, 0, 0, -1]
    const scores = scoreBoard(state)
    expect(scores).toHaveLength(8)
    expect(scores[0]).toBe(1 + -1 + 0)
    expect(scores[4]).toBe(-1 + 1 + 0)
    expect(scores[6]).toBe(1 + 1 + -1)
  })
})

describe('detectOutcome', () => {
  it('returns null for an empty board', () => {
    expect(detectOutcome([0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(null)
  })

  it('returns null for a partially-filled non-winning board', () => {
    expect(detectOutcome([-1, 1, 0, 0, 0, 0, 0, 0, 0])).toBe(null)
  })

  it('recognises all 8 winning lines for the human', () => {
    STRATEGIES.forEach((line) => {
      const state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      line.forEach((i) => {
        state[i] = -1
      })
      expect(detectOutcome(state)).toBe('human')
    })
  })

  it('recognises all 8 winning lines for the computer', () => {
    STRATEGIES.forEach((line) => {
      const state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      line.forEach((i) => {
        state[i] = 1
      })
      expect(detectOutcome(state)).toBe('computer')
    })
  })

  it('returns "stalemate" for a full board with no winner', () => {
    const state = [1, -1, 1, -1, -1, 1, 1, 1, -1]
    expect(detectOutcome(state)).toBe('stalemate')
  })

  it('does not call a win-less full board anything other than stalemate', () => {
    const state = [-1, 1, -1, 1, 1, -1, -1, -1, 1]
    expect(detectOutcome(state)).toBe('stalemate')
  })
})

describe('chooseComputerMove', () => {
  it('takes an immediate win when available on row 0', () => {
    const state = [1, 1, 0, 0, 0, 0, 0, 0, 0]
    const { cellToTake } = chooseComputerMove(state, 3)
    expect(cellToTake).toBe(2)
  })

  it('takes an immediate win even when the current strategy does not point there', () => {
    const state = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    const { cellToTake } = chooseComputerMove(state, 0)
    expect(state[cellToTake]).toBe(0)
    const simulated = [...state]
    simulated[cellToTake] = 1
    expect(detectOutcome(simulated)).toBe('computer')
  })

  it('blocks a human win when no computer win is available', () => {
    const state = [-1, -1, 0, 0, 1, 0, 0, 0, 0]
    const { cellToTake } = chooseComputerMove(state, 0)
    expect(cellToTake).toBe(2)
  })

  it('plays an empty cell on the current strategy when neither win nor block applies', () => {
    const state = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    const { cellToTake, nextStrategyIndex } = chooseComputerMove(state, 0)
    expect(STRATEGIES[nextStrategyIndex]).toContain(cellToTake)
    expect(state[cellToTake]).toBe(0)
  })

  it('switches to a better strategy when the current one is poisoned', () => {
    const state = [-1, 0, 0, 0, 0, 0, 0, 0, 0]
    const { nextStrategyIndex } = chooseComputerMove(state, 0)
    expect(nextStrategyIndex).not.toBe(0)
    expect(STRATEGIES[nextStrategyIndex].every((i) => state[i] !== -1)).toBe(true)
  })
})
