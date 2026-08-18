export type AgentTab = "work_agent" | "learnings_agent" | "touch_grass_agent";

export const TERMINAL_PATH = "~/Desktop/tandem-internship-wrapped";

export const AGENT_TABS: ReadonlyArray<{ id: AgentTab; label: string }> = [
  { id: "work_agent", label: "1: work_agent" },
  { id: "learnings_agent", label: "2: learnings_agent" },
  { id: "touch_grass_agent", label: "3: touch_grass_agent" },
] as const;

export const WORK_TRACKS = [
  {
    title: "Onboarding API Overhaul",
    metric: "+18% conversion ✨",
    trend: "up",
  },
  {
    title: "Database Query Tuning",
    metric: "-320ms p99 latency",
    trend: "down",
  },
  {
    title: "Datadog Alert Cleanup",
    metric: "-40% ops alert noise",
    trend: "down",
  },
] as const;

/** Canned replies so the prompt answers instead of swallowing input. */
export const WORK_AGENT_REPLIES = [
  "logged 214 commits, 61 PRs, and exactly 3 rage-quits.",
  "peak commit hour was 11pm. second peak: 11am. no in between.",
  "most edited file: onboarding/route.ts (47 revisions, no regrets).",
  "longest CI wait: 14 min. spent it getting coffee. worth it.",
] as const;

export type DiffLine = {
  kind: "meta" | "hunk" | "removed" | "added" | "context";
  text: string;
};

export const LEARNINGS_DIFF: readonly DiffLine[] = [
  { kind: "meta", text: "diff --git a/expectation.md b/reality.md" },
  { kind: "meta", text: "--- a/expectation.md" },
  { kind: "meta", text: "+++ b/reality.md" },
  { kind: "hunk", text: "@@ week 1 @@" },
  { kind: "removed", text: "- read the whole codebase by friday" },
  { kind: "added", text: "+ read one file. it was the README. progress!" },
  { kind: "hunk", text: "@@ week 4 @@" },
  { kind: "removed", text: "- P0 incidents happen to other people" },
  { kind: "added", text: "+ [P0] staging memory leak, 2:14am, my name on the pager" },
  { kind: "added", text: "+ patched in 11 mins flat 🔥" },
  { kind: "hunk", text: "@@ week 12 @@" },
  { kind: "removed", text: "- ship fast, break nothing" },
  { kind: "added", text: "+ ship fast, break staging, fix faster" },
  { kind: "context", text: "  3 files changed, 1 intern rebuilt" },
] as const;

export const TOUCH_GRASS_WARNINGS = [
  "[WARNING] 28,800 minutes logged in VS Code.",
  "[WARNING] Terminal saturation detected.",
] as const;
