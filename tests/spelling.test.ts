import { describe, expect, it } from 'vitest'
import { maskWord, normalizeAnswer, scrambleWord } from '../src/spelling/activity'
import { parseSpellingWords } from '../src/spelling/parse'

describe('spelling list import', () => {
  it('parses pasted, numbered, comma-separated, and duplicate words', () => {
    const input = 'Words\n1. Because\n2. Friend\npeople, thought; friend\nwhere'
    expect(parseSpellingWords(input)).toEqual(['because', 'friend', 'people', 'thought', 'where'])
  })

  it('ignores cells that are not simple spelling words', () => {
    expect(parseSpellingWords('word\nhello\n123\nhello!\nmother-in-law')).toEqual(['hello', 'mother-in-law'])
  })
})

describe('spelling activities', () => {
  it('scrambles without changing the letters', () => {
    const word = 'planet'
    const scrambled = scrambleWord(word)
    expect([...scrambled].sort()).toEqual([...word].sort())
    expect(scrambled).not.toBe(word)
  })

  it('creates at least one missing-letter clue', () => {
    expect(maskWord('because')).toContain('_')
  })

  it('normalizes typed answers for grading', () => {
    expect(normalizeAnswer('  FriEnd ')).toBe('friend')
  })
})
