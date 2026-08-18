"use client";

import { DOCK_ITEMS } from "@/constants/desktop";

export function Dock({
  isTerminalOpen,
  onToggleTerminal,
}: {
  isTerminalOpen: boolean;
  onToggleTerminal: () => void;
}) {
  return (
    <nav
      aria-label="Desktop applications"
      className="dock-glass fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-end gap-1.5 border-2 border-plum/80 p-2 shadow-pixel-lg sm:bottom-6 sm:gap-2 sm:p-2.5"
    >
      {DOCK_ITEMS.map(({ id, label, icon: Icon, accent, iconClassName }) => {
        const tile = (
          <span
            className="grid size-11 place-items-center border-2 border-plum shadow-[2px_2px_0_#1a1625] transition-transform group-hover:scale-110 sm:size-12"
            style={{ backgroundColor: accent }}
          >
            <Icon
              aria-hidden="true"
              className={`size-5 sm:size-6 ${iconClassName ?? "text-plum"}`}
              strokeWidth={2.5}
            />
          </span>
        );

        return (
          <div key={id} className="group relative flex flex-col items-center">
            <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-plum bg-cream px-2 py-1 font-pixel text-[8px] text-plum shadow-[2px_2px_0_#1a1625] group-hover:block">
              {label}
            </span>

            {id === "terminal" ? (
              <button
                type="button"
                onClick={onToggleTerminal}
                aria-pressed={isTerminalOpen}
                aria-label={isTerminalOpen ? "Hide terminal" : "Open terminal"}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
              >
                {tile}
              </button>
            ) : (
              <div>
                {tile}
                <span className="sr-only">{label}</span>
              </div>
            )}

            <span
              aria-hidden="true"
              className={`mt-1 size-1 rounded-full ${
                id === "terminal" && isTerminalOpen ? "bg-mint" : "bg-transparent"
              }`}
            />
          </div>
        );
      })}
    </nav>
  );
}
