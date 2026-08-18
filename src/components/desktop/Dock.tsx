"use client";

import { DOCK_ITEMS } from "@/constants/desktop";

export function Dock() {
  return (
    <nav
      aria-label="Desktop applications"
      className="dock-glass fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-end gap-1.5 border-2 border-plum/80 p-2 shadow-pixel-lg sm:bottom-6 sm:gap-2 sm:p-2.5"
    >
      {DOCK_ITEMS.map(({ label, icon: Icon, accent, iconClassName }) => (
        <div key={label} className="group relative">
          <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-plum bg-cream px-2 py-1 font-pixel text-[8px] text-plum shadow-[2px_2px_0_#1a1625] group-hover:block">
            {label}
          </span>
          <div
            className="grid size-11 place-items-center border-2 border-plum shadow-[2px_2px_0_#1a1625] transition-transform hover:scale-110 sm:size-12"
            style={{ backgroundColor: accent }}
          >
            <Icon
              aria-hidden="true"
              className={`size-5 sm:size-6 ${iconClassName ?? "text-plum"}`}
              strokeWidth={2.5}
            />
            <span className="sr-only">{label}</span>
          </div>
        </div>
      ))}
    </nav>
  );
}
