"use client";

import { Dock } from "@/components/desktop/Dock";
import { NotebookWindow } from "@/components/desktop/NotebookWindow";
import { PhotosWindow } from "@/components/desktop/PhotosWindow";
import { WrappedWindow } from "@/components/desktop/WrappedWindow";
import { WezTerm } from "@/components/terminal/WezTerm";
import { type AgentTab } from "@/constants/terminal";
import { useState } from "react";

type WindowName = "terminal" | "photos" | "wrapped" | "notebook";

export function DesktopShell({ onFinale }: { onFinale: () => void }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<AgentTab>("work_agent");
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [zIndices, setZIndices] = useState<Record<WindowName, number>>({
    terminal: 30,
    photos: 20,
    wrapped: 10,
    notebook: 10,
  });

  const bringToFront = (name: WindowName) => {
    setZIndices((current) => {
      const maxZ = Math.max(...Object.values(current));
      if (current[name] === maxZ) return current;
      return { ...current, [name]: maxZ + 1 };
    });
  };

  const toggleTerminal = () => {
    setIsTerminalOpen((open) => !open);
    // Reopening from the dock should always show the full window.
    setIsTerminalCollapsed(false);
    bringToFront("terminal");
  };

  const openPhotos = () => {
    setIsPhotosOpen(true);
    bringToFront("photos");
  };

  const openWrapped = () => {
    setIsWrappedOpen(true);
    bringToFront("wrapped");
  };

  const openNotebook = () => {
    setIsNotebookOpen(true);
    bringToFront("notebook");
  };

  // Pressing the right arrow key past Wrapped's closing card hands off to
  // the next agent tab, the same way advancing past Notebook's last page does.
  const finishWrapped = () => {
    setIsWrappedOpen(false);
    setActiveTab("reality_check_agent");
    setIsTerminalCollapsed(false);
    bringToFront("terminal");
  };

  // Pressing the right arrow key past the Notebook's last page hands off to
  // the next agent tab, the same way advancing past Wrapped's last card does.
  const finishNotebook = () => {
    setIsNotebookOpen(false);
    setActiveTab("touch_grass_agent");
    setIsTerminalCollapsed(false);
    bringToFront("terminal");
  };

  // Photos is the last agent tab — advancing past the last photo closes it
  // and hands off to the desktop-level finale instead of another tab.
  const finishPhotos = () => {
    setIsPhotosOpen(false);
    onFinale();
  };

  return (
    <>
      <WezTerm
        isOpen={isTerminalOpen}
        isCollapsed={isTerminalCollapsed}
        onClose={() => setIsTerminalOpen(false)}
        onToggleCollapse={() => setIsTerminalCollapsed((current) => !current)}
        onOpenPhotos={openPhotos}
        onOpenWrapped={openWrapped}
        onOpenNotebook={openNotebook}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        zIndex={zIndices.terminal}
        onFocus={() => bringToFront("terminal")}
      />
      <PhotosWindow
        isOpen={isPhotosOpen}
        onClose={() => setIsPhotosOpen(false)}
        onFinished={finishPhotos}
        zIndex={zIndices.photos}
        onFocus={() => bringToFront("photos")}
      />
      <WrappedWindow
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        onFinished={finishWrapped}
        zIndex={zIndices.wrapped}
        onFocus={() => bringToFront("wrapped")}
      />
      <NotebookWindow
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        onFinished={finishNotebook}
        zIndex={zIndices.notebook}
        onFocus={() => bringToFront("notebook")}
      />
      <Dock isTerminalOpen={isTerminalOpen} onToggleTerminal={toggleTerminal} />
    </>
  );
}
