const HEADER_WORDS = new Set(['word', 'words', 'spelling', 'spelling word', 'spelling words'])

function cleanToken(token: string): string {
  return token
    .trim()
    .replace(/^\s*(?:[-*•]+|\d+[.)-])\s*/, '')
    .replace(/^['"]|['"]$/g, '')
    .trim()
    .toLowerCase()
}

export function parseSpellingWords(input: string): string[] {
  const tokens = input
    .replace(/\r/g, '\n')
    .split(/[\n,;\t]+/)
    .map(cleanToken)
    .filter(Boolean)

  const result: string[] = []
  const seen = new Set<string>()

  for (const token of tokens) {
    if (HEADER_WORDS.has(token) && result.length === 0) continue
    if (!/^[a-z]+(?:['-][a-z]+)*$/i.test(token)) continue
    if (seen.has(token)) continue
    seen.add(token)
    result.push(token)
  }

  return result
}
