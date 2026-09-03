import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createBoard, pathToWord } from '../game/board'
import { isDictionaryWord } from '../game/dictionary'
import { appendIfValid } from '../game/path'
import { scoreWord } from '../game/scoring'
import type { Board, Coord, GameMode, GameStatus, SubmittedWord } from '../game/types'

const MODE_SECONDS: Record<Exclude<GameMode, 'free'>, number> = {
  '3min': 180,
  '10min': 600,
}

type Feedback = {
  tone: 'good' | 'bad' | 'neutral'
  message: string
}

export function useGameSession() {
  const [status, setStatus] = useState<GameStatus>('idle')
  const [mode, setMode] = useState<GameMode>('3min')
  const [board, setBoard] = useState<Board>(() => createBoard())
  const [path, setPath] = useState<Coord[]>([])
  const [submitted, setSubmitted] = useState<SubmittedWord[]>([])
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(180)
  const [countdown, setCountdown] = useState(3)
  const [feedback, setFeedback] = useState<Feedback>({ tone: 'neutral', message: 'Drag across neighboring letters to make a word.' })
  const [solutions, setSolutions] = useState<string[]>([])
  const countdownTimer = useRef<number | undefined>()

  const isTimedGame = secondsRemaining !== null
  const currentWord = useMemo(() => pathToWord(board, path), [board, path])
  const score = useMemo(() => submitted.reduce((sum, item) => sum + item.score, 0), [submitted])
  const foundWords = useMemo(() => new Set(submitted.map((item) => item.word)), [submitted])

  const start = useCallback((nextMode: GameMode) => {
    window.clearInterval(countdownTimer.current)
    setMode(nextMode)
    setBoard(createBoard())
    setPath([])
    setSubmitted([])
    setSolutions([])
    setFeedback({ tone: 'neutral', message: 'Get ready.' })
    setCountdown(3)
    setStatus('countdown')
    setSecondsRemaining(nextMode === 'free' ? null : MODE_SECONDS[nextMode])

    let count = 3
    countdownTimer.current = window.setInterval(() => {
      count -= 1
      setCountdown(count)
      if (count <= 0) {
        window.clearInterval(countdownTimer.current)
        setStatus('playing')
        setFeedback({ tone: 'neutral', message: 'Drag across neighboring letters to make a word.' })
      }
    }, 700)
  }, [])

  const finish = useCallback(() => {
    setStatus('finished')
    setPath([])
    setFeedback({ tone: 'neutral', message: 'Round complete.' })
  }, [])

  useEffect(() => {
    if (status !== 'playing' || !isTimedGame) return

    const id = window.setInterval(() => {
      setSecondsRemaining((value) => (value == null ? null : Math.max(0, value - 1)))
    }, 1000)

    return () => window.clearInterval(id)
  }, [status, isTimedGame])

  useEffect(() => {
    if (status === 'playing' && secondsRemaining === 0) finish()
  }, [status, secondsRemaining, finish])

  useEffect(() => {
    return () => window.clearInterval(countdownTimer.current)
  }, [])

  useEffect(() => {
    if (status !== 'finished') return

    const worker = new Worker(new URL('../workers/solver.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent<string[]>) => setSolutions(event.data)
    worker.postMessage(board)

    return () => worker.terminate()
  }, [status, board])

  const selectTile = useCallback((coord: Coord, reset = false) => {
    if (status !== 'playing') return
    setPath((current) => appendIfValid(reset ? [] : current, coord))
  }, [status])

  const clearPath = useCallback(() => setPath([]), [])

  const undoTile = useCallback(() => {
    setPath((current) => current.slice(0, -1))
  }, [])

  const submitWord = useCallback(() => {
    if (status !== 'playing') return
    const word = pathToWord(board, path).toUpperCase()

    if (word.length < 3) {
      setFeedback({ tone: 'bad', message: 'Words need at least 3 letters.' })
      return
    }

    if (foundWords.has(word)) {
      setFeedback({ tone: 'bad', message: `${word} was already found.` })
      setPath([])
      return
    }

    if (!isDictionaryWord(word)) {
      setFeedback({ tone: 'bad', message: `${word} is not in the word list.` })
      setPath([])
      return
    }

    const earned = scoreWord(word)
    setSubmitted((items) => [...items, { word, score: earned, path }])
    setFeedback({ tone: 'good', message: `${word} +${earned}` })
    setPath([])
  }, [status, board, path, foundWords])

  const reset = useCallback(() => {
    window.clearInterval(countdownTimer.current)
    setStatus('idle')
    setPath([])
    setSubmitted([])
    setSolutions([])
    setFeedback({ tone: 'neutral', message: 'Drag across neighboring letters to make a word.' })
  }, [])

  const shuffle = useCallback(() => {
    if (status !== 'playing') return
    setBoard(createBoard())
    setPath([])
    setFeedback({ tone: 'neutral', message: 'Fresh board.' })
  }, [status])

  return {
    status,
    mode,
    board,
    path,
    currentWord,
    submitted,
    score,
    secondsRemaining,
    countdown,
    feedback,
    solutions,
    start,
    finish,
    selectTile,
    clearPath,
    undoTile,
    submitWord,
    shuffle,
    reset,
  }
}
