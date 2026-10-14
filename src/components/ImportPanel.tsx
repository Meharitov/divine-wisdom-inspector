import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, GitBranch, Loader2, RefreshCw, Terminal, Zap, Link as LinkIcon } from "lucide-react";
import type { PipelineStep, RepoMeta } from "@/types/repository";
import { Button } from "@/components/ui/button";

interface ImportPanelProps {
  meta: RepoMeta;
  pipeline: PipelineStep[];
  branch: string;
  onBranchChange: (branch: string) => void;
  onImported: (message: string) => void;
}

type StepState = "pending" | "active" | "done";

export default function ImportPanel({ meta, pipeline, branch, onBranchChange, onImported }: ImportPanelProps) {
  const [url, setUrl] = useState(meta.url);
  const [token, setToken] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number>(100);
  const [states, setStates] = useState<StepState[]>(pipeline.map(() => "done"));
  const [telemetry, setTelemetry] = useState({ files: 14, depth: 4, speed: "6.4 MB/s", cached: true });

  const runPipeline = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setStates(pipeline.map(() => "pending"));
    setTelemetry({ files: 0, depth: 0, speed: "0 MB/s", cached: false });

    pipeline.forEach((_, i) => {
      window.setTimeout(() => {
        setStates((prev) => prev.map((s, idx) => (idx === i ? "active" : s)));
      }, i * 620);
      window.setTimeout(() => {
        setStates((prev) => prev.map((s, idx) => (idx <= i ? "done" : s)));
        setProgress(Math.round(((i + 1) / pipeline.length) * 100));
        setTelemetry({
          files: Math.round(((i + 1) / pipeline.length) * 14),
          depth: Math.min(4, i + 1),
          speed: `${(2.1 + i * 1.3).toFixed(1)} MB/s`,
          cached: i === pipeline.length - 1,
        });
        if (i === pipeline.length - 1) {
          setRunning(false);
          onImported(`Re-import complete - ${meta.fullName} @ ${branch}`);
        }
      }, i * 620 + 520);
    });
  };

  const reset = () => {
    setUrl(meta.url);
    setToken("");
    onBranchChange(meta.defaultBranch);
    setStates(pipeline.map(() => "done"));
    setProgress(100);
    setTelemetry({ files: 14, depth: 4, speed: "6.4 MB/s", cached: true });
    onImported("Reset to the default repository configuration");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
          <Zap className="h-3.5 w-3.5" strokeWidth={2} />
          Repository Import
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Ingest a Git source tree</h2>
        <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-stone-500 dark:text-slate-400">
          Pre-configured for the Divine Wisdom repository. Fetch live metadata from the GitHub REST API or reload the bundled snapshot.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-500 dark:text-slate-400">Repository URL</label>
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-blue-500 dark:border-slate-800 dark:bg-slate-950/60">
              <LinkIcon className="h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.8} />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs text-stone-800 outline-none dark:text-slate-200"
                aria-label="Repository URL"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-500 dark:text-slate-400">Branch</label>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
                <GitBranch className="h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.8} />
                <select
                  value={branch}
                  onChange={(e) => onBranchChange(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-stone-800 outline-none dark:text-slate-200"
                  aria-label="Import branch"
                >
                  {meta.branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-stone-500 dark:text-slate-400">
                Personal access token <span className="text-stone-400">(optional)</span>
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-xs text-stone-800 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={runPipeline} disabled={running} className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
              {running ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : <RefreshCw className="h-4 w-4" strokeWidth={2} />}
              {running ? "Importing" : "Re-import from source"}
            </Button>
            <Button variant="outline" onClick={reset} className="gap-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              <Terminal className="h-4 w-4" strokeWidth={2} />
              Reset to default
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-stone-100 pt-5 sm:grid-cols-4 dark:border-slate-800">
          {[
            { k: "Files indexed", v: `${telemetry.files} / 14` },
            { k: "Tree depth", v: `${telemetry.depth} levels` },
            { k: "Throughput", v: telemetry.speed },
            { k: "Cache", v: telemetry.cached ? "Warm" : "Cold" },
          ].map((t) => (
            <div key={t.k}>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-400 dark:text-slate-500">{t.k}</p>
              <p className="mt-0.5 font-mono text-sm text-stone-800 dark:text-slate-200">{t.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">Ingestion pipeline</div>
          <span className="font-mono text-xs text-stone-500 dark:text-slate-400">{progress}%</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-blue-600"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        <ol className="mt-5 space-y-3">
          {pipeline.map((step, i) => {
            const state = states[i];
            return (
              <li key={step.id} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold">
                  {state === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={1.8} />
                  ) : state === "active" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" strokeWidth={2} />
                  ) : (
                    <span className="text-stone-400 dark:text-slate-500">{i + 1}</span>
                  )}
                </span>
                <div>
                  <p className={`text-sm font-medium ${state === "pending" ? "text-stone-400 dark:text-slate-500" : "text-stone-800 dark:text-slate-100"}`}>
                    {step.label}
                  </p>
                  <p className="font-mono text-[11px] text-stone-400 dark:text-slate-500">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}