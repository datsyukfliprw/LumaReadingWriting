export type Coord = {
  row: number
  col: number
}

export type Tile = Coord & {
  id: string
  letter: string
}

export type Board = Tile[][]

export type GameMode = '3min' | '10min' | 'free'

export type SubmittedWord = {
  word: string
  score: number
  path: Coord[]
}

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'finished'
