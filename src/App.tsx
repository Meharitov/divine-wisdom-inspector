import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import Navbar, { type AppView } from "@/components/Navbar"
import Hero from "@/components/Hero"
import AIGuidanceOracle from "@/components/AIGuidanceOracle"
import GuidanceHistory from "@/components/GuidanceHistory"
import OpenAISettingsModal from "@/components/OpenAISettingsModal"
import WisdomReader from "@/components/WisdomReader"
import Footer from "@/components/Footer"
import { hasApiKey, loadJournal } from "@/lib/aiGuidanceEngine"
import type { TopicKey } from "@/types"
import type { GuidanceMode } from "@/types/aiGuidance"

interface OracleSeed {
  id: number
  query: string
  mode: GuidanceMode
}

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("dw-theme")
    if (saved) return saved === "dark"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })
  const [view, setView] = useState<AppView>("oracle")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<TopicKey | null>(null)
  const [seed, setSeed] = useState<OracleSeed | null>(null)
  const [journalOpen, setJournalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [journalCount, setJournalCount] = useState(0)
  const [openaiEnabled, setOpenaiEnabled] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("dw-theme", dark ? "dark" : "light")
  }, [dark])

  useEffect(() => {
    setOpenaiEnabled(hasApiKey())
    setJournalCount(loadJournal().length)
  }, [])

  useEffect(() => {
    if (!journalOpen) setJournalCount(loadJournal().length)
  }, [journalOpen])

  const selectView = (next: AppView) => {
    setView(next)
    window.setTimeout(() => {
      document
        .getElementById(next === "oracle" ? "guidance" : "explore")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 60)
  }

  const handleSearch = (query: string) => {
    setSeed({ id: Date.now(), query, mode: "question" })
    selectView("oracle")
  }

  const handleSelectTopic = (topic: TopicKey | string) => {
    setSearchQuery("")
    setSelectedTopic(topic as TopicKey)
    selectView("library")
  }

  return (
    <div className="min-h-[100dvh] bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <Toaster richColors position="top-right" closeButton />
      <Navbar
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
        activeView={view}
        onSelectView={selectView}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        openaiEnabled={openaiEnabled}
        journalCount={journalCount}
      />

      <Hero onSearch={handleSearch} onSelectTopic={handleSelectTopic} />

      <div id="explore">
        {view === "oracle" ? (
          <AIGuidanceOracle
            seed={seed}
            onOpenHistory={() => setJournalOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            openaiEnabled={openaiEnabled}
          />
        ) : (
          <WisdomReader
            searchQuery={searchQuery}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
          />
        )}
      </div>

      <Footer />

      <GuidanceHistory open={journalOpen} onClose={() => setJournalOpen(false)} />
      <OpenAISettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={() => setOpenaiEnabled(hasApiKey())}
      />
    </div>
  )
}

export default App