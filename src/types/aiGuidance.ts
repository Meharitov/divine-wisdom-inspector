export type GuidanceLens =
  | "socratic"
  | "contemplative"
  | "thomistic"
  | "wisdom"
  | "prophetic"
  | "logos"

export type GuidanceMode = "question" | "topic" | "reflection"

export type GuidanceSource = "openai" | "offline"

export interface GuidanceLensMeta {
  key: GuidanceLens
  label: string
  tagline: string
  description: string
}

export interface ScriptureAnchor {
  verse: string
  reference: string
  book: string
  insight: string
}

export interface GuidanceResponse {
  id: string
  mode: GuidanceMode
  lens: GuidanceLens
  query: string
  title: string
  themeLabel: string
  thesis: string
  scriptureAnchors: ScriptureAnchor[]
  dialectic: string
  reflectionQuestions: string[]
  virtues: string[]
  contemplativePrompt: string
  followUps: string[]
  source: GuidanceSource
  createdAt: number
}

export interface JournalEntry extends GuidanceResponse {
  journalId: string
  savedAt: number
}

export interface GuidanceRequest {
  mode: GuidanceMode
  lens: GuidanceLens
  query: string
}

export interface Theme {
  key: string
  label: string
  keywords: string[]
  title: string
  anchors: ScriptureAnchor[]
  core: string
  interpretation: string
  applications: string[]
  contemplative: string
  followUps: string[]
}

export interface OpenAIConfig {
  apiKey: string
  model: string
  temperature: number
}