import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Check, Copy, Eye, GitFork, Github, Server, Star, Terminal } from "lucide-react";
import type { RepoDataset } from "@/types/repository";

const NL = String.fromCharCode(10);

interface DashboardProps {
  data: RepoDataset;
}

function Markdown({ source }: { source: string }) {
  const blocks = useMemo(() => {
    const lines = source.split(NL);
    const out: { type: string; value: string[] }[] = [];
    let buf: string[] = [];
    let mode = "text";
    const flush = () => {
      if (buf.length) out.push({ type: mode, value: buf });
      buf = [];
      mode = "text";
    };
    lines.forEach((line) => {
      if (line.startsWith("    ")) {
        if (mode !== "code") flush();
        mode = "code";
        buf.push(line.slice(4));
        return;
      }
      if (mode === "code") flush();
      if (line.startsWith("## ")) {
        flush();
        out.push({ type: "h2", value: [line.slice(3)] });
      } else if (line.startsWith("# ")) {
        flush();
        out.push({ type: "h1", value: [line.slice(2)] });
      } else if (line.startsWith("- ")) {
        if (mode !== "list") flush();
        mode = "list";
        buf.push(line.slice(2));
      } else {
        buf.push(line);
      }
    });
    flush();
    return out;
  }, [source]);

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.type === "h1")
          return (
            <h1 key={i} className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {b.value[0]}
            </h1>
          );
        if (b.type === "h2")
          return (
            <h2 key={i} className="border-b border-stone-100 pb-2 pt-2 text-lg font-semibold text-stone-800 dark:border-slate-800 dark:text-slate-200">
              {b.value[0]}
            </h2>
          );
        if (b.type === "list")
          return (
            <ul key={i} className="space-y-1.5">
              {b.value.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm text-stone-600 dark:text-slate-300">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          );
        if (b.type === "code")
          return (
            <pre key={i} className="overflow-x-auto rounded-xl border border-stone-200 bg-stone-900 p-4 font-mono text-xs leading-relaxed text-emerald-300 dark:border-slate-800">
              {b.value.join(NL)}
            </pre>
          );
        return (
          <p key={i} className="max-w-[70ch] text-sm leading-relaxed text-stone-600 dark:text-slate-300">
            {b.value.join(" ")}
          </p>
        );
      })}
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 transition-colors hover:border-blue-400/50 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center gap-2 text-stone-400 dark:text-slate-500">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold text-stone-900 dark:text-stone-100">{value}</p>
    </div>
  );
}

export default function Dashboard({ data }: DashboardProps) {
  const { meta, readme, commits } = data;
  const [copied, setCopied] = useState(false);

  const copyClone = async () => {
    await navigator.clipboard.writeText(`git clone ${meta.url}.git`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-slate-400">
              <Github className="h-4 w-4" strokeWidth={1.8} />
              {meta.owner} <span className="text-stone-300 dark:text-slate-600">/</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{meta.name}</span>
            </div>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-stone-600 dark:text-slate-300">{meta.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.topics.map((t) => (
                <span key={t} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={copyClone}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 font-mono text-xs text-stone-700 transition-colors hover:border-blue-500/50 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />}
            git clone
          </button>
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Metric icon={<Star className="h-4 w-4" strokeWidth={1.8} />} label="Stars" value={String(meta.stars)} />
        <Metric icon={<GitFork className="h-4 w-4" strokeWidth={1.8} />} label="Forks" value={String(meta.forks)} />
        <Metric icon={<Eye className="h-4 w-4" strokeWidth={1.8} />} label="Watchers" value={String(meta.watchers)} />
        <Metric icon={<Terminal className="h-4 w-4" strokeWidth={1.8} />} label="Commits" value={String(meta.commitCount)} />
        <Metric icon={<Server className="h-4 w-4" strokeWidth={1.8} />} label="Open issues" value={String(meta.openIssues)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
            README.md
          </div>
          <div className="mt-4">
            <Markdown source={readme} />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">Language breakdown</div>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full">
              {meta.languages.map((l) => (
                <span key={l.name} style={{ width: `${l.percent}%`, background: l.color }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2.5">
              {meta.languages.map((l) => (
                <li key={l.name} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-stone-700 dark:text-slate-200">{l.name}</span>
                  <span className="ml-auto font-mono text-xs text-stone-400 dark:text-slate-500">{l.percent}%</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">Recent commits</div>
            <ul className="mt-4 space-y-4">
              {commits.map((c) => (
                <li key={c.sha} className="border-l-2 border-amber-500/40 pl-3">
                  <p className="text-sm leading-snug text-stone-700 dark:text-slate-200">{c.message}</p>
                  <p className="mt-1 flex items-center gap-2 font-mono text-[11px] text-stone-400 dark:text-slate-500">
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 dark:bg-slate-800">{c.sha}</span>
                    {c.author} <span className="text-stone-300 dark:text-slate-600">-</span> {c.date}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}