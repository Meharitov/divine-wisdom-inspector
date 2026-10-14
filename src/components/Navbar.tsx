import { motion } from "framer-motion"
import {
  Sun,
  Moon,
  BookOpen,
  Sparkle,
  ClockCounterClockwise,
  Gear,
  PlugsConnected,
  Plugs,
} from "@phosphor-icons/react"

export type AppView = "oracle" | "library"

interface NavbarProps {
  dark: boolean
  onToggleTheme: () => void
  activeView: AppView
  onSelectView: (view: AppView) => void
  onOpenJournal: () => void
  onOpenSettings: () => void
  openaiEnabled: boolean
  journalCount: number
}

const VIEWS: { key: AppView; label: string; icon: React.ReactNode }[] = [
  { key: "oracle", label: "Oracle", icon: <Sparkle size={15} weight="duotone" /> },
  { key: "library", label: "Library", icon: <BookOpen size={15} weight="duotone" /> },
]

export default function Navbar({
  dark,
  onToggleTheme,
  activeView,
  onSelectView,
  onOpenJournal,
  onOpenSettings,
  openaiEnabled,
  journalCount,
}: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-stone-200/60 bg-stone-50/90 backdrop-blur-md dark:border-stone-800/60 dark:bg-stone-950/90"
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-8">
        <button
          onClick={() => onSelectView("oracle")}
          className="flex shrink-0 items-center gap-2"
        >
          <BookOpen weight="duotone" className="h-4.5 w-4.5 text-amber-700 dark:text-amber-400" />
          <span className="hidden font-serif text-base font-semibold tracking-tight text-stone-800 sm:inline dark:text-stone-100">
            Divine Wisdom
          </span>
        </button>

        <div className="flex items-center gap-1 rounded-xl bg-stone-100/80 p-1 dark:bg-stone-900/70">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => onSelectView(v.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeView === v.key
                  ? "bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-50"
                  : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {v.icon}
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onOpenSettings}
            aria-label="OpenAI settings"
            title={openaiEnabled ? "OpenAI connected" : "Connect OpenAI"}
            className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:text-stone-500 dark:hover:bg-stone-900 dark:hover:text-stone-200"
          >
            {openaiEnabled ? <PlugsConnected size={17} weight="duotone" /> : <Plugs size={17} weight="duotone" />}
            <span
              className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                openaiEnabled ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-600"
              }`}
            />
          </button>

          <button
            onClick={onOpenJournal}
            aria-label="Open journal"
            className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:text-stone-500 dark:hover:bg-stone-900 dark:hover:text-stone-200"
          >
            <ClockCounterClockwise size={17} weight="duotone" />
            {journalCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
                {journalCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:text-stone-500 dark:hover:bg-stone-900 dark:hover:text-stone-200"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </nav>
    </motion.header>
  )
}