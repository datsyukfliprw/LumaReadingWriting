import type { Board, Coord, Tile } from './types'

const LETTERS = [
  ['E', 12.7], ['T', 9.1], ['A', 8.2], ['O', 7.5], ['I', 7.0], ['N', 6.7],
  ['S', 6.3], ['H', 6.1], ['R', 6.0], ['D', 4.3], ['L', 4.0], ['C', 2.8],
  ['U', 2.8], ['M', 2.4], ['W', 2.4], ['F', 2.2], ['G', 2.0], ['Y', 2.0],
  ['P', 1.9], ['B', 1.5], ['V', 1.0], ['K', 0.8], ['J', 0.15], ['X', 0.15],
  ['Q', 0.1], ['Z', 0.07],
] as const

const TOTAL = LETTERS.reduce((sum, [, weight]) => sum + weight, 0)

export function weightedLetter(random = Math.random): string {
  let target = random() * TOTAL
  for (const [letter, weight] of LETTERS) {
    target -= weight
    if (target <= 0) return letter
  }
  return 'E'
}

export function createBoard(size = 4, random = Math.random): Board {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      letter: weightedLetter(random),
    })),
  )
}

export function flattenBoard(board: Board): Tile[] {
  return board.flat()
}

export function getTile(board: Board, coord: Coord): Tile | undefined {
  return board[coord.row]?.[coord.col]
}

export function pathToWord(board: Board, path: Coord[]): string {
  return path.map((coord) => getTile(board, coord)?.letter ?? '').join('')
}
