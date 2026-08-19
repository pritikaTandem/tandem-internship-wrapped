import { KNOWLEDGE_BASE } from "@/data/knowledge_base";

const SECTION_MARKER = "===";
const SECTION_START = "=== WHAT I LEARNED";
const EXPECTATION_PREFIX = "Expectation going in:";
const REALITY_PREFIX = "Reality:";

export type RealityPair = { expectation: string; reality: string };

function stripPrefix(line: string, prefix: string): string {
  return line.slice(prefix.length).trim();
}

/**
 * Deterministically pulls the strict expectation/reality pairs out of the
 * "WHAT I LEARNED" section — stops at the first line that breaks the
 * alternating pattern, since the section also has extra unpaired "Reality:"
 * and "Lesson:" bullets after the pairs that aren't part of the scrapbook.
 */
export function getRealityPairs(): RealityPair[] {
  const startIndex = KNOWLEDGE_BASE.findIndex((line) => line.startsWith(SECTION_START));
  if (startIndex === -1) return [];

  const pairs: RealityPair[] = [];
  for (let i = startIndex + 1; i + 1 < KNOWLEDGE_BASE.length; i += 2) {
    const expectationLine = KNOWLEDGE_BASE[i];
    const realityLine = KNOWLEDGE_BASE[i + 1];
    if (expectationLine.startsWith(SECTION_MARKER)) break;
    if (!expectationLine.startsWith(EXPECTATION_PREFIX) || !realityLine.startsWith(REALITY_PREFIX)) {
      break;
    }
    pairs.push({
      expectation: stripPrefix(expectationLine, EXPECTATION_PREFIX),
      reality: stripPrefix(realityLine, REALITY_PREFIX),
    });
  }

  return pairs;
}
