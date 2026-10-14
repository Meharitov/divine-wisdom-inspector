import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Check, Copy, Download, HardDrive, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import type { RepoDataset } from "@/types/repository";
import { Button } from "@/components/ui/button";

interface StatusAndInspectorProps {
  data: RepoDataset;
  branch: string;
  lastSync: string;
  onToast: (message: string) => void;
}

const NL = String.fromCharCode(10);

export default function StatusAndInspector({ data, branch, lastSync, onToast }: StatusAndInspectorProps) {
  const { meta, health, dependencies, scripts, features } = data;
  const [copied, setCopied] = useState<string | null>(null);

  const flash = (key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const copyClone = async () => {
    await navigator.clipboard.writeText(`git clone ${meta.url}.git`);
    flash("clone");
    onToast("Clone command copied to clipboard");
  };

  const downloadSnapshot = () => {
    const blob = new Blob([JSON.stringify(data.meta, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "divine-wisdom-snapshot.json";
    a.click();
    URL.revokeObjectURL(url);
    onToast("Repository snapshot downloaded");
  };

  const copyReport = async () => {
    const report = [
      `# Repository report - ${meta.fullName}`,
      `Branch: ${branch}`,
      `Commit: ${meta.commitCount}`,
      `Health composite: ${Math.round(health.reduce((s, h) => s + h.score, 0) / health.length)}/100`,
      "",
      "## Health metrics",
      ...health.map((h) => `- ${h.label}: ${h.score}/100`),
      "",
      "## Files",
      `- ${data.files.filter((f) => f.kind === "file").length} tracked files`,
    ].join(NL);
    await navigator.clipboard.writeText(report);
    flash("report");
    onToast("Markdown report copied to clipboard");
  };

  const composite = Math.round(health.reduce((s, h) => s + h.score, 0) / health.length);
  const runtime = dependencies.filter((d) => d.kind === "dependency");
  const dev = dependencies.filter((d) => d.kind === "devDependency");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
            <Activity className="h-3.5 w-3.5" strokeWidth={2} />
            Import status
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold text-stone-900 dark:text-stone-100">{composite}</span>
            <span className="text-sm text-stone-400 dark:text-slate-500">/ 100 health</span>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            {[
              ["Repository", meta.fullName],
              ["Branch", branch],
              ["License", meta.license],
              ["Last sync", lastSync],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-stone-500 dark:text-slate-400">{k}</dt>
                <dd className="truncate font-mono text-stone-800 dark:text-slate-200">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Code health audit
          </div>
          <ul className="mt-4 space-y-4">
            {health.map((h, i) => (
              <li key={h.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700 dark:text-slate-200">{h.label}</span>
                  <span className="font-mono text-xs text-stone-500 dark:text-slate-400">{h.score}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${h.score}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-stone-400 dark:text-slate-500">{h.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
            <Layers className="h-3.5 w-3.5" strokeWidth={2} />
            Dependency & script audit
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-500">Runtime ({runtime.length})</p>
              <ul className="mt-2 space-y-1.5">
                {runtime.map((d) => (
                  <li key={d.name} className="flex items-center justify-between font-mono text-xs">
                    <span className="text-stone-700 dark:text-slate-200">{d.name}</span>
                    <span className="text-stone-400 dark:text-slate-500">{d.version}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-500">Dev ({dev.length})</p>
              <ul className="mt-2 space-y-1.5">
                {dev.map((d) => (
                  <li key={d.name} className="flex items-center justify-between font-mono text-xs">
                    <span className="text-stone-700 dark:text-slate-200">{d.name}</span>
                    <span className="text-stone-400 dark:text-slate-500">{d.version}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-stone-100 pt-3 dark:border-slate-800">
              {scripts.map((s) => (
                <div key={s.name} className="flex items-center gap-2 font-mono text-xs">
                  <Terminal className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.8} />
                  <span className="text-blue-600 dark:text-blue-400">{s.name}</span>
                  <span className="truncate text-stone-500 dark:text-slate-400">{s.command}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Divine Wisdom feature explorer
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f.title}
                className="rounded-xl border border-stone-200 p-3.5 transition-colors hover:border-blue-400/50 dark:border-slate-800"
                style={{ borderLeftColor: f.accent, borderLeftWidth: 3 }}
              >
                <p className="text-sm font-semibold text-stone-800 dark:text-slate-100">{f.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-stone-500 dark:text-slate-400">{f.summary}</p>
                <span className="mt-2 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:bg-slate-800 dark:text-slate-400">
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400 dark:text-slate-500">
          <HardDrive className="h-3.5 w-3.5" strokeWidth={2} />
          Quick actions
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={copyClone} variant="outline" className="gap-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            {copied === "clone" ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
            Copy clone command
          </Button>
          <Button onClick={downloadSnapshot} variant="outline" className="gap-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            <Download className="h-4 w-4" strokeWidth={1.8} />
            Download snapshot JSON
          </Button>
          <Button onClick={copyReport} variant="outline" className="gap-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            {copied === "report" ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.8} />}
            Copy markdown report
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-stone-400 dark:text-slate-500">
          Two-way Git syncing and direct commits are intentionally out of scope for this iteration.
        </p>
      </section>
    </div>
  );
}