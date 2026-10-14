import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, ShareNetwork, BookmarkSimple, Quotes, Check, X } from "@phosphor-icons/react"
import { toast } from "sonner"
import type { TopicKey, WisdomPassage, DailyReflection } from "@/types"
import { TOPICS, PASSAGES, getPassagesByTopic, searchPassages, getDailyReflection } from "@/data/wisdomContent"

interface WisdomReaderProps {
  searchQuery: string
  selectedTopic: TopicKey | null
  onSelectTopic: (topic: TopicKey | null) => void
}

function useBookmarks() {
  const [ids, setIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("dw-bookmarks")
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch { return new Set() }
  })
  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); toast.success("Bookmark removed") }
      else { next.add(id); toast.success("Bookmarked") }
      localStorage.setItem("dw-bookmarks", JSON.stringify([...next]))
      return next
    })
  }, [])
  return { ids, toggle }
}

export default function WisdomReader({ searchQuery, selectedTopic, onSelectTopic }: WisdomReaderProps) {
  const [activeTab, setActiveTab] = useState<TopicKey | "all">("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const bookmarks = useBookmarks()
  const daily = getDailyReflection()

  useEffect(() => {
    if (selectedTopic) setActiveTab(selectedTopic)
  }, [selectedTopic])

  const passages: WisdomPassage[] = searchQuery
    ? searchPassages(searchQuery)
    : activeTab === "all"
      ? PASSAGES
      : getPassagesByTopic(activeTab as TopicKey)

  const handleCopy = async (p: WisdomPassage) => {
    const text = `${p.scripture}
${p.reference}

${p.answer}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleShare = async (p: WisdomPassage) => {
    const text = `"${p.scripture}" - ${p.reference}`
    if (navigator.share) {
      try { await navigator.share({ title: p.title, text }) } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        toast.success("Verse copied for sharing")
      } catch { toast.error("Failed to share") }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      {/* Daily Reflection - clean card */}
      <section id="reflection" className="scroll-mt-20 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-stone-200/70 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="mb-3 flex items-center gap-2">
            <Quotes className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Today's Reflection
            </span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">{daily.title}</h3>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-stone-600 dark:text-stone-400">{daily.passage}</p>
          <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">{daily.reference}</p>
          <div className="mt-5 border-t border-stone-100 pt-4 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium text-stone-700 dark:text-stone-300">Journal prompt: </span>
              {daily.journalPrompt}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Wisdom Explorer */}
      <section id="explore" className="scroll-mt-20 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Wisdom Explorer
          </h2>

          {/* Topic tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveTab("all"); onSelectTopic(null) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                  : "border border-stone-200 text-stone-500 hover:bg-stone-100 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-900"
              }`}
            >
              All
            </button>
            {TOPICS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); onSelectTopic(t.key) }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "border border-stone-200 text-stone-500 hover:bg-stone-100 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search indicator */}
          {searchQuery && (
            <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">
              Results for "<span className="font-medium text-stone-800 dark:text-stone-200">{searchQuery}</span>"
              <button onClick={() => onSelectTopic(null)} className="ml-2 text-xs text-amber-600 hover:underline dark:text-amber-400">Clear</button>
            </p>
          )}

          {/* Passages grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {passages.map((p, i) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="group rounded-2xl border border-stone-200/70 bg-white p-5 transition-all hover:shadow-sm dark:border-stone-800 dark:bg-stone-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium capitalize text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                      {p.topic}
                    </span>
                    <button
                      onClick={() => bookmarks.toggle(p.id)}
                      className="rounded-lg p-1.5 text-stone-300 transition-colors hover:text-amber-600 dark:text-stone-600 dark:hover:text-amber-400"
                      aria-label="Bookmark"
                    >
                      {bookmarks.ids.has(p.id)
                        ? <BookmarkSimple weight="fill" className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        : <BookmarkSimple className="h-4 w-4" />}
                    </button>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {expandedId === p.id ? p.answer : `${p.answer.slice(0, 100)}...`}
                  </p>

                  {expandedId !== p.id && (
                    <button
                      onClick={() => setExpandedId(p.id)}
                      className="mt-2 text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Read more
                    </button>
                  )}

                  <blockquote className="mt-4 border-l-2 border-amber-200 pl-3 text-sm italic text-stone-500 dark:border-amber-800 dark:text-stone-400">
                    "{p.scripture}"
                    <cite className="mt-1 block text-xs not-italic text-stone-400 dark:text-stone-500">{p.reference}</cite>
                  </blockquote>

                  {expandedId === p.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 rounded-xl bg-stone-50 p-3 text-sm text-stone-600 dark:bg-stone-800/50 dark:text-stone-400"
                    >
                      <span className="font-medium text-stone-700 dark:text-stone-300">For you: </span>
                      {p.reflection}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
                    <button
                      onClick={() => handleCopy(p)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                    <button
                      onClick={() => handleShare(p)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
                    >
                      <ShareNetwork className="h-3.5 w-3.5" /> Share
                    </button>
                    {expandedId === p.id && (
                      <button
                        onClick={() => setExpandedId(null)}
                        className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300"
                      >
                        <X className="h-3.5 w-3.5" /> Close
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {passages.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-stone-400 dark:text-stone-500">No passages found. Try a different topic or search term.</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
