import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronRight, Copy, Download, Eye, FileCode, FileJson, FileText, Folder, FolderOpen, Search } from "lucide-react";
import type { FileNode, TreeNode } from "@/types/repository";

const NL = String.fromCharCode(10);

interface FileBrowserProps {
  files: FileNode[];
  onToast: (message: string) => void;
}

const TOKEN_RE =
  /(\/\/.*|\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*'|`[^`]*`)|(&lt;\/?[A-Za-z][\w.-]*)|(\d+(?:\.\d+)?)|\b(import|from|export|default|const|let|var|function|return|if|else|for|while|interface|type|extends|new|class|async|await|of|in|as|void|true|false|null|undefined|this)\b/g;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string): string {
  return escapeHtml(code).replace(TOKEN_RE, (match, comment, str, tag, num, kw) => {
    if (comment) return `<span style="color:#64748b;font-style:italic">${comment}</span>`;
    if (str) return `<span style="color:#86efac">${str}</span>`;
    if (tag) return `<span style="color:#f0abfc">${tag}</span>`;
    if (num) return `<span style="color:#fbbf24">${num}</span>`;
    if (kw) return `<span style="color:#60a5fa">${kw}</span>`;
    return match;
  });
}

function fileIcon(node: FileNode) {
  const cls = "h-4 w-4 shrink-0";
  if (node.kind === "dir") return <Folder className={cls} strokeWidth={1.8} />;
  if (node.language === "json") return <FileJson className={cls} strokeWidth={1.8} />;
  if (node.language === "markdown") return <FileText className={cls} strokeWidth={1.8} />;
  return <FileCode className={cls} strokeWidth={1.8} />;
}

function buildTree(files: FileNode[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const map = new Map<string, TreeNode>();
  [...files]
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach((f) => {
      const node: TreeNode = { ...f, children: [] };
      map.set(f.path, node);
      const parentPath = f.path.includes("/") ? f.path.slice(0, f.path.lastIndexOf("/")) : "";
      const parent = parentPath ? map.get(parentPath) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    });
  const sortRec = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "dir" ? -1 : 1));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

function TreeItem({ node, depth, selected, onSelect }: { node: TreeNode; depth: number; selected: string; onSelect: (f: FileNode) => void }) {
  const [open, setOpen] = useState(depth < 1);
  const isDir = node.kind === "dir";
  return (
    <li>
      <button
        onClick={() => (isDir ? setOpen((o) => !o) : onSelect(node))}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-[13px] transition-colors ${
          selected === node.path
            ? "bg-blue-500/15 text-blue-600 dark:text-blue-300"
            : "text-stone-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
        }`}
      >
        {isDir ? (
          open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-stone-400" strokeWidth={2} />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-400" strokeWidth={2} />
          )
        ) : (
          <span className="w-3.5" />
        )}
        <span className="text-amber-500 dark:text-amber-400">{isDir ? <FolderOpen className="h-4 w-4" strokeWidth={1.8} /> : fileIcon(node)}</span>
        <span className="truncate font-mono">{node.name}</span>
      </button>
      {isDir && open && node.children.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <TreeItem key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FileBrowser({ files, onToast }: FileBrowserProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  const leaves = useMemo(() => files.filter((f) => f.kind === "file"), [files]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FileNode>(leaves[0]);
  const [raw, setRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recents, setRecents] = useState<FileNode[]>([leaves[0]]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return leaves.filter((f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q));
  }, [query, leaves]);

  const openFile = (f: FileNode) => {
    setSelected(f);
    setRecents((prev) => [f, ...prev.filter((r) => r.id !== f.id)].slice(0, 4));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(selected.content ?? "");
    setCopied(true);
    onToast(`Copied ${selected.name} to clipboard`);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([selected.content ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.name;
    a.click();
    URL.revokeObjectURL(url);
    onToast(`Downloaded ${selected.name}`);
  };

  const html = useMemo(() => highlight(selected.content ?? ""), [selected]);
  const lineCount = (selected.content ?? "").split(NL).length;
  const crumbs = selected.path.split("/");

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <Search className="h-3.5 w-3.5 text-stone-400" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full bg-transparent text-xs text-stone-800 outline-none dark:text-slate-200"
            aria-label="Filter files"
          />
        </div>

        <nav className="mt-3 max-h-[420px] overflow-y-auto pr-1">
          {results.length > 0 ? (
            <ul className="space-y-0.5">
              {results.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => openFile(f)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] ${
                      selected.id === f.id
                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-300"
                        : "text-stone-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span className="text-amber-500 dark:text-amber-400">{fileIcon(f)}</span>
                    <span className="truncate font-mono">{f.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-0.5">
              {tree.map((n) => (
                <TreeItem key={n.id} node={n} depth={0} selected={selected.path} onSelect={openFile} />
              ))}
            </ul>
          )}
        </nav>

        <div className="mt-4 border-t border-stone-100 pt-3 dark:border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-500">Recent files</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {recents.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="rounded-md border border-stone-200 px-2 py-1 font-mono text-[11px] text-stone-600 hover:border-blue-500/50 dark:border-slate-800 dark:text-slate-300"
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <motion.section
        key={selected.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 px-4 py-3 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-1 font-mono text-[11px] text-stone-400 dark:text-slate-500">
            <span className="truncate text-stone-700 dark:text-stone-100">Divine-Wisdom</span>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" strokeWidth={2} />
                <span className={i === crumbs.length - 1 ? "text-blue-600 dark:text-blue-400" : ""}>{c}</span>
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden rounded-md bg-stone-100 px-2 py-1 font-mono text-[11px] text-stone-500 sm:inline dark:bg-slate-800 dark:text-slate-400">
              {selected.language?.toUpperCase()}
            </span>
            <span className="hidden rounded-md bg-stone-100 px-2 py-1 font-mono text-[11px] text-stone-500 md:inline dark:bg-slate-800 dark:text-slate-400">
              {selected.size} KB - {lineCount} lines
            </span>
            <button
              onClick={() => setRaw((r) => !r)}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-2.5 py-1.5 text-[11px] font-medium text-stone-600 transition-colors hover:border-blue-500/50 dark:border-slate-800 dark:text-slate-300"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
              {raw ? "Highlighted" : "Raw"}
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-2.5 py-1.5 text-[11px] font-medium text-stone-600 transition-colors hover:border-blue-500/50 dark:border-slate-800 dark:text-slate-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />}
              Copy
            </button>
            <button
              onClick={download}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-2.5 py-1.5 text-[11px] font-medium text-stone-600 transition-colors hover:border-blue-500/50 dark:border-slate-800 dark:text-slate-300"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
              Save
            </button>
          </div>
        </div>

        <div className="flex max-h-[520px] overflow-auto bg-[#0B0F19]">
          <pre className="select-none border-r border-slate-800 px-3 py-4 text-right font-mono text-xs leading-relaxed text-slate-600">
            {Array.from({ length: lineCount }, (_, i) => i + 1).join(NL)}
          </pre>
          {raw ? (
            <pre className="flex-1 whitespace-pre px-4 py-4 font-mono text-xs leading-relaxed text-slate-200">{selected.content}</pre>
          ) : (
            <pre
              className="flex-1 whitespace-pre px-4 py-4 font-mono text-xs leading-relaxed text-slate-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </motion.section>
    </div>
  );
}