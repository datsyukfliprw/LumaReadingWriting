# Luma Reading & Writing

This repository currently contains **Word Trail**, a touch-first word-grid game for reading and spelling practice.

## Why this structure

The project combines two useful ideas without mechanically merging unrelated repositories:

- a small, testable game-domain architecture inspired by the clean separation in **Koggle**;
- richer interaction patterns inspired by publicly observable behavior in **Babbling Bubbles**, reimplemented from scratch here rather than copying its unlicensed source.

The result uses modern React + TypeScript and one pointer-event interaction model for touch, mouse, stylus, and iPad.

## Current gameplay

- 4×4 generated letter board
- drag through adjacent letters to create a word
- tap letters one at a time as an alternative
- no tile reuse within a word
- dictionary validation
- length-based scoring
- 3-minute, 10-minute, and free-play modes
- countdown, timer, score, found-word history, and results screen
- board solver after the round to surface long missed words
- keyboard-focusable controls and reduced-motion support
- unit tests for adjacency/path rules, scoring, and the solver

## Run locally

```sh
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Verify

```sh
npm test
npm run build
npm run lint
```

## Architecture

```text
src/
  components/       visual/game interaction components
  game/             board generation, path rules, dictionary, score, trie, solver
  hooks/            game-session orchestration
  types/            third-party type shims
  App.tsx            product flow and screens
  styles.css         responsive touch-first UI
```

The game rules stay in `src/game`, separate from React. That lets future Luma features reuse the mechanics without tying them to one screen.

## Next production steps

Before treating this as a shipped child-facing learning product, add curated age-appropriate vocabulary lists, parent/learner profiles, persistent progress, accessibility QA on iPad, and end-to-end interaction tests.
