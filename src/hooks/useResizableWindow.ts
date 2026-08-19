"use client";

import type { MotionValue } from "framer-motion";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** Shared hit-target layout for the resize handles rendered around a window's edges. */
export const RESIZE_HANDLES: ReadonlyArray<{
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

type Size = { width: number; height: number };

type ResizeSession = Size & {
  direction: ResizeDirection;
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
};

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;

/**
 * Drag-to-resize from any edge or corner. Size stays `null` until the first
 * resize so CSS owns the default dimensions; west/north edges also shift the
 * offset so the opposite edge stays anchored, like a native window.
 */
export function useResizableWindow({
  x,
  y,
  windowRef,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  windowRef: RefObject<HTMLElement | null>;
}) {
  const [size, setSize] = useState<Size | null>(null);
  const session = useRef<ResizeSession | null>(null);

  // Center the window on first paint, before the user sees it at the origin.
  useLayoutEffect(() => {
    const element = windowRef.current;
    if (!element) return;

    const { width } = element.getBoundingClientRect();
    x.set(Math.max(16, (window.innerWidth - width) / 2));
    y.set(Math.max(56, window.innerHeight * 0.16));
  }, [windowRef, x, y]);

  const startResize = useCallback(
    (direction: ResizeDirection, event: PointerEvent<HTMLElement>) => {
      const element = windowRef.current;
      if (!element) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = element.getBoundingClientRect();
      session.current = {
        direction,
        pointerX: event.clientX,
        pointerY: event.clientY,
        width: rect.width,
        height: rect.height,
        x: x.get(),
        y: y.get(),
      };

      const onPointerMove = (move: globalThis.PointerEvent) => {
        const active = session.current;
        if (!active) return;

        const deltaX = move.clientX - active.pointerX;
        const deltaY = move.clientY - active.pointerY;
        let { width, height } = active;

        if (active.direction.includes("e")) {
          width = Math.max(MIN_WIDTH, active.width + deltaX);
        }
        if (active.direction.includes("w")) {
          width = Math.max(MIN_WIDTH, active.width - deltaX);
          x.set(active.x + (active.width - width));
        }
        if (active.direction.includes("s")) {
          height = Math.max(MIN_HEIGHT, active.height + deltaY);
        }
        if (active.direction.includes("n")) {
          height = Math.max(MIN_HEIGHT, active.height - deltaY);
          y.set(active.y + (active.height - height));
        }

        setSize({ width, height });
      };

      const onPointerUp = () => {
        session.current = null;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [windowRef, x, y],
  );

  return { size, startResize };
}
