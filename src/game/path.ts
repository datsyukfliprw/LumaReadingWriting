import type { Coord } from './types'

export function sameCoord(a: Coord, b: Coord): boolean {
  return a.row === b.row && a.col === b.col
}

export function isAdjacent(a: Coord, b: Coord): boolean {
  const rowDistance = Math.abs(a.row - b.row)
  const colDistance = Math.abs(a.col - b.col)
  return rowDistance <= 1 && colDistance <= 1 && (rowDistance !== 0 || colDistance !== 0)
}

export function canAppend(path: Coord[], next: Coord): boolean {
  if (path.some((coord) => sameCoord(coord, next))) return false
  const previous = path.at(-1)
  return previous ? isAdjacent(previous, next) : true
}

export function appendIfValid(path: Coord[], next: Coord): Coord[] {
  return canAppend(path, next) ? [...path, next] : path
}
