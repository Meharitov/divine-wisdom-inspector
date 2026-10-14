import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Sparkle,
  MagicWand,
  Compass,
  PaperPlaneTilt,
  ArrowClockwise,
  Brain,
  Lightbulb,
  Feather,
  NotePencil,
  ClockCounterClockwise,
  Scales,
  Flame,
  Plugs,
} from "@phosphor-icons/react"
import {
  generateGuidanceAsync,
  LENSES,
  PROMPT_STARTERS,
  TOPIC_SUGGESTIONS,
  getDailyThemeLabel,
  formatGuidanceAsText,
  saveJournalEntry,
  isSaved,
  loadOpenAIConfig,
} from "@/lib/aiGuidanceEngine"
import type { GuidanceLens, GuidanceMode, GuidanceResponse } from "@/types/aiGuidance"
import GuidanceResponseView from "@/components/GuidanceResponseView"

type Phase = "idle" | "thinking" | "streaming" | "done"

const LENS_ICON: Record<GuidanceLens, React.ReactNode> = {
  socratic: <Brain size={18} weight="duotone" />,
  contemplative: <Feather size={18} weight="duotone" />,
  thomistic: <Scales size={18} weight="duotone" />,
  wisdom: <Lightbulb size={18} weight="duotone" />,
  prophetic: <Flame size={18} weight="duotone" />,
  logos: <Compass size={18} weight="duotone" />,
}

const MODES: { key: GuidanceMode; label: string; icon: React.ReactNode }[] = [
  { key: "question", label: "Ask a Question", icon: <Sparkle size={16} weight="duotone" /> },
  { key: "topic", label: "Explore a Topic", icon: <Compass size={16} weight="duotone" /> },
  { key: "reflection", label: "Daily Reflection", icon: <Feather size={16} weight="duotone" /> },
]

interface Seed {
  id: number
  query: string
  mode: GuidanceMode
}

interface Props {
  seed?: Seed | null
  onOpenHistory: () => void
  onOpenSettings: () => void
  openaiEnabled: boolean
}

export default function AIGuidanceOracle({
  seed,
  onOpenHistory,
  onOpenSettings,
  openaiEnabled,
}: Props) {
  const [mode, setMode] = useState<GuidanceMode>("question")
  const [lens, setLens] = useState<GuidanceLens>("socratic")
  const [query, setQuery] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [response, setResponse] = useState<GuidanceResponse | null>(null)
  const [revealed, setRevealed] = useState("")
  const [saved, setSaved] = useState(false)

  const run = async (raw: string, modeOverride?: GuidanceMode) => {
    const q = raw.trim()
    if (!q) {
      toast.error("Write a question or choose a topic to begin.")
      return
    }
    setPhase("thinking")
    setResponse(null)
    setRevealed("")
    const effectiveMode = modeOverride ?? mode
    const config = loadOpenAIConfig()

    const started = Date.now()
    const result = await generateGuidanceAsync({ mode: effectiveMode, lens, query: q }, config)
    const elapsed = Date.now() - started
    if (elapsed < 620) await new Promise((r) => window.setTimeout(r, 620 - elapsed))

    setResponse(result.response)
    setSaved(isSaved(result.response.id))
    setPhase("streaming")
    if (result.warning) {
      toast.error(`OpenAI unavailable, used the offline library: ${result.warning}`)
    } else if (result.source === "openai") {
      toast.success("Answered with OpenAI")
    }
  }

  useEffect(() => {
    if (!seed) return
    setMode(seed.mode)
    setQuery(seed.query)
    void run(seed.query, seed.mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.id])

  useEffect(() => {
    if (!response || phase !== "streaming") return
    const tokens = response.thesis.split(/(\s+)/)
    let i = 0
    const timer = window.setInterval(() => {
      i += 2
      setRevealed(tokens.slice(0, i).join(""))
      if (i >= tokens.length) {
        window.clearInterval(timer)
        setPhase("done")
      }
    }, 22)
    return () => window.clearInterval(timer)
  }, [response, phase])

  const handleCopy = async () => {
    if (!response) return
    try {
      await navigator.clipboard.writeText(formatGuidanceAsText(response))
      toast.success("Guidance copied to clipboard")
    } catch {
      toast.error("Could not copy to clipboard")
    }
  }

  const handleSave = () => {
    if (!response || saved) return
    saveJournalEntry(response)
    setSaved(true)
    toast.success("Saved to your journal")
  }

  const chooseTopic = (topic: string) => {
    setMode("topic")
    setQuery(topic)
    void run(topic, "topic")
  }

  const askFollowUp = (q: string) => {
    setMode("question")
    setQuery(q)
    void run(q, "question")
  }

  return (
    <section
      id="guidance"
      className="relative border-t border-stone-200/80 bg-stone-50 pt-24 pb-20 text-stone-800 md:pt-28 dark:border-stone-800/80 dark:bg-stone-950 dark:text-stone-200"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-1 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
            <Sparkle size={14} weight="fill" />
            AI Guidance Oracle
          </span>
          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl dark:text-stone-50">
            Seek Wisdom Grounded in Scripture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600 dark:text-stone-400">
            Pose a question, explore a theme, or receive a daily reflection. Each response weaves a
            philosophical thesis with scriptural foundations, a dialectic, and a practice to live
            out.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-white/60 px-4 py-3 text-sm dark:border-stone-800/80 dark:bg-stone-900/40">
          <span className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <span
              className={`h-2 w-2 rounded-full ${
                openaiEnabled ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {openaiEnabled
              ? "Live OpenAI reasoning is active."
              : "Using the built-in offline wisdom library."}
          </span>
          {!openaiEnabled && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 rounded-lg border border-amber-600/40 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/10 dark:text-amber-400"
            >
              <Plugs size={14} weight="duotone" />
              Connect OpenAI
            </button>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white/70 p-5 shadow-sm backdrop-blur md:p-6 dark:border-stone-800/80 dark:bg-stone-900/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800/60">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    mode === m.key
                      ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-50"
                      : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-amber-600/40 hover:text-amber-700 dark:border-stone-700 dark:text-stone-300 dark:hover:text-amber-400"
            >
              <ClockCounterClockwise size={16} weight="duotone" />
              Journal
            </button>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
              Interpretive Lens
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LENSES.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLens(l.key)}
                  title={l.description}
                  className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-3 text-left transition-all ${
                    lens === l.key
                      ? "border-amber-600/50 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                      : "border-stone-200 text-stone-600 hover:border-stone-300 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {LENS_ICON[l.key]}
                    {l.label}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-500">{l.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            {mode === "question" && (
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void run(query)
                }}
                rows={3}
                placeholder="What is weighing on your heart today?"
                className="w-full resize-none rounded-xl border border-stone-200 bg-white/80 p-4 text-stone-800 outline-none placeholder:text-stone-400 focus:border-amber-600/60 focus:ring-2 focus:ring-amber-600/20 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
            )}

            {mode === "topic" && (
              <div className="flex flex-wrap gap-2">
                {TOPIC_SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => chooseTopic(t)}
                    className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-amber-600/50 hover:bg-amber-500/5 hover:text-amber-700 dark:border-stone-800 dark:text-stone-300 dark:hover:text-amber-400"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {mode === "reflection" && (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900/40">
                <div>
                  <p className="font-serif text-lg text-stone-800 dark:text-stone-100">
                    Today&apos;s theme: {getDailyThemeLabel()}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Receive a passage, an interpretation, and a practice for the day.
                  </p>
                </div>
                <button
                  onClick={() => void run(getDailyThemeLabel(), "reflection")}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  <MagicWand size={16} weight="duotone" />
                  Receive Reflection
                </button>
              </div>
            )}
          </div>

          {mode === "question" && (
            <>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => void run(query)}
                  className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                  Seek Guidance
                </button>
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  Press Ctrl/Cmd + Enter to seek
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROMPT_STARTERS.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setQuery(p)
                      void run(p, "question")
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-500 transition-colors hover:border-amber-600/40 hover:text-amber-700 dark:border-stone-800 dark:text-stone-400 dark:hover:text-amber-400"
                  >
                    <NotePencil size={13} weight="duotone" />
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {phase === "thinking" && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 space-y-3 rounded-2xl border border-stone-200/80 bg-white/60 p-6 dark:border-stone-800/80 dark:bg-stone-900/40"
            >
              <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                <ArrowClockwise size={18} className="animate-spin" weight="duotone" />
                <span className="text-sm font-medium">
                  {openaiEnabled ? "Reasoning with OpenAI…" : "Searching the scriptures…"}
                </span>
              </div>
              <div className="h-3 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </motion.div>
          )}

          {response && phase !== "thinking" && (
            <GuidanceResponseView
              response={response}
              revealed={revealed}
              streaming={phase === "streaming"}
              saved={saved}
              onCopy={handleCopy}
              onSave={handleSave}
              onFollowUp={askFollowUp}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}