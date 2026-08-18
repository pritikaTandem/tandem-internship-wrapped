"use client";

import { useEffect, useState } from "react";

/** Returns the current time, or `null` until the client mounts (avoids hydration mismatch). */
export function useClock(intervalMs = 1_000): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const interval = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return now;
}
