import { describe, expect, it } from 'vitest'
import { scoreWord } from '../src/game/scoring'

describe('word scoring', () => {
  it('uses length-based word-grid scoring', () => {
    expect(scoreWord('AT')).toBe(0)
    expect(scoreWord('CAT')).toBe(1)
    expect(scoreWord('MATH')).toBe(1)
    expect(scoreWord('READS')).toBe(2)
    expect(scoreWord('WRITER')).toBe(3)
    expect(scoreWord('READING')).toBe(5)
    expect(scoreWord('NOTEBOOK')).toBe(11)
  })
})
