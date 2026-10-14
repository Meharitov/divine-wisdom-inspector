export type TopicKey = "faith" | "purpose" | "resilience" | "calm" | "justice" | "hope"

export interface WisdomPassage {
  id: string
  topic: TopicKey
  title: string
  question: string
  answer: string
  scripture: string
  reference: string
  reflection: string
}

export interface DailyReflection {
  id: string
  title: string
  passage: string
  reference: string
  journalPrompt: string
  contemplationMinutes: number
}

export interface WisdomTopic {
  key: TopicKey
  label: string
  description: string
  passageCount: number
}

export interface RepoMeta {
  name: string
  description: string
  stars: number
  language: string
  license: string
  url: string
}
