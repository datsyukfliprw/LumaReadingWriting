import { useMemo } from 'react'
import { useGameSession } from '../hooks/useGameSession'
import type { GameMode } from '../game/types'
import { GameBoard } from './GameBoard'
import { StatPill } from './StatPill'

const modeLabel: Record<GameMode, string> = {
  '3min': '3 minute',
  '10min': '10 minute',
  free: 'Free play',
}

function formatTime(seconds: number | null): string {
  if (seconds == null) return '∞'
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

export function WordTrail({ onBack }: { onBack: () => void }) {
  const game = useGameSession()
  const bestWord = useMemo(
    () => [...game.submitted].sort((a, b) => b.score - a.score || b.word.length - a.word.length)[0],
    [game.submitted],
  )

  if (game.status === 'idle') {
    return (
      <main className="app-shell welcome-shell">
        <section className="hero-card">
          <button className="text-button back-button" onClick={onBack}>← All activities</button>
          <div className="brand-kicker">LUMA READING & WRITING</div>
          <h1>Word Trail</h1>
          <p className="hero-copy">
            Build words by tracing neighboring letters. Tap letters one at a time or drag through the grid with a finger, mouse, or stylus.
          </p>
          <div className="mode-grid" aria-label="Choose a game mode">
            <ModeButton title="Quick round" detail="3 minutes" onClick={() => game.start('3min')} />
            <ModeButton title="Deep round" detail="10 minutes" onClick={() => game.start('10min')} />
            <ModeButton title="Practice" detail="No timer" onClick={() => game.start('free')} />
          </div>
          <p className="tiny-note">Words must be at least 3 letters. Each tile can be used once per word.</p>
        </section>
      </main>
    )
  }

  if (game.status === 'countdown') {
    return (
      <main className="app-shell countdown-shell" aria-live="polite">
        <div className="countdown-orb">{game.countdown}</div>
        <p>Find the trail.</p>
      </main>
    )
  }

  if (game.status === 'finished') {
    return (
      <main className="app-shell">
        <section className="game-card results-card">
          <div className="brand-kicker">ROUND COMPLETE</div>
          <h1>{game.score} points</h1>
          <div className="stats-row results-stats">
            <StatPill label="Words" value={game.submitted.length} />
            <StatPill label="Best" value={bestWord?.word ?? '—'} />
            <StatPill label="Mode" value={modeLabel[game.mode]} />
          </div>

          <div className="results-columns">
            <section>
              <h2>Your words</h2>
              <WordList words={game.submitted.map((item) => `${item.word} · ${item.score}`)} empty="No words this round yet." />
            </section>
            <section>
              <h2>Long words on this board</h2>
              <WordList words={game.solutions.slice(0, 18)} empty="Checking the board…" />
            </section>
          </div>

          <div className="button-row centered">
            <button className="primary-button" onClick={() => game.start(game.mode)}>Play again</button>
            <button className="secondary-button" onClick={game.reset}>Modes</button>
            <button className="text-button" onClick={onBack}>All activities</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="game-card">
        <header className="game-header">
          <div>
            <div className="brand-kicker">LUMA · WORD TRAIL</div>
            <h1>{modeLabel[game.mode]}</h1>
          </div>
          <button className="text-button" onClick={game.finish}>End round</button>
        </header>

        <div className="stats-row">
          <StatPill label="Time" value={formatTime(game.secondsRemaining)} />
          <StatPill label="Score" value={game.score} />
          <StatPill label="Words" value={game.submitted.length} />
        </div>

        <div className="word-preview" aria-live="polite">
          <span>Current word</span>
          <strong>{game.currentWord || 'Trace letters'}</strong>
        </div>

        <GameBoard board={game.board} path={game.path} onSelect={game.selectTile} />

        <div className={`feedback ${game.feedback.tone}`} role="status">
          {game.feedback.message}
        </div>

        <div className="button-row">
          <button className="secondary-button" onClick={game.undoTile} disabled={!game.path.length}>Undo</button>
          <button className="secondary-button" onClick={game.clearPath} disabled={!game.path.length}>Clear</button>
          <button className="primary-button" onClick={game.submitWord} disabled={!game.path.length}>Submit word</button>
        </div>

        <div className="lower-strip">
          <button className="text-button" onClick={game.shuffle}>New board</button>
          <div className="found-word-line" aria-label="Recently found words">
            {game.submitted.slice(-4).reverse().map((item) => (
              <span key={item.word}>{item.word} +{item.score}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

type ModeButtonProps = {
  title: string
  detail: string
  onClick: () => void
}

function ModeButton({ title, detail, onClick }: ModeButtonProps) {
  return (
    <button className="mode-button" onClick={onClick}>
      <strong>{title}</strong>
      <span>{detail}</span>
    </button>
  )
}

function WordList({ words, empty }: { words: string[]; empty: string }) {
  if (!words.length) return <p className="empty-copy">{empty}</p>
  return (
    <div className="word-list">
      {words.map((word) => <span key={word}>{word}</span>)}
    </div>
  )
}
