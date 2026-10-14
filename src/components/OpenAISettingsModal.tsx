import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { X, Key, Eye, EyeSlash, Scales, Lightning, WarningCircle, Check } from "@phosphor-icons/react"
import {
  OPENAI_MODELS,
  loadOpenAIConfig,
  saveOpenAIConfig,
  clearOpenAIConfig,
} from "@/lib/aiGuidanceEngine"
import type { OpenAIConfig } from "@/types/aiGuidance"

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function OpenAISettingsModal({ open, onClose, onSaved }: Props) {
  const [config, setConfig] = useState<OpenAIConfig>({
    apiKey: "",
    model: OPENAI_MODELS[0],
    temperature: 0.7,
  })
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    if (open) {
      setConfig(loadOpenAIConfig())
      setReveal(false)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const handleSave = () => {
    if (!config.apiKey.trim()) {
      toast.error("Enter an OpenAI API key, or clear the connection instead.")
      return
    }
    saveOpenAIConfig({ ...config, apiKey: config.apiKey.trim() })
    onSaved()
    toast.success("OpenAI connected. Live guidance is now active.")
    onClose()
  }

  const handleClear = () => {
    clearOpenAIConfig()
    setConfig({ apiKey: "", model: OPENAI_MODELS[0], temperature: 0.7 })
    onSaved()
    toast.success("OpenAI disconnected. Using the offline wisdom library.")
  }

  const connected = config.apiKey.trim().length > 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50 text-stone-800 shadow-xl dark:border-stone-800/80 dark:bg-stone-950 dark:text-stone-200"
          >
            <header className="flex items-center justify-between border-b border-stone-200/80 px-5 py-4 dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                <Scales size={20} weight="duotone" className="text-amber-600" />
                <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-50">
                  OpenAI Connection
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-200/60 hover:text-stone-800 dark:hover:bg-stone-800 dark:hover:text-stone-100"
              >
                <X size={18} weight="bold" />
              </button>
            </header>

            <div className="space-y-5 px-5 py-5">
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                Connect your own OpenAI key to receive live, generated philosophical guidance. Your
                key is stored only in this browser and is sent directly to OpenAI. Without a key the
                oracle falls back to its built-in wisdom library.
              </p>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                  <Key size={13} weight="duotone" />
                  API Key
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white/80 px-3 py-2 dark:border-stone-800 dark:bg-stone-900/60">
                  <input
                    type={reveal ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500"
                  />
                  <button
                    onClick={() => setReveal((r) => !r)}
                    aria-label={reveal ? "Hide key" : "Show key"}
                    className="shrink-0 text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    {reveal ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                    Model
                  </label>
                  <select
                    value={config.model}
                    onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm text-stone-800 outline-none focus:border-amber-600/60 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-100"
                  >
                    {OPENAI_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">
                    Temperature
                    <span className="text-amber-700 dark:text-amber-400">
                      {config.temperature.toFixed(1)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={config.temperature}
                    onChange={(e) =>
                      setConfig((c) => ({ ...c, temperature: Number(e.target.value) }))
                    }
                    className="mt-3 w-full accent-amber-600"
                  />
                  <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
                    Lower is precise and doctrinal, higher is more exploratory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-amber-600/20 bg-amber-500/5 p-3 text-xs text-stone-600 dark:text-stone-400">
                <WarningCircle size={16} weight="duotone" className="mt-0.5 shrink-0 text-amber-600" />
                <p>
                  This key lives in your browser storage. Do not use it on a shared computer.
                  Requests go straight to OpenAI from your device.
                </p>
              </div>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 px-5 py-4 dark:border-stone-800/80">
              <button
                onClick={handleClear}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-red-500/40 hover:text-red-600 dark:border-stone-800 dark:text-stone-300"
              >
                {connected ? "Disconnect" : "Reset"}
              </button>
              <div className="flex items-center gap-3">
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-stone-500 underline-offset-2 hover:text-amber-700 hover:underline dark:text-stone-400 dark:hover:text-amber-400"
                >
                  Get an API key
                </a>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  {connected ? <Check size={16} weight="bold" /> : <Lightning size={16} weight="fill" />}
                  Connect
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}