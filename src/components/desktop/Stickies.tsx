"use client";

import { motion, useDragControls } from "framer-motion";
import type { PointerEvent } from "react";

const TASKS = [
  { label: "Move to SF with hopes, dreams & a bucket list", complete: true },
  { label: "SWE intern @ Tandem", complete: true },
  { label: "Final intern presentation", complete: false },
] as const;

export function Stickies() {
  const dragControls = useDragControls();
  const startDrag = (event: PointerEvent<HTMLElement>) =>
    dragControls.start(event);

  return (
    <motion.section
      aria-labelledby="stickies-title"
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, x: -12, y: -8, rotate: -3 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: -1 }}
      whileDrag={{ rotate: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-[min(21.5rem,calc(100vw-2rem))] overflow-hidden border-2 border-plum text-plum shadow-pixel-lg"
    >
      <header
        onPointerDown={startDrag}
        className="flex h-8 cursor-grab items-center justify-between border-b-2 border-plum bg-pink px-3 active:cursor-grabbing"
      >
        <h1
          id="stickies-title"
          className="font-pixel text-[9px] font-bold uppercase tracking-wide"
        >
          Stickies - summer.txt
        </h1>
        <span aria-hidden="true" className="flex gap-1">
          <i className="size-2 border border-plum bg-mint" />
          <i className="size-2 border border-plum bg-purple" />
        </span>
      </header>

      <ul className="space-y-3 bg-[#fff2a8]/95 p-5 font-mono text-[11px] leading-5 sm:text-xs">
        {TASKS.map((task) => (
          <li key={task.label} className="flex items-start gap-2">
            <span aria-hidden="true" className="font-bold">
              [{task.complete ? "X" : " "}]
            </span>
            <span
              className={
                task.complete ? "line-through decoration-pink decoration-2" : ""
              }
            >
              {task.label}
            </span>
          </li>
        ))}
      </ul>

      <footer className="border-t-2 border-dashed border-plum/35 bg-[#ffd7dc]/95 px-3 py-2 text-right font-pixel text-[7px] uppercase tracking-[0.2em]">
        one summer, all of it
      </footer>
    </motion.section>
  );
}
