import type { SpellingList } from './types'

const STORAGE_KEY = 'luma.spellingLists.v1'

function isSpellingList(value: unknown): value is SpellingList {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<SpellingList>
  return typeof candidate.id === 'string'
    && typeof candidate.name === 'string'
    && Array.isArray(candidate.words)
    && candidate.words.every((word) => typeof word === 'string')
    && typeof candidate.createdAt === 'number'
}

export function loadSpellingLists(): SpellingList[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSpellingList)
  } catch {
    return []
  }
}

export function saveSpellingLists(lists: SpellingList[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}
