export type AgentTab = "work_agent" | "learnings_agent" | "touch_grass_agent";

export const TERMINAL_PATH = "~/Desktop/tandem-internship-wrapped";

export const AGENT_TABS: ReadonlyArray<{ id: AgentTab; label: string }> = [
  { id: "work_agent", label: "1: work_agent" },
  { id: "learnings_agent", label: "2: learnings_agent" },
  { id: "touch_grass_agent", label: "3: touch_grass_agent" },
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
