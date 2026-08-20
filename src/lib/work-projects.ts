import { KNOWLEDGE_BASE } from "@/data/knowledge_base";

const SECTION_MARKER = "===";
const SECTION_START = "=== WHAT I WORKED ON";
const DEFAULT_ICON = "⭐";

const PROJECT_ICONS: Record<string, string> = {
  "Logged Out My Search": "🔍",
  "User Input in Smart Recs MCP": "🎯",
  "Pricing Histogram": "📊",
  "Referral System": "🔗",
  "New Algorithm for Sign-Up Recommendations": "🧭",
  "Suggested Outreach Supply Tasks": "📣",
  "Improving YC Map Page Speed": "⚡",
  "Mate Agent": "🤖",
};

export type WorkProject = { name: string; detail: string; icon: string };

function extractName(entry: string): string {
  const parenIndex = entry.indexOf("(");
  const colonIndex = entry.indexOf(":");
  const cutoff =
    parenIndex === -1
      ? colonIndex
      : colonIndex === -1
        ? parenIndex
        : Math.min(parenIndex, colonIndex);
  return (cutoff === -1 ? entry : entry.slice(0, cutoff)).trim();
}

/** Pulls a short HUD-readout line — a date range, or "IN PROGRESS" — out of the entry's parenthetical. */
function extractDetail(entry: string): string {
  const parenStart = entry.indexOf("(");
  if (parenStart === -1) return "";
  const parenEnd = entry.indexOf(")", parenStart);
  const inner = entry.slice(parenStart + 1, parenEnd === -1 ? undefined : parenEnd);
  if (/^in progress/i.test(inner.trim())) return "IN PROGRESS";
  return (inner.split(",")[0] ?? "").trim().toUpperCase();
}

function isInProgress(entry: string): boolean {
  const parenStart = entry.indexOf("(");
  if (parenStart === -1) return false;
  const parenEnd = entry.indexOf(")", parenStart);
  const inner = entry.slice(parenStart + 1, parenEnd === -1 ? undefined : parenEnd);
  return /^in progress/i.test(inner.trim());
}

/** Deterministically derives Wrapped card data from the "WHAT I WORKED ON" section — no LLM call needed. */
export function getWorkProjects(): WorkProject[] {
  const startIndex = KNOWLEDGE_BASE.findIndex((line) => line.startsWith(SECTION_START));
  if (startIndex === -1) return [];

  const entries: string[] = [];
  for (let i = startIndex + 1; i < KNOWLEDGE_BASE.length; i++) {
    const line = KNOWLEDGE_BASE[i];
    if (line.startsWith(SECTION_MARKER)) break;
    entries.push(line);
  }

  return entries.map((entry) => {
    const baseName = extractName(entry);
    const name = isInProgress(entry) ? `${baseName} (in progress)` : baseName;
    return { name, detail: extractDetail(entry), icon: PROJECT_ICONS[baseName] ?? DEFAULT_ICON };
  });
}
