export function shuffleWords(words: string[]): string[] {
  const copy = [...words]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = copy[i]
    copy[i] = copy[j]
    copy[j] = current
  }
  return copy
}

export function scrambleWord(word: string): string {
  if (word.length < 2) return word

  const chars = [...word]
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const shuffled = shuffleWords(chars)
    const result = shuffled.join('')
    if (result !== word) return result
  }

  return [...word.slice(1), word[0]].join('')
}

export function maskWord(word: string): string {
  if (!word) return ''
  if (word.length === 1) return '_'

  const chars = [...word]
  let hidden = 0
  const targetHidden = Math.max(1, Math.ceil(word.length / 3))

  for (let i = 1; i < chars.length && hidden < targetHidden; i += 2) {
    if (/^[a-z]$/i.test(chars[i])) {
      chars[i] = '_'
      hidden += 1
    }
  }

  if (hidden === 0) chars[chars.length - 1] = '_'
  return chars.join(' ')
}

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase()
}
