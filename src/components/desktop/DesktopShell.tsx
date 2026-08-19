"use client";

import { Dock } from "@/components/desktop/Dock";
import { PhotosWindow } from "@/components/desktop/PhotosWindow";
import { WezTerm } from "@/components/terminal/WezTerm";
import { useState } from "react";

type FrontWindow = "terminal" | "photos";

export function DesktopShell() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [frontWindow, setFrontWindow] = useState<FrontWindow>("terminal");

  const toggleTerminal = () => {
    setIsTerminalOpen((open) => !open);
    // Reopening from the dock should always show the full window.
    setIsTerminalCollapsed(false);
    setFrontWindow("terminal");
  };

  const openPhotos = () => {
    setIsPhotosOpen(true);
    setFrontWindow("photos");
  };

  return (
    <>
      <WezTerm
        isOpen={isTerminalOpen}
        isCollapsed={isTerminalCollapsed}
        onClose={() => setIsTerminalOpen(false)}
        onToggleCollapse={() => setIsTerminalCollapsed((current) => !current)}
        onOpenPhotos={openPhotos}
        zIndex={frontWindow === "terminal" ? 50 : 40}
        onFocus={() => setFrontWindow("terminal")}
      />
      <PhotosWindow
        isOpen={isPhotosOpen}
        onClose={() => setIsPhotosOpen(false)}
        zIndex={frontWindow === "photos" ? 50 : 40}
        onFocus={() => setFrontWindow("photos")}
      />
      <Dock isTerminalOpen={isTerminalOpen} onToggleTerminal={toggleTerminal} />
    </>
  );
}
