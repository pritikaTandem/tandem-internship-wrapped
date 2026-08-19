"use client";

import { Dock } from "@/components/desktop/Dock";
import { NotebookWindow } from "@/components/desktop/NotebookWindow";
import { PhotosWindow } from "@/components/desktop/PhotosWindow";
import { WrappedWindow } from "@/components/desktop/WrappedWindow";
import { WezTerm } from "@/components/terminal/WezTerm";
import { useState } from "react";

type WindowName = "terminal" | "photos" | "wrapped" | "notebook";

export function DesktopShell() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
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
        zIndex={zIndices.terminal}
        onFocus={() => bringToFront("terminal")}
      />
      <PhotosWindow
        isOpen={isPhotosOpen}
        onClose={() => setIsPhotosOpen(false)}
        zIndex={zIndices.photos}
        onFocus={() => bringToFront("photos")}
      />
      <WrappedWindow
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        zIndex={zIndices.wrapped}
        onFocus={() => bringToFront("wrapped")}
      />
      <NotebookWindow
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        zIndex={zIndices.notebook}
        onFocus={() => bringToFront("notebook")}
      />
      <Dock isTerminalOpen={isTerminalOpen} onToggleTerminal={toggleTerminal} />
    </>
  );
}
