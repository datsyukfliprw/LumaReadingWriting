/// <reference lib="webworker" />

import { dictionary } from '../game/dictionary'
import { solveBoard } from '../game/solver'
import type { Board } from '../game/types'

self.onmessage = (event: MessageEvent<Board>) => {
  const solutions = solveBoard(event.data, dictionary, 5000)
  self.postMessage(solutions)
}
