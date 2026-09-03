import englishWords from 'an-array-of-english-words'

export const dictionary = new Set(
  englishWords
    .filter((word) => /^[a-z]+$/i.test(word) && word.length >= 3)
    .map((word) => word.toUpperCase()),
)

export function isDictionaryWord(word: string): boolean {
  return dictionary.has(word.toUpperCase())
}
