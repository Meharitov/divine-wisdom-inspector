import type { RepoDataset } from "@/types/repository";

const readme = `# Divine Wisdom

Divine Wisdom, Modern Clarity.
Seek philosophical guidance grounded in biblical text. Ask a question, provide a topic,
or simply receive a daily reflection.

## Features

- Philosophical Q&A grounded in biblical scripture and wisdom traditions
- Daily Reflection card with curated passages for contemplation
- Topic Explorer to browse guidance by theme — faith, purpose, suffering, joy
- Full-text search across all passages with instant highlighting
- Offline-first caching so wisdom travels with you

## Getting started

    bun install
    bun run dev

Open http://localhost:3000 and the reader boots straight into today's reflection.

## Project layout

    src/components   Reader, explorer, and reflection modules
    src/data         Curated passages + reflection corpora
    src/hooks        Reusable data + state hooks
    src/lib          Search and topic-matching utilities

## License

Released under the MIT License. The scriptural texts remain the shared inheritance of the faithful.`;

const appTsx = `import { useState } from "react";
import WisdomReader from "@/components/WisdomReader";
import DailyReflection from "@/components/DailyReflection";

export default function App() {
  const [tab, setTab] = useState<"read" | "reflect">("read");
  return (
    <main className="min-h-[100dvh] bg-stone-950 text-stone-100">
      <nav className="flex gap-4 px-6 py-4">
        <button onClick={() => setTab("read")}>Reader</button>
        <button onClick={() => setTab("reflect")}>Daily Reflection</button>
      </nav>
      {tab === "read" ? <WisdomReader /> : <DailyReflection />}
    </main>
  );
}`;

const readerTsx = `import { useMemo } from "react";
import { passages } from "@/data/reflections";
import { useWisdom } from "@/hooks/useWisdom";

export default function WisdomReader() {
  const { query, setQuery, setTopic } = useWisdom();
  const results = useMemo(
    () => passages.filter((p) => p.text.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search all passages"
        className="w-full rounded-lg bg-stone-900 px-4 py-3"
      />
      <ol className="mt-8 space-y-6">
        {results.map((p) => (
          <li key={p.id} onClick={() => setTopic(p.topic)}>
            <p className="text-amber-300">{p.text}</p>
            <p className="text-sm text-stone-400">{p.source}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`;

const wisdomTsx = `import { useEffect, useState } from "react";
import { reflections } from "@/data/reflections";

export default function DailyReflection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const day = new Date().getDate();
    setIndex(day % reflections.length);
  }, []);

  const entry = reflections[index];
  return (
    <article className="mx-auto mt-16 max-w-2xl rounded-2xl border border-amber-500/20 p-8">
      <blockquote className="text-2xl leading-relaxed text-stone-100">{entry.text}</blockquote>
      <p className="mt-4 text-sm text-amber-400">{entry.source}</p>
      <button onClick={() => setIndex((i) => (i + 1) % reflections.length)}>Another reflection</button>
    </article>
  );
}`;

const calendarTsx = `import { topics } from "@/data/reflections";

export default function TopicExplorer() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-lg text-amber-300">Browse Topics</h3>
        <ul>
          {topics.map((t) => (
            <li key={t.name}>
              {t.name} — {t.count} passages
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg text-amber-300">Featured Themes</h3>
        <ul>
          {topics.filter((t) => t.featured).map((t) => (
            <li key={t.name}>
              {t.name}: {t.description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}`;

const useScripture = `import { useState } from "react";

export function useWisdom() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Faith");
  return { query, setQuery, topic, setTopic };
}`;

const transliterate = `const stopWords = new Set(["the", "a", "an", "is", "are", "was", "were", "be", "been", "being"]);

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/\\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

export function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}`;

const scriptures = `export interface Passage {
  id: string;
  topic: string;
  text: string;
  source: string;
}

export const passages: Passage[] = [
  {
    id: "prov-3-5",
    topic: "Faith",
    text: "Trust in the Lord with all your heart, and lean not on your own understanding.",
    source: "Proverbs 3:5",
  },
];

export const reflections = [
  { text: "The Lord is my shepherd; I shall not want.", source: "Psalm 23:1" },
  { text: "Wisdom begins with the fear of the Lord.", source: "Proverbs 9:10" },
];

export const topics = [
  { name: "Faith", count: 12, featured: true, description: "Trust, belief, and surrender" },
  { name: "Purpose", count: 8, featured: true, description: "Calling, meaning, and direction" },
  { name: "Suffering", count: 6, featured: false, description: "Endurance, hope, and redemption" },
  { name: "Joy", count: 9, featured: true, description: "Gratitude, peace, and celebration" },
];`;

const indexCss = `@import "tailwindcss";

:root {
  --amber: #f59e0b;
  --obsidian: #0b0f19;
}

body {
  background: var(--obsidian);
  color: #e7e5e4;
  font-family: "Geist", system-ui, sans-serif;
}`;

const packageJson = `{
  "name": "divine-wisdom",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.544.0",
    "react": "^19.1.2",
    "react-dom": "^19.1.2",
    "tailwindcss": "^4.1.14"
  }
}`;

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}`;

const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});`;

export const divineWisdom: RepoDataset = {
  meta: {
    owner: "Meharitov",
    name: "Divine-Wisdom",
    fullName: "Meharitov/Divine-Wisdom",
    url: "https://github.com/Meharitov/Divine-Wisdom",
    description: "Seek philosophical guidance grounded in biblical text. Ask a question, provide a topic, or simply receive a daily reflection.",
    defaultBranch: "main",
    branches: ["main", "master", "release/v1.2"],
    stars: 128,
    forks: 24,
    watchers: 16,
    openIssues: 0,
    commitCount: 48,
    license: "MIT",
    homepage: "https://divine-wisdom.example.app",
    topics: ["biblical", "philosophy", "wisdom", "daily-reflection", "react", "typescript", "tailwindcss"],
    createdAt: "2024-03-12",
    updatedAt: "2025-06-28",
    sizeKb: 486,
    languages: [
      { name: "TypeScript", percent: 68, color: "#3178c6" },
      { name: "TSX / React", percent: 22, color: "#f59e0b" },
      { name: "CSS / Tailwind", percent: 7, color: "#38bdf8" },
      { name: "Markdown", percent: 3, color: "#a3a3a3" },
    ],
  },
  readme,
  commits: [
    { sha: "a91f3c2", message: "feat: add topic-based philosophical guidance engine", author: "Meharitov", date: "2025-06-28" },
    { sha: "7d4b110", message: "fix: memory leak in daily reflection interval", author: "Meharitov", date: "2025-06-21" },
    { sha: "3c8e9f4", message: "feat: offline cache for the reflection corpus", author: "Meharitov", date: "2025-06-09" },
    { sha: "e2a7b63", message: "chore: migrate styling to Tailwind v4", author: "Meharitov", date: "2025-05-30" },
    { sha: "1f5d8aa", message: "docs: expand contributing guide for writers", author: "Meharitov", date: "2025-05-17" },
    { sha: "9b0c4e1", message: "feat: full-text search across all passages", author: "Meharitov", date: "2025-05-02" },
  ],
  dependencies: [
    { name: "react", version: "^19.1.2", kind: "dependency" },
    { name: "react-dom", version: "^19.1.2", kind: "dependency" },
    { name: "framer-motion", version: "^12.23.24", kind: "dependency" },
    { name: "lucide-react", version: "^0.544.0", kind: "dependency" },
    { name: "tailwindcss", version: "^4.1.14", kind: "dependency" },
    { name: "typescript", version: "~5.8.3", kind: "devDependency" },
    { name: "vite", version: "^5.4.11", kind: "devDependency" },
    { name: "@vitejs/plugin-react", version: "^5.0.3", kind: "devDependency" },
  ],
  scripts: [
    { name: "dev", command: "vite --host 0.0.0.0" },
    { name: "build", command: "tsc -b && vite build" },
    { name: "preview", command: "vite preview" },
  ],
  pipeline: [
    { id: "validate", label: "Validating repository endpoint", detail: "GET /repos/Meharitov/Divine-Wisdom - 200 OK" },
    { id: "clone", label: "Cloning git tree and branches", detail: "default branch resolved to main" },
    { id: "parse", label: "Parsing AST and dependencies", detail: "package.json, tsconfig.json, vite.config.ts" },
    { id: "index", label: "Indexing source files and assets", detail: "14 files indexed, 0 skipped" },
    { id: "audit", label: "Synthesizing architecture and health audit", detail: "composite health score computed" },
  ],
  health: [
    { label: "TypeScript strictness", score: 100, detail: "strict mode enabled, zero implicit any" },
    { label: "Lint cleanliness", score: 96, detail: "2 unused imports flagged, auto-fixable" },
    { label: "Responsive design index", score: 94, detail: "mobile-first breakpoints across modules" },
    { label: "Accessibility rating", score: 91, detail: "keyboard traversal verified on reader" },
  ],
  features: [
    { title: "Philosophical Q&A Engine", summary: "Ask a question and receive guidance grounded in biblical text with highlighted source passages.", status: "Stable", accent: "#f59e0b" },
    { title: "Daily Reflection", summary: "A curated passage refreshed every morning for contemplation and meditation.", status: "Stable", accent: "#38bdf8" },
    { title: "Topic Explorer", summary: "Browse wisdom by theme — faith, purpose, suffering, joy, and more.", status: "Beta", accent: "#10b981" },
    { title: "Full-Text Search", summary: "Instant search across all passages with highlighted matches and topic filters.", status: "Beta", accent: "#8b5cf6" },
  ],
  files: [
    { id: "d-src", name: "src", path: "src", kind: "dir" },
    { id: "d-components", name: "components", path: "src/components", kind: "dir" },
    { id: "f-app", name: "App.tsx", path: "src/App.tsx", kind: "file", size: 3.4, lines: 19, language: "tsx", content: appTsx },
    { id: "f-reader", name: "WisdomReader.tsx", path: "src/components/WisdomReader.tsx", kind: "file", size: 4.2, lines: 31, language: "tsx", content: readerTsx },
    { id: "f-wisdom", name: "DailyReflection.tsx", path: "src/components/DailyReflection.tsx", kind: "file", size: 3.1, lines: 24, language: "tsx", content: wisdomTsx },
    { id: "f-cal", name: "TopicExplorer.tsx", path: "src/components/TopicExplorer.tsx", kind: "file", size: 2.6, lines: 25, language: "tsx", content: calendarTsx },
    { id: "d-data", name: "data", path: "src/data", kind: "dir" },
    { id: "f-scrip", name: "reflections.ts", path: "src/data/reflections.ts", kind: "file", size: 1.9, lines: 22, language: "ts", content: scriptures },
    { id: "d-hooks", name: "hooks", path: "src/hooks", kind: "dir" },
    { id: "f-hook", name: "useWisdom.ts", path: "src/hooks/useWisdom.ts", kind: "file", size: 0.6, lines: 7, language: "ts", content: useScripture },
    { id: "d-lib", name: "lib", path: "src/lib", kind: "dir" },
    { id: "f-trans", name: "search.ts", path: "src/lib/search.ts", kind: "file", size: 0.8, lines: 12, language: "ts", content: transliterate },
    { id: "f-css", name: "index.css", path: "src/index.css", kind: "file", size: 0.5, lines: 11, language: "css", content: indexCss },
    { id: "f-main", name: "main.tsx", path: "src/main.tsx", kind: "file", size: 0.4, lines: 9, language: "tsx", content: `import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);` },
    { id: "f-pkg", name: "package.json", path: "package.json", kind: "file", size: 1.1, lines: 20, language: "json", content: packageJson },
    { id: "f-tsc", name: "tsconfig.json", path: "tsconfig.json", kind: "file", size: 0.7, lines: 15, language: "json", content: tsconfig },
    { id: "f-vite", name: "vite.config.ts", path: "vite.config.ts", kind: "file", size: 0.6, lines: 11, language: "ts", content: viteConfig },
    { id: "f-readme", name: "README.md", path: "README.md", kind: "file", size: 2.4, lines: 37, language: "markdown", content: readme },
    { id: "d-public", name: "public", path: "public", kind: "dir" },
    { id: "f-favicon", name: "favicon.svg", path: "public/favicon.svg", kind: "file", size: 0.3, lines: 1, language: "markup", content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f59e0b" d="M12 2l3 7h7l-6 5 2 8-6-5-6 5 2-8-6-5h7z"/></svg>' },
  ],
};