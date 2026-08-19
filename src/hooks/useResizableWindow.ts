"use client";

import { useMotionValue, type MotionValue } from "framer-motion";
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

/** How much of the window must stay reachable so its header never disappears off-screen. */
const MIN_VISIBLE_X = 80;
const MIN_VISIBLE_Y = 40;

/**
 * Creates the x/y motion values for a draggable window, pre-centered at
 * creation time — synchronously, from `defaultWidth`, not via an effect that
 * waits for the element to exist in the DOM. Windows here mount conditionally
 * (`{isOpen && <motion.section>}`), so on a window that starts closed,
 * `isOpen` is still false on the very first render and any ref-dependent
 * effect has nothing to attach to yet; relying on that effect to fire again
 * later has proven unreliable, so centering doesn't depend on it at all.
 */
export function useCenteredMotionValues(defaultWidth: number) {
  const initialX =
    typeof window === "undefined"
      ? 0
      : Math.max(16, (window.innerWidth - Math.min(defaultWidth, window.innerWidth - 32)) / 2);
  const initialY = typeof window === "undefined" ? 0 : Math.max(56, window.innerHeight * 0.16);
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  return { x, y };
}

/**
 * Drag-to-resize from any edge or corner. Size stays `null` until the first
 * resize so CSS owns the default dimensions; west/north edges also shift the
 * offset so the opposite edge stays anchored, like a native window.
 */
export function useResizableWindow({
  x,
  y,
  windowRef,
  centerOnMountWidth,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  windowRef: RefObject<HTMLElement | null>;
  /**
   * Only pass this for windows that are ALWAYS mounted (not gated behind
   * `{isOpen && <motion.section>}`) — e.g. the terminal, which stays mounted
   * for tab-content persistence and just toggles opacity. For those, the ref
   * is guaranteed to exist right after mount, so a one-time effect safely
   * centers `x`/`y` post-hydration (avoiding the SSR/client mismatch that
   * `useCenteredMotionValues`'s synchronous `window`-read would cause on an
   * always-rendered element). Conditionally-mounted windows should leave this
   * unset and use `useCenteredMotionValues` instead — for them, the element
   * doesn't exist yet on mount, and this effect has no dependency that would
   * make it try again later.
   */
  centerOnMountWidth?: number;
}) {
  const [size, setSize] = useState<Size | null>(null);
  const session = useRef<ResizeSession | null>(null);
  const hasCenteredOnMount = useRef(false);

  useLayoutEffect(() => {
    if (centerOnMountWidth === undefined || hasCenteredOnMount.current) return;
    const element = windowRef.current;
    if (!element) return;

    hasCenteredOnMount.current = true;
    const width = Math.min(centerOnMountWidth, window.innerWidth - 32);
    x.set(Math.max(16, (window.innerWidth - width) / 2));
    y.set(Math.max(56, window.innerHeight * 0.16));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keeps the window (specifically its header, the only drag handle) from
  // ever being dragged or resized fully off-screen — with nothing grabbable
  // left in view, there'd be no way to bring it back.
  const clampToViewport = useCallback(() => {
    const width = windowRef.current?.getBoundingClientRect().width ?? MIN_WIDTH;
    const maxX = window.innerWidth - MIN_VISIBLE_X;
    const minX = MIN_VISIBLE_X - width;
    const maxY = window.innerHeight - MIN_VISIBLE_Y;
    x.set(Math.min(Math.max(x.get(), minX), maxX));
    y.set(Math.min(Math.max(y.get(), 0), maxY));
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
        clampToViewport();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [windowRef, x, y, clampToViewport],
  );

  return { size, startResize, clampToViewport };
}
