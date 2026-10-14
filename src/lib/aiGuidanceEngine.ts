import type {
  GuidanceLensMeta,
  GuidanceLens,
  GuidanceMode,
  GuidanceRequest,
  GuidanceResponse,
  GuidanceSource,
  JournalEntry,
  OpenAIConfig,
  ScriptureAnchor,
  Theme,
} from "@/types/aiGuidance"
import { THEMES } from "@/lib/guidanceThemes"

export const LENSES: GuidanceLensMeta[] = [
  {
    key: "socratic",
    label: "Socratic",
    tagline: "Questions that reveal",
    description: "Probing inquiry that turns the question back toward its own roots.",
  },
  {
    key: "contemplative",
    label: "Contemplative",
    tagline: "Stillness and lectio",
    description: "Slow, meditative reading in the monastic tradition of Lectio Divina.",
  },
  {
    key: "thomistic",
    label: "Thomistic",
    tagline: "Faith seeking reason",
    description: "Scholastic reasoning in the tradition of Aquinas: define, distinguish, conclude.",
  },
  {
    key: "wisdom",
    label: "Wisdom Literature",
    tagline: "The sages of old",
    description: "Proverbs, Ecclesiastes, Job, and the Sermon on the Mount.",
  },
  {
    key: "prophetic",
    label: "Prophetic",
    tagline: "Justice and the cry",
    description: "The moral urgency of the prophets turned toward how we live together.",
  },
  {
    key: "logos",
    label: "Logos",
    tagline: "Meaning and reason",
    description: "The meeting of philosophy and revelation: truth, being, and the Word.",
  },
]

const LENS_FRAMES: Record<GuidanceLens, (theme: Theme) => string> = {
  socratic: (t) =>
    `Before we reach for an answer, notice the question you are actually asking. You came seeking clarity about ${t.label.toLowerCase()}, but the sharper question may be why this one will not leave you alone. A question that returns is rarely idle; it is a summons. Consider what would change in your life if you already trusted the answer you suspect is true, and simply began to live as though you did not need permission.`,
  contemplative: (t) =>
    `Sit with this slowly. Do not rush toward a conclusion about ${t.label.toLowerCase()}; let the words settle like sediment and see what remains clear. The contemplative path does not demand resolution, only attention. Let one phrase stay with you longer than the others - that phrase is likely where grace is already at work, quietly, beneath the noise of your own thinking.`,
  thomistic: (t) =>
    `Let us proceed as the schoolmen did. First, state the matter plainly: ${t.label} is not a mood but a question with a shape, and it can be distinguished from the worries that merely resemble it. Then weigh the objections as honestly as the affirmations, granting each its strongest form. What is true will survive the examination; what collapses under scrutiny was opinion, not knowledge. Reason here is not the enemy of faith but its servant, clearing the ground so that trust has somewhere to stand.`,
  wisdom: (t) =>
    `The sages of old observed ${t.label.toLowerCase()} long before our own age and left their findings in plain language. They were suspicious of haste and fond of observation, convinced that a life is understood by its fruit rather than its intentions. Their counsel is not a formula but a lens: look at the pattern, not the moment; at the tree, not the single leaf. What the ancients learned by watching, you can now test by living.`,
  prophetic: (t) =>
    `The prophets did not flatter and did not console cheaply. Speaking of ${t.label.toLowerCase()}, they measured the present against the justice of God and found the gap impossible to ignore. The prophetic voice is not a mood of anger but a form of love that refuses to look away from what is being done to the vulnerable. Ask not only what is true of you, but what is owed to your neighbor, and to the stranger whose name you do not yet know.`,
  logos: (t) =>
    `Reason and revelation are not strangers here. To think about ${t.label.toLowerCase()} is to stand where two rivers meet: the river of inquiry, which since the Greeks has asked what is real, and the river of the Word, which answers that the real is personal and speaks. The task is neither to dissolve mystery into logic nor to abandon logic before mystery, but to let each deepen the other. Meaning is not imposed on the world; it is found in it, the way a word is found already waiting in the mouth.`,
}

const LENS_REFLECTIONS: Record<GuidanceLens, string[]> = {
  socratic: [
    "What would you lose if you stopped defending your current answer?",
    "Which part of this question are you avoiding, and why?",
  ],
  contemplative: [
    "Which single phrase refuses to leave you, and what does it ask?",
    "Where in your body do you feel the weight of this question?",
  ],
  thomistic: [
    "What is the strongest objection to the answer you prefer?",
    "Which distinction, if granted, would change your conclusion?",
  ],
  wisdom: [
    "What fruit has this pattern produced over the last year?",
    "What would patience look like here, measured in months not minutes?",
  ],
  prophetic: [
    "Whose voice is missing from how you have framed this?",
    "What would love require of you that comfort does not?",
  ],
  logos: [
    "What must be true for your question even to be intelligible?",
    "Where does your reasoning end and something received begin?",
  ],
}

function pickTheme(query: string): Theme {
  const q = query.toLowerCase()
  let best: Theme | null = null
  let bestScore = 0
  for (const theme of THEMES) {
    let score = 0
    for (const kw of theme.keywords) if (q.includes(kw)) score += kw.length
    if (score > bestScore) {
      bestScore = score
      best = theme
    }
  }
  return best ?? THEMES.find((t) => t.key === "general") ?? THEMES[0]
}

function buildReflectionQuestions(theme: Theme, lens: GuidanceLens): string[] {
  const out = [...theme.followUps]
  for (const q of LENS_REFLECTIONS[lens]) {
    if (out.length >= 3) break
    if (!out.includes(q)) out.push(q)
  }
  return out.slice(0, 3)
}

const REFLECTION_OPENERS = [
  "This morning, before the day asks anything of you, let the text meet you where you are.",
  "Take a slow breath. You do not need to arrive anywhere; you only need to be here.",
  "Read this once aloud if you can. Let the sound of it slow your reading and open your attention.",
  "Set down what you were carrying before this moment. The day can wait a few minutes.",
]

function makeId(): string {
  return `g-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

export function generateGuidance({ mode, lens, query }: GuidanceRequest): GuidanceResponse {
  const theme = pickTheme(query)
  const isReflection = mode === "reflection"
  const opener = isReflection
    ? REFLECTION_OPENERS[Math.floor(Math.random() * REFLECTION_OPENERS.length)]
    : ""
  const thesis = `${opener ? opener + " " : ""}${LENS_FRAMES[lens](theme)}

${theme.core}`
  const anchors = isReflection ? theme.anchors.slice(0, 2) : theme.anchors
  return {
    id: makeId(),
    mode,
    lens,
    query,
    title: theme.title,
    themeLabel: theme.label,
    thesis,
    scriptureAnchors: anchors,
    dialectic: theme.interpretation,
    reflectionQuestions: buildReflectionQuestions(theme, lens),
    virtues: theme.applications,
    contemplativePrompt: theme.contemplative,
    followUps: theme.followUps,
    source: "offline",
    createdAt: Date.now(),
  }
}

export const PROMPT_STARTERS: string[] = [
  "If God is good, why does suffering fall on the innocent?",
  "What does it mean to love someone who has hurt me?",
  "Can I be moral without believing in God?",
  "How do I find purpose when my work feels meaningless?",
  "Is it ever right to lie to protect someone?",
  "What does it mean to forgive a wrong that was never apologised for?",
]

export const TOPIC_SUGGESTIONS: string[] = [
  "Faith and reason",
  "Suffering and joy",
  "Justice and mercy",
  "Anxiety and peace",
  "Vocation and purpose",
  "Wealth and contentment",
  "Love and neighbor",
  "Mortality and hope",
]

export function getDailyThemeLabel(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  )
  const pool = THEMES.filter((t) => t.key !== "general")
  return pool[dayOfYear % pool.length].label
}

export function formatGuidanceAsText(r: GuidanceResponse): string {
  const lines: string[] = [
    `${r.title} (${r.themeLabel})`,
    "",
    "Thesis",
    r.thesis,
    "",
    "Scriptural Foundations",
  ]
  r.scriptureAnchors.forEach((s) => lines.push(`- "${s.verse}" - ${s.reference}`))
  lines.push("", "Philosophical Dissection", r.dialectic, "", "Reflection Prompts")
  r.reflectionQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`))
  lines.push("", "Practical Virtue")
  r.virtues.forEach((step) => lines.push(`- ${step}`))
  lines.push("", "Contemplative Prompt", r.contemplativePrompt)
  return lines.join(String.fromCharCode(10))
}

/* ---------- OpenAI configuration ---------- */

export const OPENAI_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"]
const CONFIG_KEY = "dw-openai-config"

export function loadOpenAIConfig(): OpenAIConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return { apiKey: "", model: OPENAI_MODELS[0], temperature: 0.7 }
    const parsed = JSON.parse(raw) as Partial<OpenAIConfig>
    return {
      apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "",
      model:
        typeof parsed.model === "string" && OPENAI_MODELS.includes(parsed.model)
          ? parsed.model
          : OPENAI_MODELS[0],
      temperature: typeof parsed.temperature === "number" ? parsed.temperature : 0.7,
    }
  } catch {
    return { apiKey: "", model: OPENAI_MODELS[0], temperature: 0.7 }
  }
}

export function saveOpenAIConfig(config: OpenAIConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function clearOpenAIConfig(): void {
  localStorage.removeItem(CONFIG_KEY)
}

export function hasApiKey(): boolean {
  return loadOpenAIConfig().apiKey.trim().length > 0
}

const SYSTEM_PROMPT = `You are a philosophical and theological reasoning companion in the tradition of Christian wisdom: the Socratic method, Thomistic reasoning, the wisdom literature, the Hebrew prophets, and the theology of the Logos. Answer the seeker with seriousness and intellectual honesty, never with empty consolation.

Respond ONLY with a JSON object using exactly these keys:
- "title": a short evocative title (max 6 words)
- "themeLabel": a short theme category (2-4 words)
- "thesis": a 2 paragraph core synthesis that states the central philosophical answer plainly
- "scriptureAnchors": an array of 2-3 objects, each with "verse" (the quotation), "reference" (e.g. "Romans 5:3-4"), "book" (e.g. "Romans"), and "insight" (one sentence of exegesis)
- "dialectic": a 1-2 paragraph philosophical dissection that distinguishes the question from nearby confusions and weighs counterarguments
- "reflectionQuestions": an array of exactly 3 probing questions the seeker should sit with
- "virtues": an array of 3 concrete, actionable practices framed as virtues
- "contemplativePrompt": one sentence of contemplative guidance
- "followUps": an array of 2 related questions to continue the inquiry

Do not include markdown, code fences, or any text outside the JSON object.`

interface RawGuidance {
  title?: string
  themeLabel?: string
  thesis?: string
  scriptureAnchors?: Partial<ScriptureAnchor>[]
  dialectic?: string
  reflectionQuestions?: string[]
  virtues?: string[]
  contemplativePrompt?: string
  followUps?: string[]
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []
}

async function callOpenAI(req: GuidanceRequest, config: OpenAIConfig): Promise<GuidanceResponse> {
  const theme = pickTheme(req.query)
  const lensLabel = LENSES.find((l) => l.key === req.lens)?.label ?? req.lens
  const userPrompt = `Mode: ${req.mode}. Interpretive lens: ${lensLabel}. Seeker's question or theme: "${req.query}".`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: config.temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    let detail = `OpenAI request failed (${res.status})`
    try {
      const err = (await res.json()) as { error?: { message?: string } }
      if (err?.error?.message) detail = err.error.message
    } catch {
      /* keep default detail */
    }
    throw new Error(detail)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenAI returned an empty response.")
  }

  let parsed: RawGuidance
  try {
    parsed = JSON.parse(content) as RawGuidance
  } catch {
    throw new Error("OpenAI returned a response that was not valid JSON.")
  }

  const anchors: ScriptureAnchor[] =
    Array.isArray(parsed.scriptureAnchors) && parsed.scriptureAnchors.length
      ? parsed.scriptureAnchors.map((s) => ({
          verse: String(s.verse ?? ""),
          reference: String(s.reference ?? ""),
          book: String(s.book ?? ""),
          insight: String(s.insight ?? ""),
        }))
      : theme.anchors

  const reflectionQuestions = asStringArray(parsed.reflectionQuestions)
  const virtues = asStringArray(parsed.virtues)
  const followUps = asStringArray(parsed.followUps)

  return {
    id: makeId(),
    mode: req.mode,
    lens: req.lens,
    query: req.query,
    title: parsed.title?.trim() || theme.title,
    themeLabel: parsed.themeLabel?.trim() || theme.label,
    thesis:
      parsed.thesis?.trim() ||
      LENS_FRAMES[req.lens](theme) + String.fromCharCode(10, 10) + theme.core,
    scriptureAnchors: anchors,
    dialectic: parsed.dialectic?.trim() || theme.interpretation,
    reflectionQuestions: reflectionQuestions.length
      ? reflectionQuestions.slice(0, 3)
      : buildReflectionQuestions(theme, req.lens),
    virtues: virtues.length ? virtues : theme.applications,
    contemplativePrompt: parsed.contemplativePrompt?.trim() || theme.contemplative,
    followUps: followUps.length ? followUps : theme.followUps,
    source: "openai",
    createdAt: Date.now(),
  }
}

export interface GuidanceResult {
  response: GuidanceResponse
  source: GuidanceSource
  warning?: string
}

export async function generateGuidanceAsync(
  req: GuidanceRequest,
  config: OpenAIConfig,
): Promise<GuidanceResult> {
  if (config.apiKey.trim()) {
    try {
      const response = await callOpenAI(req, config)
      return { response, source: "openai" }
    } catch (e) {
      const message = e instanceof Error ? e.message : "OpenAI request failed."
      return { response: generateGuidance(req), source: "offline", warning: message }
    }
  }
  return { response: generateGuidance(req), source: "offline" }
}

/* ---------- Journal persistence (localStorage) ---------- */

export const JOURNAL_STORAGE_KEY = "dw-guidance-journal"

export function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as JournalEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveJournalEntry(r: GuidanceResponse): JournalEntry[] {
  const current = loadJournal()
  if (current.some((e) => e.id === r.id)) return current
  const entry: JournalEntry = { ...r, journalId: r.id, savedAt: Date.now() }
  const next = [entry, ...current]
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  const next = loadJournal().filter((e) => e.id !== id && e.journalId !== id)
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearJournal(): void {
  localStorage.removeItem(JOURNAL_STORAGE_KEY)
}

export function isSaved(id: string): boolean {
  return loadJournal().some((e) => e.id === id)
}