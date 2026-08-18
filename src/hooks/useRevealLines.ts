"use client";

import { useEffect, useState } from "react";

/** Reveals one line at a time so tool-call traces feel like a live terminal. */
export function useRevealLines(lines: readonly string[], stepMs = 650): number {
  const [count, setCount] = useState(lines.length === 0 ? 0 : 1);

  useEffect(() => {
    if (lines.length === 0) return;

    const interval = window.setInterval(() => {
      setCount((current) => {
        if (current + 1 >= lines.length) window.clearInterval(interval);
        return Math.min(current + 1, lines.length);
      });
    }, stepMs);

    return () => window.clearInterval(interval);
  }, [lines, stepMs]);

  return Math.min(count, lines.length);
}
