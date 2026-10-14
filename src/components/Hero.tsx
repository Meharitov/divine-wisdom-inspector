import { useState } from "react"
import { motion } from "framer-motion"
import { MagnifyingGlass, Sparkle } from "@phosphor-icons/react"
import { TOPICS } from "@/data/wisdomContent"

interface HeroProps {
  onSearch: (query: string) => void
  onSelectTopic: (topic: string) => void
}

const PROMPT_CHIPS = [
  "What gives life meaning?",
  "How do I find peace?",
  "When should I speak up?",
  "How do I endure hardship?",
]

export default function Hero({ onSearch, onSelectTopic }: HeroProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-5 pt-14 sm:px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-100/30 blur-3xl dark:bg-amber-900/8" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/70 px-4 py-1.5 text-xs font-medium text-stone-500 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-400">
            <Sparkle weight="fill" className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            Divine Wisdom, Modern Clarity
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl md:text-[3.5rem] dark:text-stone-50"
        >
          Wisdom for the
          <br />
          <span className="text-amber-700 dark:text-amber-400">questions you carry</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone-500 dark:text-stone-400"
        >
          Explore philosophical and scriptural wisdom across faith, purpose, resilience, and hope.
        </motion.p>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-sm"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-amber-300 focus-within:shadow-amber-100/40 dark:border-stone-800 dark:bg-stone-900 dark:focus-within:border-amber-700 dark:focus-within:shadow-amber-900/20">
            <MagnifyingGlass className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-stone-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Explore
            </button>
          </div>
        </motion.form>

        {/* Prompt chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-5 flex flex-wrap justify-center gap-2"
        >
          {PROMPT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onSearch(chip)}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-500 transition-colors hover:border-amber-300 hover:text-amber-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-amber-700 dark:hover:text-amber-400"
            >
              {chip}
            </button>
          ))}
        </motion.div>

        {/* Topic links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          {TOPICS.map((t) => (
            <button
              key={t.key}
              onClick={() => onSelectTopic(t.key)}
              className="group flex items-center gap-1.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-800 dark:text-stone-500 dark:hover:text-stone-200"
            >
              <span className="inline-block h-1 w-1 rounded-full bg-stone-300 transition-colors group-hover:bg-amber-500 dark:bg-stone-700 dark:group-hover:bg-amber-400" />
              {t.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
