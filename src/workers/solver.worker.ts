import { dictionary } from '../game/dictionary'
import { solveBoard } from '../game/solver'
import type { Board } from '../game/types'

type SolverWorkerScope = {
  onmessage: ((event: MessageEvent<Board>) => void) | null
  postMessage: (message: string[]) => void
}

const workerScope = self as unknown as SolverWorkerScope

workerScope.onmessage = (event) => {
  const solutions = solveBoard(event.data, dictionary, 5000)
  workerScope.postMessage(solutions)
}
