import type { SubjectMeta } from '../types'
import scienceQuestions from './science.json'
import type { Question } from '../types'

export const questionBank: Record<string, Question[]> = {
  science: scienceQuestions as Question[],
  math: [],
  english: [],
  filipino: [],
}

export const subjects: SubjectMeta[] = [
  {
    key: 'science',
    label: 'Science',
    icon: '🔬',
    color: 'from-emerald-400 to-teal-500',
    topics: [
      { key: 'digestive_system', label: 'Digestive System', icon: '🍎', available: true },
      { key: 'circulatory_system', label: 'Circulatory System', icon: '❤️', available: true },
      { key: 'muscular_system', label: 'Muscular System', icon: '💪', available: true },
      { key: 'skeletal_system', label: 'Skeletal System', icon: '🦴', available: true },
    ],
  },
  {
    key: 'math',
    label: 'Math',
    icon: '➗',
    color: 'from-sky-400 to-blue-500',
    topics: [
      { key: 'coming_soon', label: 'Coming Soon', icon: '✨', available: false },
    ],
  },
  {
    key: 'english',
    label: 'English',
    icon: '📘',
    color: 'from-amber-400 to-orange-500',
    topics: [
      { key: 'coming_soon', label: 'Coming Soon', icon: '✨', available: false },
    ],
  },
  {
    key: 'filipino',
    label: 'Filipino',
    icon: '📗',
    color: 'from-rose-400 to-pink-500',
    topics: [
      { key: 'coming_soon', label: 'Coming Soon', icon: '✨', available: false },
    ],
  },
]

export function getTopicKey(subject: string, topic: string) {
  return `${subject}:${topic}`
}

export function questionsForTopic(subject: string, topic: string): Question[] {
  return questionBank[subject]?.filter((q) => q.topic === topic) ?? []
}
