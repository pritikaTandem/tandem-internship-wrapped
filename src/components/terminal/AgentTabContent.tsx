"use client";

import { RealityCheckAgent } from "@/components/terminal/RealityCheckAgent";
import { TouchGrassAgent } from "@/components/terminal/TouchGrassAgent";
import { WorkAgent } from "@/components/terminal/WorkAgent";
import { type AgentTab } from "@/constants/terminal";

/**
 * Keeps all three tabs mounted (just hidden) so switching tabs doesn't wipe
 * out conversation history — unmounting would reset each tab's own state.
 */
export function AgentTabContent({
  activeTab,
  onOpenPhotos,
}: {
  activeTab: AgentTab;
  onOpenPhotos: () => void;
}) {
  return (
    <>
      <div className={activeTab === "work_agent" ? "h-full" : "hidden"}>
        <WorkAgent active={activeTab === "work_agent"} />
      </div>
      <div className={activeTab === "reality_check_agent" ? "h-full" : "hidden"}>
        <RealityCheckAgent active={activeTab === "reality_check_agent"} />
      </div>
      <div className={activeTab === "touch_grass_agent" ? "h-full" : "hidden"}>
        <TouchGrassAgent
          active={activeTab === "touch_grass_agent"}
          onOpenPhotos={onOpenPhotos}
        />
      </div>
    </>
  );
}
