"use client";

import { useBattery } from "@/hooks/useBattery";
import { useClock } from "@/hooks/useClock";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  AudioLines,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Wifi,
  WifiOff,
} from "lucide-react";

const CLOCK_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const MENU_ITEMS = ["File", "Edit", "View", "Window", "Help"] as const;

function BatteryGlyph({
  percent,
  charging,
  className,
}: {
  percent: number;
  charging: boolean;
  className: string;
}) {
  if (charging) return <BatteryCharging aria-hidden="true" className={className} />;
  if (percent <= 20) return <BatteryLow aria-hidden="true" className={className} />;
  if (percent <= 60) return <BatteryMedium aria-hidden="true" className={className} />;
  return <BatteryFull aria-hidden="true" className={className} />;
}

function NetworkGlyph({ online }: { online: boolean }) {
  return online ? (
    <Wifi aria-label="Online" className="size-3.5" />
  ) : (
    <WifiOff aria-label="Offline" className="size-3.5 text-pink" />
  );
}

export function TopMenuBar() {
  const now = useClock();
  const battery = useBattery();
  const online = useNetworkStatus();

  return (
    <header className="menu-glass fixed inset-x-0 top-0 z-40 flex h-9 items-center justify-between border-b-2 border-plum/80 px-3 font-pixel text-[9px] text-cream shadow-pixel sm:px-5 sm:text-[10px]">
      <nav aria-label="Application menu" className="flex items-center gap-3 sm:gap-5">
        <span aria-hidden="true" className="text-base leading-none">
          🐾
        </span>
        {MENU_ITEMS.map((item, index) => (
          <span
            key={item}
            className={`text-cream/90 transition-colors hover:text-pink ${
              index === 0 ? "font-bold text-cream" : "hidden sm:inline"
            }`}
          >
            {item}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 sm:gap-3.5" aria-label="System status">
        <AudioLines aria-label="Audio active" className="size-3.5 text-mint" />

        <NetworkGlyph online={online} />

        {battery.percent !== null && (
          <span
            className="flex items-center gap-1"
            aria-label={`Battery ${battery.percent}%${battery.charging ? ", charging" : ""}`}
          >
            <BatteryGlyph
              percent={battery.percent}
              charging={battery.charging}
              className={`size-4 ${battery.percent <= 20 ? "text-pink" : "text-mint"}`}
            />
            <span>{battery.percent}%</span>
          </span>
        )}

        <time className="min-w-[8.5rem] text-right" dateTime={now?.toISOString()}>
          {now ? CLOCK_FORMATTER.format(now) : "—"}
        </time>
      </div>
    </header>
  );
}
