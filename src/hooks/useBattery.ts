"use client";

import { useEffect, useState } from "react";

type BatteryManager = EventTarget & {
  level: number;
  charging: boolean;
};

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManager>;
};

export type BatteryStatus = {
  /** Whole-number percentage, or `null` when the browser exposes no battery. */
  percent: number | null;
  charging: boolean;
  supported: boolean;
};

const UNSUPPORTED: BatteryStatus = {
  percent: null,
  charging: false,
  supported: false,
};

export function useBattery(): BatteryStatus {
  const [status, setStatus] = useState<BatteryStatus>(UNSUPPORTED);

  useEffect(() => {
    const getBattery = (navigator as NavigatorWithBattery).getBattery;
    if (!getBattery) return;

    let battery: BatteryManager | undefined;
    let cancelled = false;

    const sync = () => {
      if (!battery) return;
      setStatus({
        percent: Math.round(battery.level * 100),
        charging: battery.charging,
        supported: true,
      });
    };

    getBattery.call(navigator).then((result) => {
      if (cancelled) return;
      battery = result;
      sync();
      battery.addEventListener("levelchange", sync);
      battery.addEventListener("chargingchange", sync);
    });

    return () => {
      cancelled = true;
      battery?.removeEventListener("levelchange", sync);
      battery?.removeEventListener("chargingchange", sync);
    };
  }, []);

  return status;
}
