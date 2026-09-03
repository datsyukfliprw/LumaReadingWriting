export class TrieNode {
  children = new Map<string, TrieNode>()
  terminal = false
}

export class Trie {
  readonly root = new TrieNode()

  constructor(words: Iterable<string>) {
    for (const word of words) this.insert(word)
  }

  insert(word: string): void {
    let node = this.root
    for (const letter of word.toUpperCase()) {
      if (!node.children.has(letter)) node.children.set(letter, new TrieNode())
      node = node.children.get(letter)!
    }
    node.terminal = true
  }
}
