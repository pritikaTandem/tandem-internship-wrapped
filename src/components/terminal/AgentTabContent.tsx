"use client";

import { RealityCheckAgent } from "@/components/terminal/RealityCheckAgent";
import { TouchGrassAgent } from "@/components/terminal/TouchGrassAgent";
import { WorkAgent } from "@/components/terminal/WorkAgent";
import { type AgentTab } from "@/constants/terminal";

export function AgentTabContent({
  activeTab,
  onOpenPhotos,
}: {
  activeTab: AgentTab;
  onOpenPhotos: () => void;
}) {
  if (activeTab === "work_agent") return <WorkAgent />;
  if (activeTab === "reality_check_agent") return <RealityCheckAgent />;
  return <TouchGrassAgent onOpenPhotos={onOpenPhotos} />;
}
