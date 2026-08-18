"use client";

import { AgentTabContent } from "@/components/terminal/AgentTabContent";
import { AGENT_TABS, TERMINAL_PATH, type AgentTab } from "@/constants/terminal";
import {
  useResizableWindow,
  type ResizeDirection,
} from "@/hooks/useResizableWindow";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";

const TRAFFIC_LIGHTS = [
  { action: "close", label: "Close window", color: "#ff5f57" },
  { action: "collapse", label: "Minimize window", color: "#febc2e" },
  { action: "maximize", label: "Maximize window", color: "#28c840" },
] as const;

const RESIZE_HANDLES: ReadonlyArray<{
  direction: ResizeDirection;
  className: string;
}> = [
  { direction: "n", className: "left-2 right-2 top-0 h-1.5 cursor-ns-resize" },
  { direction: "s", className: "bottom-0 left-2 right-2 h-1.5 cursor-ns-resize" },
  { direction: "w", className: "bottom-2 left-0 top-2 w-1.5 cursor-ew-resize" },
  { direction: "e", className: "bottom-2 right-0 top-2 w-1.5 cursor-ew-resize" },
  { direction: "nw", className: "left-0 top-0 size-3 cursor-nwse-resize" },
  { direction: "ne", className: "right-0 top-0 size-3 cursor-nesw-resize" },
  { direction: "sw", className: "bottom-0 left-0 size-3 cursor-nesw-resize" },
  { direction: "se", className: "bottom-0 right-0 size-3 cursor-nwse-resize" },
];

export function WezTerm({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AgentTab>("work_agent");
  const [isMaximized, setIsMaximized] = useState(false);

  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { size, startResize } = useResizableWindow({ x, y, windowRef });

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
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={windowRef}
          aria-label="Terminal"
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={
            isMaximized
              ? undefined
              : {
                  x,
                  y,
                  width: size?.width,
                  height: isCollapsed ? undefined : size?.height,
                }
          }
          className={`fixed z-50 flex flex-col border-2 border-pink bg-plum/95 shadow-pixel-lg backdrop-blur-md ${
            isMaximized
              ? "inset-x-4 bottom-28 top-14 sm:inset-x-16"
              : `left-0 top-0 ${size ? "" : "w-[min(620px,calc(100vw-2rem))]"} ${
                  size || isCollapsed ? "" : "h-[min(440px,calc(100vh-190px))]"
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

          {!isCollapsed && (
            <>
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
                className="min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-6 sm:text-xs"
              >
                <AgentTabContent activeTab={activeTab} onTouchGrass={onClose} />
              </div>
            </>
          )}

          {isResizable &&
            RESIZE_HANDLES.map(({ direction, className }) => (
              <div
                key={direction}
                onPointerDown={(event) => startResize(direction, event)}
                className={`absolute z-10 ${className}`}
              />
            ))}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
