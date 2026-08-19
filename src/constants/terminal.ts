export type AgentTab = "work_agent" | "learnings_agent" | "touch_grass_agent";

export const TERMINAL_PATH = "~/Desktop/tandem-internship-wrapped";

export const AGENT_TABS: ReadonlyArray<{ id: AgentTab; label: string }> = [
  { id: "work_agent", label: "1: work_agent" },
  { id: "learnings_agent", label: "2: learnings_agent" },
  { id: "touch_grass_agent", label: "3: touch_grass_agent" },
] as const;

export const TOUCH_GRASS_WARNINGS = [
  "[WARNING] 28,800 minutes logged in VS Code.",
  "[WARNING] Terminal saturation detected.",
] as const;
