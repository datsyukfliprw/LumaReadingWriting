import { useMemo, useRef } from 'react'
import type { Board, Coord } from '../game/types'
import { coordKey } from '../game/solver'
import { sameCoord } from '../game/path'

const parseTileCoord = (element: Element | null): Coord | null => {
  const tile = element?.closest<HTMLElement>('[data-board-tile="true"]')
  if (!tile) return null
  const row = Number(tile.dataset.row)
  const col = Number(tile.dataset.col)
  return Number.isFinite(row) && Number.isFinite(col) ? { row, col } : null
}

type Props = {
  board: Board
  path: Coord[]
  disabled?: boolean
  onSelect: (coord: Coord, reset?: boolean) => void
}

export function GameBoard({ board, path, disabled = false, onSelect }: Props) {
  const dragging = useRef(false)
  const didMove = useRef(false)
  const startCoord = useRef<Coord | null>(null)
  const selected = useMemo(() => new Set(path.map(coordKey)), [path])
  const order = useMemo(() => new Map(path.map((coord, index) => [coordKey(coord), index + 1])), [path])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const coord = parseTileCoord(event.target as Element)
    if (!coord) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = true
    didMove.current = false
    startCoord.current = coord
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !dragging.current || !startCoord.current) return
    const element = document.elementFromPoint(event.clientX, event.clientY)
    const coord = parseTileCoord(element)
    if (!coord || sameCoord(coord, startCoord.current)) return

    if (!didMove.current) {
      didMove.current = true
      onSelect(startCoord.current, true)
    }
    onSelect(coord)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return

    if (!didMove.current && startCoord.current) {
      onSelect(startCoord.current)
    }

    dragging.current = false
    didMove.current = false
    startCoord.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      className="game-board"
      role="grid"
      aria-label="Word grid"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {board.flat().map((tile) => {
        const key = coordKey(tile)
        const isSelected = selected.has(key)
        return (
          <button
            className={`letter-tile${isSelected ? ' is-selected' : ''}`}
            type="button"
            role="gridcell"
            aria-pressed={isSelected}
            aria-label={`${tile.letter}, row ${tile.row + 1}, column ${tile.col + 1}`}
            data-board-tile="true"
            data-row={tile.row}
            data-col={tile.col}
            key={tile.id}
            tabIndex={disabled ? -1 : 0}
            disabled={disabled}
            onClick={() => { if (!disabled) onSelect(tile) }}
          >
            <span className="tile-letter">{tile.letter}</span>
            {isSelected && <span className="tile-order">{order.get(key)}</span>}
          </button>
        )
      })}
    </div>
  )
}
