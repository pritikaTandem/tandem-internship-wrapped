"use client";

import {
  RESIZE_HANDLES,
  useCenteredMotionValues,
  useResizableWindow,
} from "@/hooks/useResizableWindow";
import { getWorkProjects, type WorkProject } from "@/lib/work-projects";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type Card =
  | { kind: "title" }
  | { kind: "project"; project: WorkProject; level: number; total: number }
  | { kind: "closing" };

const CARD_COLORS = ["bg-pink", "bg-mint", "bg-purple"];

function buildCards(projects: WorkProject[]): Card[] {
  return [
    { kind: "title" },
    ...projects.map(
      (project, i): Card => ({ kind: "project", project, level: i + 1, total: projects.length }),
    ),
    { kind: "closing" },
  ];
}

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction >= 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? -40 : 40, opacity: 0 }),
};

export function WrappedWindow({
  isOpen,
  onClose,
  onFinished,
  zIndex,
  onFocus,
}: {
  isOpen: boolean;
  onClose: () => void;
  /** Fires when advancing past the closing card, so the presenter can hand off hands-free. */
  onFinished: () => void;
  zIndex: number;
  onFocus: () => void;
}) {
  const cards = useMemo(() => buildCards(getWorkProjects()), []);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const { x, y } = useCenteredMotionValues(380);
  const { size, startResize, clampToViewport } = useResizableWindow({ x, y, windowRef });

  const canGoPrev = index > 0;
  const canGoNext = index < cards.length - 1;
  const goPrev = () => {
    if (!canGoPrev) return;
    setDirection(-1);
    setIndex((current) => current - 1);
  };
  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setIndex((current) => current + 1);
    } else if (index === cards.length - 1) {
      onFinished();
    }
  };

  const startDrag = (event: PointerEvent<HTMLElement>) => dragControls.start(event);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index]);

  const card = cards[index];
  const cardColor = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={windowRef}
          aria-label="Wrapped"
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={clampToViewport}
          onPointerDownCapture={onFocus}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ x, y, width: size?.width, height: size?.height, zIndex }}
          className={`fixed left-0 top-0 flex flex-col border-2 border-purple bg-plum shadow-pixel-lg ${
            size ? "" : "w-[min(380px,calc(100vw-2rem))]"
          } ${size ? "" : "h-[min(620px,calc(100vh-140px))]"}`}
        >
          <header
            onPointerDown={startDrag}
            className="flex shrink-0 cursor-grab items-center gap-3 border-b-2 border-purple/70 bg-plum px-3 py-2 active:cursor-grabbing"
          >
            <button
              type="button"
              aria-label="Close window"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onClose}
              className="size-3 rounded-full border border-plum/60 bg-[#ff5f57] transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
            />
            <h2 className="truncate font-pixel text-[8px] text-cream/80">
              ~/Wrapped/summer.rom
            </h2>
          </header>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={index}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center ${
                  card.kind === "project" ? cardColor : "bg-plum"
                }`}
              >
                {card.kind === "title" && (
                  <>
                    <p className="font-wrapped text-4xl font-extrabold leading-none text-cream">
                      TANDEM
                      <br />
                      SUMMER
                    </p>
                    <p className="font-wrapped text-xl font-extrabold text-pink">PROJECTS</p>
                    <p className="animate-pulse font-mono text-[10px] uppercase tracking-wide text-cream/50">
                      click to start
                    </p>
                  </>
                )}

                {card.kind === "project" && (
                  <>
                    <p className="font-wrapped text-5xl font-extrabold leading-none text-plum/70">
                      #{String(card.level).padStart(2, "0")}
                    </p>
                    <p className="text-6xl">{card.project.icon}</p>
                    <p className="font-wrapped text-2xl font-extrabold leading-tight text-plum">
                      {card.project.name}
                    </p>
                  </>
                )}

                {card.kind === "closing" && (
                  <p className="font-wrapped text-3xl font-extrabold text-mint">
                    ...and much more! 🌱
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex gap-1">
              {cards.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`h-1 flex-1 rounded-full ${
                    dotIndex <= index ? "bg-cream" : "bg-cream/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Previous card"
              disabled={!canGoPrev}
              onClick={goPrev}
              className="absolute inset-y-0 left-0 z-30 w-1/2 cursor-pointer disabled:cursor-default"
            />
            <button
              type="button"
              aria-label="Next card"
              disabled={!canGoNext}
              onClick={goNext}
              className="absolute inset-y-0 right-0 z-30 w-1/2 cursor-pointer disabled:cursor-default"
            />
          </div>

          {RESIZE_HANDLES.map(({ direction, className }) => (
            <div
              key={direction}
              onPointerDown={(event) => startResize(direction, event)}
              className={`absolute z-10 ${className}`}
            />
          ))}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
