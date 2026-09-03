import { useState } from 'react'
import { SpellingCenter } from './components/SpellingCenter'
import { WordTrail } from './components/WordTrail'
import './styles.css'

type HomeView = 'home' | 'word-trail' | 'spelling'

export default function App() {
  const [view, setView] = useState<HomeView>('home')

  if (view === 'word-trail') return <WordTrail onBack={() => setView('home')} />
  if (view === 'spelling') return <SpellingCenter onBack={() => setView('home')} />

  return (
    <main className="app-shell welcome-shell">
      <section className="hero-card home-card">
        <div className="brand-kicker">LUMA READING & WRITING</div>
        <h1>Practice that feels like play.</h1>
        <p className="hero-copy">
          Choose a word game, or bring in this week’s spelling list and practice it in several different ways.
        </p>

        <div className="home-activity-grid">
          <button className="home-activity-card word-trail-card" onClick={() => setView('word-trail')}>
            <span className="activity-tag">WORD GAME</span>
            <strong>Word Trail</strong>
            <span>Trace neighboring letters to discover words against the clock or in free play.</span>
            <b>Play Word Trail →</b>
          </button>

          <button className="home-activity-card spelling-home-card" onClick={() => setView('spelling')}>
            <span className="activity-tag">YOUR WORDS</span>
            <strong>Spelling Lab</strong>
            <span>Import weekly spelling lists and practice with study cards, scrambles, missing letters, and listening.</span>
            <b>Open Spelling Lab →</b>
          </button>
        </div>

        <p className="tiny-note">Spelling lists stay on this device in the browser, so they are ready for the next practice session.</p>
      </section>
    </main>
  )
}
