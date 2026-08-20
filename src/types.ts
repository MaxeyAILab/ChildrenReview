export type Subject = 'science' | 'math' | 'english' | 'filipino'

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface MatchPair {
  term: string
  match: string
}

export interface Question {
  id: string
  subject: Subject
  topic: string
  grade: number
  difficulty: Difficulty
  type: QuestionType
  question: string
  options?: string[]
  answer?: string
  pairs?: MatchPair[]
  explanation: string
  hint?: string
}

export interface TopicMeta {
  key: string
  label: string
  icon: string
  available: boolean
}

export interface SubjectMeta {
  key: Subject
  label: string
  icon: string
  color: string
  topics: TopicMeta[]
}

export interface TopicStat {
  correct: number
  total: number
}

export type AvatarSlot = 'base' | 'hat' | 'accessory' | 'background'

export interface ShopItem {
  id: string
  slot: AvatarSlot
  label: string
  emoji?: string
  gradient?: string
  cost: number
}

export interface Progress {
  points: number
  coins: number
  bestStreak: number
  badges: string[]
  topicStats: Record<string, TopicStat>
  missedQueue: Record<string, string[]>
  soundOn: boolean
  ownedItems: string[]
  equipped: Partial<Record<AvatarSlot, string>>
}

export interface RoundResult {
  subject: Subject
  topic: string
  topicLabel: string
  total: number
  correct: number
  bestStreak: number
  pointsEarned: number
  coinsEarned: number
  stars: 1 | 2 | 3
  newBadges: string[]
  leveledUp: boolean
  newLevel: number
}

export type Mode = 'normal' | 'challenge'

export type Screen =
  | { name: 'home' }
  | { name: 'shop' }
  | { name: 'subject' }
  | { name: 'topic'; subject: Subject }
  | { name: 'config'; subject: Subject; topic: TopicMeta }
  | { name: 'quiz'; subject: Subject; topic: TopicMeta; length: number; mode: Mode }
  | { name: 'summary'; result: RoundResult }
