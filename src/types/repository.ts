export type FileKind = "file" | "dir";

export interface FileNode {
  id: string;
  name: string;
  path: string;
  kind: FileKind;
  size?: number;
  lines?: number;
  language?: string;
  content?: string;
}

export interface TreeNode extends FileNode {
  children: TreeNode[];
}

export interface LanguageSlice {
  name: string;
  percent: number;
  color: string;
}

export interface RepoMeta {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  defaultBranch: string;
  branches: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  commitCount: number;
  license: string;
  homepage: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  sizeKb: number;
  languages: LanguageSlice[];
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface Dependency {
  name: string;
  version: string;
  kind: "dependency" | "devDependency";
}

export interface PackageScript {
  name: string;
  command: string;
}

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
}

export interface HealthMetric {
  label: string;
  score: number;
  detail: string;
}

export interface FeatureModule {
  title: string;
  summary: string;
  status: string;
  accent: string;
}

export interface RepoDataset {
  meta: RepoMeta;
  readme: string;
  files: FileNode[];
  commits: Commit[];
  dependencies: Dependency[];
  scripts: PackageScript[];
  pipeline: PipelineStep[];
  health: HealthMetric[];
  features: FeatureModule[];
}