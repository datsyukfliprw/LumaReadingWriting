# Luma Reading & Writing

Luma Reading & Writing is a touch-first literacy practice app built with React + TypeScript. It currently includes **Word Trail** plus a reusable **Spelling Lab** for weekly spelling lists.

## Word Trail

The word-grid game keeps game logic separate from the interface and uses one pointer-event interaction model for touch, mouse, stylus, and iPad.

- 4×4 generated letter board
- drag through adjacent letters to create a word
- tap letters one at a time as an alternative
- no tile reuse within a word
- dictionary validation
- length-based scoring
- 3-minute, 10-minute, and free-play modes
- countdown, timer, score, found-word history, and results screen
- board solver after the round to surface long missed words

The architecture is influenced by the clean separation in **Koggle**. Richer interaction concepts were independently reimplemented rather than copying source from Babbling Bubbles.

## Spelling Lab

Spelling Lab lets a parent or learner import a weekly spelling list once and reuse it across multiple activities.

### Import

- paste words separated by new lines, commas, semicolons, or tabs
- paste simple numbered/bulleted lists
- import TXT files
- import simple CSV files
- duplicate words are automatically removed
- lists are saved in browser localStorage on the device
- multiple named lists can be kept and switched between

### Activities

- **Study cards** — read, notice, and mark words for another look
- **Unscramble** — rebuild a word from shuffled letters
- **Missing letters** — use a partially hidden spelling pattern as a clue
- **Hear & spell** — use browser speech synthesis to hear a word and type it from memory

## Run locally

```sh
npm install
npm run dev
```

To expose the Vite development server on a home network:

```sh
npm run dev -- --host 0.0.0.0
```

## Verify

```sh
npm test
npm run build
npm run lint
```

## Architecture

```text
src/
  components/       Word Trail and Spelling Lab screens
  game/             board generation, path rules, dictionary, score, trie, solver
  hooks/            Word Trail game-session orchestration
  spelling/         spelling-list parsing, storage, types, and activity helpers
  types/            third-party type shims
  App.tsx            top-level activity launcher
  styles.css         Word Trail/base responsive UI
  spelling.css       Spelling Lab and launcher UI
```

## Next production steps

Useful next steps include learner profiles, progress/mastery history, teacher/parent assignment flows, curated vocabulary support, additional spelling activities, iPad accessibility QA, and end-to-end interaction tests.
