import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  X,
  MagnifyingGlass,
  Trash,
  DownloadSimple,
  ClockCounterClockwise,
  BookmarkSimple,
  Quotes,
} from "@phosphor-icons/react"
import {
  loadJournal,
  deleteJournalEntry,
  clearJournal,
  formatGuidanceAsText,
} from "@/lib/aiGuidanceEngine"
import type { JournalEntry } from "@/types/aiGuidance"

interface Props {
  open: boolean
  onClose: () => void
}

export default function GuidanceHistory({ open, onClose }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setEntries(loadJournal())
      setExpanded(null)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.themeLabel.toLowerCase().includes(q) ||
                 e.query.toLowerCase().includes(q) ||
         e.thesis.toLowerCase().includes(q),
    )
  }, [entries, search])

  const handleDelete = (id: string) => {
    setEntries(deleteJournalEntry(id))
    toast.success("Removed from journal")
  }

  const handleClear = () => {
    if (entries.length === 0) return
    if (!window.confirm("Remove all saved guidance from your journal?")) return
    clearJournal()
    setEntries([])
    toast.success("Journal cleared")
  }

  const handleExport = () => {
    if (entries.length === 0) {
      toast.error("There is nothing to export yet.")
      return
    }
    const NL = String.fromCharCode(10)
    const body = entries
      .map((e) => formatGuidanceAsText(e) + NL + NL + "Saved " + new Date(e.savedAt).toLocaleString())
      .join(NL + NL + "---" + NL + NL)
    const blob = new Blob([`# Guidance Journal

${body}
`], {
      type: "text/markdown;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "guidance-journal.md"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Journal exported")
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-stone-200/80 bg-stone-50 text-stone-800 shadow-xl dark:border-stone-800/80 dark:bg-stone-950 dark:text-stone-200"
          >
            <header className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4 dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                <ClockCounterClockwise size={20} weight="duotone" className="text-amber-600" />
                <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50">
                  Guidance Journal
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close journal"
                className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <X size={18} weight="bold" />
              </button>
            </header>

            <div className="border-b border-stone-200/80 px-5 py-3 dark:border-stone-800/80">
              <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white/70 px-3 py-2 dark:border-stone-800 dark:bg-stone-900/60">
                <MagnifyingGlass size={16} className="text-stone-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your saved guidance"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400 dark:placeholder:text-stone-500"
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:text-amber-700 dark:border-stone-800 dark:text-stone-300 dark:hover:text-amber-400"
                >
                  <DownloadSimple size={14} weight="duotone" />
                  Export
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:text-red-600 dark:border-stone-800 dark:text-stone-300"
                >
                  <Trash size={14} weight="duotone" />
                  Clear all
                </button>
                <span className="ml-auto text-xs text-stone-400 dark:text-stone-500">
                  {entries.length} saved
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filtered.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <BookmarkSimple size={36} weight="duotone" className="text-stone-300 dark:text-stone-700" />
                  <p className="mt-3 font-serif text-lg text-stone-600 dark:text-stone-300">
                    {entries.length === 0 ? "Your journal is empty" : "No matching entries"}
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-stone-500 dark:text-stone-400">
                    {entries.length === 0
                      ? "Save guidance from the oracle and it will gather here for reflection."
                      : "Try a different word or clear the search."}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((entry) => {
                    const isOpen = expanded === entry.id
                    return (
                      <li
                        key={entry.id}
                        className="overflow-hidden rounded-xl border border-stone-200/80 bg-white/70 dark:border-stone-800/80 dark:bg-stone-900/40"
                      >
                        <button
                          onClick={() => setExpanded(isOpen ? null : entry.id)}
                          className="w-full px-4 py-3 text-left"
                        >
                          <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                            {entry.themeLabel}
                          </p>
                          <p className="mt-1 font-serif text-base font-semibold text-stone-900 dark:text-stone-50">
                            {entry.title}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">
                            {entry.query}
                          </p>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="border-t border-stone-200/70 dark:border-stone-800/70"
                            >
                              <div className="space-y-4 px-4 py-4">
                                {entry.scriptureAnchors.slice(0, 2).map((s, i) => (
                                  <div key={i} className="rounded-lg bg-amber-500/5 p-3">
                                    <Quotes size={14} weight="fill" className="text-amber-600/70" />
                                    <p className="mt-1 font-serif text-sm text-stone-800 italic dark:text-stone-200">
                                      &ldquo;{s.verse}&rdquo;
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                      {s.reference}
                                    </p>
                                  </div>
                                ))}
                                <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                                  {entry.thesis}
                                </p>
                                <p className="text-xs text-stone-400 dark:text-stone-500">
                                  Saved {new Date(entry.savedAt).toLocaleDateString()}
                                </p>
                                <button
                                  onClick={() => handleDelete(entry.id)}
                                  className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-red-500/40 hover:text-red-600 dark:border-stone-800 dark:text-stone-300"
                                >
                                  <Trash size={14} weight="duotone" />
                                  Remove
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}