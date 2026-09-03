import { describe, expect, it } from 'vitest'
import { solveBoard } from '../src/game/solver'
import type { Board } from '../src/game/types'

const letters = [
  ['C', 'A', 'T'],
  ['D', 'O', 'G'],
  ['R', 'E', 'D'],
]

const board: Board = letters.map((row, rowIndex) =>
  row.map((letter, colIndex) => ({
    id: `${rowIndex}-${colIndex}`,
    row: rowIndex,
    col: colIndex,
    letter,
  })),
)

describe('board solver', () => {
  it('finds words that follow adjacent tiles', () => {
    const results = solveBoard(board, ['CAT', 'DOG', 'RED', 'CART', 'ZZZ'])
    expect(results).toContain('CAT')
    expect(results).toContain('DOG')
    expect(results).toContain('RED')
    expect(results).not.toContain('ZZZ')
  })
})
