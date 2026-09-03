import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { maskWord, normalizeAnswer, scrambleWord, shuffleWords } from '../spelling/activity'
import { parseSpellingWords } from '../spelling/parse'
import { loadSpellingLists, saveSpellingLists } from '../spelling/storage'
import type { SpellingActivity, SpellingList } from '../spelling/types'

const activityLabels: Record<SpellingActivity, { title: string; detail: string }> = {
  study: { title: 'Study cards', detail: 'See each word and decide whether it needs another look.' },
  unscramble: { title: 'Unscramble', detail: 'Put mixed-up letters back into the spelling word.' },
  missing: { title: 'Missing letters', detail: 'Use the pattern as a clue, then type the whole word.' },
  hear: { title: 'Hear & spell', detail: 'Listen to the word, then spell it without seeing it.' },
}

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function SpellingCenter({ onBack }: { onBack: () => void }) {
  const [lists, setLists] = useState<SpellingList[]>(() => loadSpellingLists())
  const [activeListId, setActiveListId] = useState<string | null>(() => loadSpellingLists()[0]?.id ?? null)
  const [activity, setActivity] = useState<SpellingActivity | null>(null)
  const [importName, setImportName] = useState('')
  const [importText, setImportText] = useState('')
  const parsedWords = useMemo(() => parseSpellingWords(importText), [importText])
  const activeList = lists.find((list) => list.id === activeListId) ?? lists[0] ?? null

  useEffect(() => {
    saveSpellingLists(lists)
    if (lists.length && !lists.some((list) => list.id === activeListId)) {
      setActiveListId(lists[0].id)
    }
    if (!lists.length) setActiveListId(null)
  }, [lists, activeListId])

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setImportText(text)
    if (!importName.trim()) setImportName(file.name.replace(/\.[^.]+$/, ''))
    event.target.value = ''
  }

  function addList() {
    if (!parsedWords.length) return
    const list: SpellingList = {
      id: createId(),
      name: importName.trim() || `Spelling list ${lists.length + 1}`,
      words: parsedWords,
      createdAt: Date.now(),
    }
    setLists((current) => [list, ...current])
    setActiveListId(list.id)
    setImportName('')
    setImportText('')
  }

  function deleteList(id: string) {
    const list = lists.find((item) => item.id === id)
    if (!list || !window.confirm(`Delete “${list.name}”?`)) return
    setLists((current) => current.filter((item) => item.id !== id))
    if (activeListId === id) setActivity(null)
  }

  if (activity && activeList) {
    return (
      <ActivityRunner
        key={`${activeList.id}-${activity}`}
        list={activeList}
        activity={activity}
        onBack={() => setActivity(null)}
      />
    )
  }

  return (
    <main className="app-shell spelling-shell">
      <section className="game-card spelling-card">
        <header className="game-header">
          <div>
            <button className="text-button back-button" onClick={onBack}>← All activities</button>
            <div className="brand-kicker">LUMA · SPELLING</div>
            <h1>Spelling Lab</h1>
            <p className="hero-copy">Bring in this week’s spelling words once, then reuse them across several practice games.</p>
          </div>
        </header>

        <div className="spelling-layout">
          <section className="spelling-panel import-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">IMPORT</span>
                <h2>Add a word list</h2>
              </div>
              <span className="word-count-badge">{parsedWords.length} words</span>
            </div>

            <label className="field-label" htmlFor="list-name">List name</label>
            <input
              id="list-name"
              className="text-input"
              value={importName}
              onChange={(event) => setImportName(event.target.value)}
              placeholder="Week 4 spelling"
            />

            <label className="field-label" htmlFor="word-list">Paste words</label>
            <textarea
              id="word-list"
              className="word-import-area"
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder={'because\nfriend\npeople\nthought\nwhere'}
              rows={8}
            />
            <p className="tiny-note">New lines, commas, semicolons, tabs, numbered lists, TXT, and simple CSV files all work.</p>

            <div className="button-row spelling-import-actions">
              <label className="secondary-button file-button">
                Import file
                <input type="file" accept=".txt,.csv,text/plain,text/csv" onChange={handleFile} />
              </label>
              <button className="primary-button" onClick={addList} disabled={!parsedWords.length}>Save list</button>
            </div>
          </section>

          <section className="spelling-panel library-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">LIBRARY</span>
                <h2>Your spelling lists</h2>
              </div>
              <span className="word-count-badge">{lists.length} saved</span>
            </div>

            {!lists.length ? (
              <div className="empty-spelling-state">
                <strong>No lists yet</strong>
                <span>Paste this week’s words or import a TXT/CSV file to get started.</span>
              </div>
            ) : (
              <div className="spelling-list-stack">
                {lists.map((list) => (
                  <article className={`saved-list-card ${activeList?.id === list.id ? 'active' : ''}`} key={list.id}>
                    <button className="saved-list-main" onClick={() => setActiveListId(list.id)}>
                      <strong>{list.name}</strong>
                      <span>{list.words.length} words · {list.words.slice(0, 4).join(', ')}{list.words.length > 4 ? '…' : ''}</span>
                    </button>
                    <button className="list-delete" aria-label={`Delete ${list.name}`} onClick={() => deleteList(list.id)}>×</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {activeList && (
          <section className="activity-section">
            <div className="section-heading activity-heading">
              <div>
                <span className="eyebrow">PRACTICE WITH</span>
                <h2>{activeList.name}</h2>
              </div>
              <span className="word-count-badge">{activeList.words.length} words</span>
            </div>
            <div className="activity-grid">
              {(Object.keys(activityLabels) as SpellingActivity[]).map((key) => (
                <button className="activity-card" key={key} onClick={() => setActivity(key)}>
                  <strong>{activityLabels[key].title}</strong>
                  <span>{activityLabels[key].detail}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

type ActivityRunnerProps = {
  list: SpellingList
  activity: SpellingActivity
  onBack: () => void
}

function ActivityRunner({ list, activity, onBack }: ActivityRunnerProps) {
  const [queue] = useState(() => shuffleWords(list.words))
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)
  const [attempted, setAttempted] = useState(0)
  const [correct, setCorrect] = useState(0)
  const current = queue[index % queue.length]
  const scrambled = useMemo(() => scrambleWord(current), [current])
  const masked = useMemo(() => maskWord(current), [current])

  function nextWord() {
    setIndex((value) => value + 1)
    setAnswer('')
    setResult(null)
  }

  function markStudy(gotIt: boolean) {
    setAttempted((value) => value + 1)
    if (gotIt) setCorrect((value) => value + 1)
    nextWord()
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!answer.trim() || result) return
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(current)
    setResult(isCorrect ? 'correct' : 'incorrect')
    setAttempted((value) => value + 1)
    if (isCorrect) setCorrect((value) => value + 1)
  }

  function speakWord() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(current)
    utterance.rate = 0.78
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="app-shell spelling-shell">
      <section className="game-card activity-runner">
        <header className="game-header">
          <div>
            <button className="text-button back-button" onClick={onBack}>← Spelling Lab</button>
            <div className="brand-kicker">{list.name.toUpperCase()}</div>
            <h1>{activityLabels[activity].title}</h1>
          </div>
          <div className="activity-score" aria-label={`${correct} correct out of ${attempted} attempts`}>
            <span>Correct</span>
            <strong>{correct}/{attempted}</strong>
          </div>
        </header>

        <div className="activity-progress" aria-label={`Word ${index + 1}`}>
          <span style={{ width: `${((index % queue.length) + 1) / queue.length * 100}%` }} />
        </div>

        {activity === 'study' ? (
          <section className="study-stage">
            <span className="eyebrow">READ IT · SAY IT · NOTICE IT</span>
            <div className="study-word">{current}</div>
            <p>Look closely at the parts that could be tricky to remember.</p>
            <div className="button-row centered">
              <button className="secondary-button" onClick={() => markStudy(false)}>Again</button>
              <button className="primary-button" onClick={() => markStudy(true)}>Got it</button>
            </div>
          </section>
        ) : (
          <form className="quiz-stage" onSubmit={checkAnswer}>
            <Prompt activity={activity} word={current} scrambled={scrambled} masked={masked} onSpeak={speakWord} />
            <label className="field-label" htmlFor="spelling-answer">Spell the word</label>
            <input
              id="spelling-answer"
              className={`spelling-answer ${result ?? ''}`}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              disabled={result !== null}
            />

            {result && (
              <div className={`answer-feedback ${result}`} role="status">
                {result === 'correct' ? 'Correct!' : <>The word is <strong>{current}</strong>.</>}
              </div>
            )}

            <div className="button-row centered">
              {!result ? (
                <button className="primary-button" type="submit" disabled={!answer.trim()}>Check spelling</button>
              ) : (
                <button className="primary-button" type="button" onClick={nextWord}>Next word</button>
              )}
            </div>
          </form>
        )}
      </section>
    </main>
  )
}

type PromptProps = {
  activity: Exclude<SpellingActivity, 'study'>
  word: string
  scrambled: string
  masked: string
  onSpeak: () => void
}

function Prompt({ activity, word, scrambled, masked, onSpeak }: PromptProps) {
  if (activity === 'unscramble') {
    return (
      <div className="activity-prompt">
        <span className="eyebrow">UNSCRAMBLE</span>
        <strong className="letter-prompt">{scrambled}</strong>
        <p>Use every letter once.</p>
      </div>
    )
  }

  if (activity === 'missing') {
    return (
      <div className="activity-prompt">
        <span className="eyebrow">FILL THE GAPS</span>
        <strong className="letter-prompt masked-word">{masked}</strong>
        <p>Type the complete word below.</p>
      </div>
    )
  }

  return (
    <div className="activity-prompt hear-prompt">
      <span className="eyebrow">LISTEN</span>
      <button className="speak-button" type="button" onClick={onSpeak} aria-label={`Hear spelling word ${word.length} letters long`}>
        🔊 Hear word
      </button>
      <p>Listen as many times as you need, then spell it.</p>
    </div>
  )
}
