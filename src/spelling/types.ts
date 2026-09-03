export type SpellingList = {
  id: string
  name: string
  words: string[]
  createdAt: number
}

export type SpellingActivity = 'study' | 'unscramble' | 'missing' | 'hear'
