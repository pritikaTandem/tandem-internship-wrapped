"use client";

import { WorkAgent } from "@/components/terminal/WorkAgent";
import {
  LEARNINGS_DIFF,
  TOUCH_GRASS_WARNINGS,
  type AgentTab,
  type DiffLine,
} from "@/constants/terminal";

function Command({ children }: { children: string }) {
  return (
    <p className="mb-3 text-cream/60">
      <span className="text-mint">$</span> {children}
    </p>
  );
}

const DIFF_STYLES: Record<DiffLine["kind"], string> = {
  meta: "text-cream/45",
  hunk: "text-purple",
  removed: "text-pink",
  added: "text-mint",
  context: "text-cream/60",
};

function LearningsAgent() {
  return (
    <div className="space-y-4">
      <Command>git diff expectation..reality</Command>

      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-6">
        {LEARNINGS_DIFF.map((line) => (
          <span key={line.text} className={`block ${DIFF_STYLES[line.kind]}`}>
            {line.text}
          </span>
        ))}
      </pre>
    </div>
  );
}

function TouchGrassAgent({ onTouchGrass }: { onTouchGrass: () => void }) {
  return (
    <div className="space-y-4">
      <Command>touch-grass --status</Command>

      {TOUCH_GRASS_WARNINGS.map((warning) => (
        <p key={warning} className="text-pink">
          {warning}
        </p>
      ))}

      <p className="text-cream/70">
        recommendation: close the laptop. the sun is still up.
      </p>

      <button
        type="button"
        onClick={onTouchGrass}
        className="border-2 border-plum bg-mint px-4 py-2.5 font-pixel text-[9px] uppercase tracking-wide text-plum shadow-[3px_3px_0_#1a1625] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
      >
        Close WezTerm &amp; Touch Grass 🌱
      </button>
    </div>
  );
}

export function AgentTabContent({
  activeTab,
  onTouchGrass,
}: {
  activeTab: AgentTab;
  onTouchGrass: () => void;
}) {
  if (activeTab === "work_agent") return <WorkAgent />;
  if (activeTab === "learnings_agent") return <LearningsAgent />;
  return <TouchGrassAgent onTouchGrass={onTouchGrass} />;
}
