import type { Board, Coord } from './types'
import { Trie, TrieNode } from './trie'

const DIRECTIONS = [-1, 0, 1]

export function solveBoard(board: Board, words: Iterable<string>, limit = 300): string[] {
  const trie = new Trie(words)
  const found = new Set<string>()
  const size = board.length

  const visit = (
    row: number,
    col: number,
    node: TrieNode,
    word: string,
    used: Set<string>,
  ) => {
    if (found.size >= limit) return

    const tile = board[row]?.[col]
    if (!tile) return

    const key = `${row}-${col}`
    if (used.has(key)) return

    const child = node.children.get(tile.letter)
    if (!child) return

    const nextWord = word + tile.letter
    if (child.terminal && nextWord.length >= 3) found.add(nextWord)

    const nextUsed = new Set(used)
    nextUsed.add(key)

    for (const dr of DIRECTIONS) {
      for (const dc of DIRECTIONS) {
        if (dr === 0 && dc === 0) continue
        const nextRow = row + dr
        const nextCol = col + dc
        if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
          visit(nextRow, nextCol, child, nextWord, nextUsed)
        }
      }
    }
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      visit(row, col, trie.root, '', new Set())
    }
  }

  return [...found].sort((a, b) => b.length - a.length || a.localeCompare(b))
}

export function coordKey(coord: Coord): string {
  return `${coord.row}-${coord.col}`
}
