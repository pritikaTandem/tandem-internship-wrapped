"use client";

import { Dock } from "@/components/desktop/Dock";
import { WezTerm } from "@/components/terminal/WezTerm";
import { useState } from "react";

export function DesktopShell() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  const toggleTerminal = () => {
    setIsTerminalOpen((open) => !open);
    // Reopening from the dock should always show the full window.
    setIsTerminalCollapsed(false);
  };

  return (
    <>
      <WezTerm
        isOpen={isTerminalOpen}
        isCollapsed={isTerminalCollapsed}
        onClose={() => setIsTerminalOpen(false)}
        onToggleCollapse={() => setIsTerminalCollapsed((current) => !current)}
      />
      <Dock isTerminalOpen={isTerminalOpen} onToggleTerminal={toggleTerminal} />
    </>
  );
}
