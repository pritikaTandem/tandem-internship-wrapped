"use client";

import { LearningsAgent } from "@/components/terminal/LearningsAgent";
import { WorkAgent } from "@/components/terminal/WorkAgent";
import { TOUCH_GRASS_WARNINGS, type AgentTab } from "@/constants/terminal";

function Command({ children }: { children: string }) {
  return (
    <p className="mb-3 text-cream/60">
      <span className="text-mint">$</span> {children}
    </p>
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
