import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, GithubLogo, BookOpen, Heart, Clock } from "@phosphor-icons/react"
import type { TopicKey } from "@/types"
import { TOPICS, REPO_META, getPassagesByTopic } from "@/data/wisdomContent"

interface TopicBentoProps {
  onSelectTopic: (topic: TopicKey) => void
}

const TOPIC_ICONS: Record<TopicKey, React.ReactNode> = {
  faith: <BookOpen className="h-5 w-5" weight="duotone" />,
  purpose: <Heart className="h-5 w-5" weight="duotone" />,
  resilience: <Clock className="h-5 w-5" weight="duotone" />,
  calm: <BookOpen className="h-5 w-5" weight="duotone" />,
  justice: <Heart className="h-5 w-5" weight="duotone" />,
  hope: <Clock className="h-5 w-5" weight="duotone" />,
}

const TOPIC_COLORS: Record<TopicKey, string> = {
  faith: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
  purpose: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20",
  resilience: "from-stone-50 to-zinc-50 dark:from-stone-900 dark:to-zinc-900",
  calm: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20",
  justice: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
  hope: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20",
}

export default function TopicBento({ onSelectTopic }: TopicBentoProps) {
  const [repoOpen, setRepoOpen] = useState(false)

  return (
    <section id="topics" className="scroll-mt-20 mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">Topics &amp; Archive</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Explore wisdom by theme</p>
        </div>
        <button
          id="source"
          onClick={() => setRepoOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-900"
        >
          <GithubLogo className="h-3.5 w-3.5" />
          Source &amp; Architecture
        </button>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t, i) => {
          const sample = getPassagesByTopic(t.key)[0]
          return (
            <motion.button
              key={t.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => onSelectTopic(t.key)}
              className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br p-5 text-left transition-all hover:shadow-lg hover:shadow-stone-200/50 dark:border-stone-800 dark:hover:shadow-stone-900/50 ${TOPIC_COLORS[t.key]} ${
                i === 0 ? "sm:col-span-2 lg:row-span-2 sm:p-8" : ""
              }`}
            >
              <div className={`mb-3 text-stone-400 transition-colors group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-300 ${i === 0 ? "h-7 w-7" : "h-5 w-5"}`}>
                {TOPIC_ICONS[t.key]}
              </div>
              <h3 className={`font-serif font-semibold text-stone-900 dark:text-stone-100 ${i === 0 ? "text-2xl" : "text-base"}`}>
                {t.label}
              </h3>
              <p className={`mt-1.5 leading-relaxed text-stone-500 dark:text-stone-400 ${i === 0 ? "text-sm max-w-[40ch]" : "text-xs"}`}>
                {t.description}
              </p>
              {i === 0 && sample && (
                <blockquote className="mt-6 border-l-2 border-stone-200 pl-4 text-sm italic text-stone-500 dark:border-stone-700 dark:text-stone-400">
                  "{sample.scripture}"
                  <cite className="mt-1 block text-xs not-italic text-stone-400">{sample.reference}</cite>
                </blockquote>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500">
                <span className="rounded-full bg-white/60 px-2 py-0.5 font-medium dark:bg-stone-900/60">
                  {t.passageCount} passages
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Repo modal */}
      <AnimatePresence>
        {repoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm"
            onClick={() => setRepoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
            >
              <button
                onClick={() => setRepoOpen(false)}
                className="absolute top-4 right-4 rounded-lg p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4 flex items-center gap-2">
                <GithubLogo className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                <h3 className="font-mono text-sm font-semibold text-stone-900 dark:text-stone-100">{REPO_META.name}</h3>
              </div>

              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{REPO_META.description}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                  {REPO_META.language}
                </span>
                <span>{REPO_META.license}</span>
                <span>{REPO_META.stars.toLocaleString()} stars</span>
              </div>

              <a
                href={REPO_META.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
              >
                <GithubLogo className="h-4 w-4" />
                View on GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
