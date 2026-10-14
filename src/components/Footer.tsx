import { motion } from "framer-motion"
import { BookOpen } from "@phosphor-icons/react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="border-t border-stone-200/60 px-5 py-10 dark:border-stone-800/60 sm:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <BookOpen weight="duotone" className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span className="font-serif text-sm font-medium text-stone-700 dark:text-stone-300">Divine Wisdom</span>
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Curated passages for contemplation.
        </p>
        <span className="text-xs text-stone-400 dark:text-stone-600">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </motion.footer>
  )
}
