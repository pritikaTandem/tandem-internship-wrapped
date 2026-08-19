"use client";

import { motion } from "framer-motion";

const BAR_DURATION = 0.7;
const LINE_DURATION = 0.5;
const TOTAL_DURATION = BAR_DURATION + LINE_DURATION;
const LINE_PEAK = BAR_DURATION / TOTAL_DURATION;

/**
 * Old-CRT power-off: the screen collapses to a thin bright horizontal line,
 * then that line shrinks to nothing. Purely a visual overlay — the real
 * desktop underneath doesn't actually unmount, it's just covered.
 */
export function PowerOffOverlay({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="fixed inset-0 z-50" aria-hidden="true">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0.5 }}
        transition={{ duration: BAR_DURATION, ease: "easeIn" }}
        style={{ transformOrigin: "top" }}
        className="absolute inset-0 bg-plum"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0.5 }}
        transition={{ duration: BAR_DURATION, ease: "easeIn" }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-0 bg-plum"
      />
      <motion.div
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.4, 1, 0] }}
        transition={{ duration: TOTAL_DURATION, times: [0, LINE_PEAK, 1], ease: "easeIn" }}
        onAnimationComplete={onComplete}
        style={{ transformOrigin: "center" }}
        className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-cream shadow-[0_0_12px_2px_rgba(255,249,233,0.8)]"
      />
    </div>
  );
}
