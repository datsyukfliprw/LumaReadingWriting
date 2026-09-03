import { describe, expect, it } from 'vitest'
import { appendIfValid, canAppend, isAdjacent } from '../src/game/path'

const c = (row: number, col: number) => ({ row, col })

describe('path rules', () => {
  it('allows horizontal, vertical, and diagonal neighbors', () => {
    expect(isAdjacent(c(1, 1), c(1, 2))).toBe(true)
    expect(isAdjacent(c(1, 1), c(2, 1))).toBe(true)
    expect(isAdjacent(c(1, 1), c(2, 2))).toBe(true)
  })

  it('rejects non-neighbors and tile reuse', () => {
    expect(isAdjacent(c(0, 0), c(2, 2))).toBe(false)
    expect(canAppend([c(0, 0), c(0, 1)], c(0, 0))).toBe(false)
  })

  it('keeps the original path when an invalid tile is appended', () => {
    const path = [c(0, 0)]
    expect(appendIfValid(path, c(3, 3))).toEqual(path)
  })
})
