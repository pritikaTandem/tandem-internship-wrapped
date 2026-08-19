"use client";

import { AgentTabContent } from "@/components/terminal/AgentTabContent";
import { AGENT_TABS, TERMINAL_PATH, type AgentTab } from "@/constants/terminal";
import { RESIZE_HANDLES, useResizableWindow } from "@/hooks/useResizableWindow";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";

const TRAFFIC_LIGHTS = [
  { action: "close", label: "Close window", color: "#ff5f57" },
  { action: "collapse", label: "Minimize window", color: "#febc2e" },
  { action: "maximize", label: "Maximize window", color: "#28c840" },
] as const;

export function WezTerm({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  onOpenPhotos,
  onOpenWrapped,
  zIndex,
  onFocus,
}: {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  onOpenPhotos: () => void;
  onOpenWrapped: () => void;
  zIndex: number;
  onFocus: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AgentTab>("work_agent");
  const [isMaximized, setIsMaximized] = useState(false);

  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { size, startResize, clampToViewport } = useResizableWindow({
    x,
    y,
    windowRef,
    centerOnMountWidth: 760,
  });

  const handleControl = (action: (typeof TRAFFIC_LIGHTS)[number]["action"]) => {
    if (action === "close") onClose();
    if (action === "collapse") onToggleCollapse();
    if (action === "maximize") setIsMaximized((current) => !current);
  };

  const startDrag = (event: PointerEvent<HTMLElement>) => {
    if (isMaximized) return;
    dragControls.start(event);
  };

  const isResizable = !isMaximized && !isCollapsed;

  return (
    <motion.section
      ref={windowRef}
      aria-label="Terminal"
      aria-hidden={!isOpen}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={clampToViewport}
      onPointerDownCapture={onFocus}
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.96 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={
        isMaximized
          ? { zIndex, pointerEvents: isOpen ? "auto" : "none" }
          : {
              x,
              y,
              width: size?.width,
              height: isCollapsed ? undefined : size?.height,
              zIndex,
              pointerEvents: isOpen ? "auto" : "none",
            }
      }
      className={`fixed flex flex-col border-2 border-pink bg-plum/95 shadow-pixel-lg backdrop-blur-md ${
        isMaximized
          ? "inset-x-4 bottom-28 top-14 sm:inset-x-16"
          : `left-0 top-0 ${size ? "" : "w-[min(760px,calc(100vw-2rem))]"} ${
              size || isCollapsed ? "" : "h-[min(540px,calc(100vh-190px))]"
            }`
      }`}
    >
      <header
        onPointerDown={startDrag}
        className={`flex shrink-0 items-center gap-3 border-b-2 border-pink/70 bg-plum px-3 py-2 ${
          isMaximized ? "" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex items-center gap-2">
          {TRAFFIC_LIGHTS.map(({ action, label, color }) => (
            <button
              key={action}
              type="button"
              aria-label={label}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => handleControl(action)}
              className="size-3 rounded-full border border-plum/60 transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <h2 className="truncate font-pixel text-[8px] text-cream/80 sm:text-[9px]">
          {TERMINAL_PATH}
        </h2>
      </header>

      <div className={isCollapsed ? "hidden" : "contents"}>
        <div
          role="tablist"
          aria-label="Agent tabs"
          className="flex shrink-0 border-b-2 border-pink/40 bg-plum/80"
        >
          {AGENT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 border-r border-pink/25 px-2 py-2 font-mono text-[10px] transition-colors last:border-r-0 sm:text-[11px] ${
                activeTab === tab.id
                  ? "bg-pink/15 text-pink"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="min-h-0 flex-1 overflow-y-auto p-4 font-mono text-xs leading-6 sm:text-sm"
        >
          <AgentTabContent
            activeTab={activeTab}
            onOpenPhotos={onOpenPhotos}
            onOpenWrapped={onOpenWrapped}
          />
        </div>
      </div>

      {isResizable &&
        RESIZE_HANDLES.map(({ direction, className }) => (
          <div
            key={direction}
            onPointerDown={(event) => startResize(direction, event)}
            className={`absolute z-10 ${className}`}
          />
        ))}
    </motion.section>
  );
}
