import type { Question } from '../types'

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Builds a round queue of `length` questions from the available pool.
 * Missed-question ids from last session are surfaced first (spaced repetition).
 * If the pool is smaller than `length`, it cycles through reshuffled passes,
 * never repeating a question immediately back-to-back.
 */
export function buildRoundQueue(pool: Question[], length: number, missedIds: string[]): Question[] {
  if (pool.length === 0) return []

  const missedSet = new Set(missedIds)
  const priority = shuffle(pool.filter((q) => missedSet.has(q.id)))
  const rest = shuffle(pool.filter((q) => !missedSet.has(q.id)))
  let ordered = [...priority, ...rest]

  const queue: Question[] = []
  let lastId: string | null = null
  while (queue.length < length) {
    if (ordered.length === 0) ordered = shuffle(pool)
    let next = ordered.shift()!
    if (next.id === lastId && ordered.length > 0) {
      ordered.push(next)
      next = ordered.shift()!
    }
    queue.push(next)
    lastId = next.id
  }
  return queue
}

export function checkAnswer(question: Question, response: string | Record<string, string>): boolean {
  if (question.type === 'matching') {
    if (!question.pairs || typeof response !== 'object') return false
    return question.pairs.every((pair) => response[pair.term] === pair.match)
  }
  if (typeof response !== 'string') return false
  return response.trim().toLowerCase() === (question.answer ?? '').trim().toLowerCase()
}
