import { motion, AnimatePresence } from "framer-motion"
import {
  Quotes,
  Copy,
  BookmarkSimple,
  Check,
  CaretRight,
  Brain,
  Feather,
} from "@phosphor-icons/react"
import type { GuidanceResponse } from "@/types/aiGuidance"

interface Props {
  response: GuidanceResponse
  revealed: string
  streaming: boolean
  saved: boolean
  onCopy: () => void
  onSave: () => void
  onFollowUp: (q: string) => void
}

export default function GuidanceResponseView({
  response,
  revealed,
  streaming,
  saved,
  onCopy,
  onSave,
  onFollowUp,
}: Props) {
  return (
    <motion.article
      key={response.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 rounded-2xl border border-stone-200/80 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8 dark:border-stone-800/80 dark:bg-stone-900/50"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
              {response.themeLabel}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                response.source === "openai"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-stone-200/70 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
              }`}
            >
              {response.source === "openai" ? "OpenAI" : "Offline"}
            </span>
          </div>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {response.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            title="Copy guidance"
            className="rounded-lg border border-stone-200 p-2 text-stone-500 transition-colors hover:text-amber-700 dark:border-stone-800 dark:text-stone-400 dark:hover:text-amber-400"
          >
            <Copy size={16} weight="duotone" />
          </button>
          <button
            onClick={onSave}
            title="Save to journal"
            className={`rounded-lg border p-2 transition-colors ${
              saved
                ? "border-amber-600/50 text-amber-600"
                : "border-stone-200 text-stone-500 hover:text-amber-700 dark:border-stone-800 dark:text-stone-400 dark:hover:text-amber-400"
            }`}
          >
            <BookmarkSimple size={16} weight={saved ? "fill" : "duotone"} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
          Core Philosophical Synthesis
        </p>
        <p className="whitespace-pre-line text-lg leading-relaxed text-stone-700 dark:text-stone-200">
          {revealed}
          {streaming && (
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-amber-600 align-middle" />
          )}
        </p>
      </div>

      <AnimatePresence>
        {!streaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                Scriptural Foundations
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {response.scriptureAnchors.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-amber-600/15 bg-amber-500/5 p-4"
                  >
                    <Quotes size={16} weight="fill" className="text-amber-600/70" />
                    <p className="mt-2 font-serif text-sm leading-relaxed text-stone-800 italic dark:text-stone-200">
                      &ldquo;{s.verse}&rdquo;
                    </p>
                    <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {s.reference}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{s.insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border-l-2 border-amber-600/50 bg-stone-50 py-4 pl-5 dark:bg-stone-900/40">
              <p className="mb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                Philosophical Dissection &amp; Dialectic
              </p>
              <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                {response.dialectic}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                <Brain size={14} weight="duotone" className="text-amber-600" />
                Contemplative Reflection Prompts
              </p>
              <ul className="space-y-2.5">
                {response.reflectionQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-stone-200/70 bg-white/50 p-3 text-stone-700 dark:border-stone-800/70 dark:bg-stone-900/30 dark:text-stone-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600/15 text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {i + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                <Check size={14} weight="bold" className="text-amber-600" />
                Practical Virtue &amp; Action
              </p>
              <ul className="space-y-2.5">
                {response.virtues.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-stone-200/70 bg-white/50 p-3 text-stone-700 dark:border-stone-800/70 dark:bg-stone-900/30 dark:text-stone-300"
                  >
                    <CaretRight size={14} weight="bold" className="mt-1 shrink-0 text-amber-600" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-stone-200/80 bg-gradient-to-br from-stone-50 to-amber-500/5 p-5 dark:border-stone-800/80 dark:from-stone-900/50 dark:to-amber-500/5">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                <Feather size={14} weight="duotone" className="text-amber-600" />
                Contemplative Prompt
              </p>
              <p className="font-serif text-lg text-stone-800 dark:text-stone-100">
                {response.contemplativePrompt}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                Continue the inquiry
              </p>
              <div className="flex flex-wrap gap-2">
                {response.followUps.map((f) => (
                  <button
                    key={f}
                    onClick={() => onFollowUp(f)}
                    className="flex items-center gap-1.5 rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-amber-600/50 hover:bg-amber-500/5 hover:text-amber-700 dark:border-stone-800 dark:text-stone-300 dark:hover:text-amber-400"
                  >
                    {f}
                    <CaretRight size={13} weight="bold" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}