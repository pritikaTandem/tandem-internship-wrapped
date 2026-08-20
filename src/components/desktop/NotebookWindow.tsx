"use client";

import { RESIZE_HANDLES, useCenteredMotionValues, useResizableWindow } from "@/hooks/useResizableWindow";
import { WORK_PHOTOS } from "@/data/work-photos";
import { getWorkProjects, type WorkProject } from "@/lib/work-projects";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type Page =
  | { kind: "title" }
  | { kind: "project"; project: WorkProject }
  | { kind: "closing" };

const SPIRAL_RING_COUNT = 16;
/** Super-light off-white paper — noticeably lighter than the app's usual warm cream accent. */
const PAPER = "bg-[#fdfcf9]";

function buildPages(projects: WorkProject[]): Page[] {
  return [
    { kind: "title" },
    ...projects.map((project): Page => ({ kind: "project", project })),
    { kind: "closing" },
  ];
}

/** Strips the "(in progress)" suffix and lowercases, matching WORK_PHOTOS' keys. */
function photoKeyFor(name: string): string {
  return name.replace(/\s*\(in progress\)\s*$/i, "").trim().toLowerCase();
}

function photosFor(page: Page): string[] {
  if (page.kind !== "project") return [];
  return WORK_PHOTOS[photoKeyFor(page.project.name)] ?? [];
}

/** A row of metal spiral-coil rings — a hole punched through each, not a filled dot. */
function SpiralBinding() {
  return (
    <div className="pointer-events-none absolute inset-x-6 -top-3 z-40 flex justify-between">
      {Array.from({ length: SPIRAL_RING_COUNT }, (_, i) => (
        <div key={i} className="relative size-4">
          <div className="absolute inset-0 rounded-full bg-neutral-400 shadow-[1px_1px_2px_rgba(26,22,37,0.4)]" />
          <div className={`absolute inset-[3px] rounded-full ${PAPER}`} />
        </div>
      ))}
    </div>
  );
}

/** Scattered, overlapping placement — each photo stays big regardless of count instead of splitting a row. */
const PHOTO_LAYOUTS = [
  { x: -30, y: -6, rotate: -4, size: 66 },
  { x: 34, y: 9, rotate: 5, size: 60 },
  { x: -6, y: 16, rotate: -3, size: 52 },
  { x: 24, y: -20, rotate: 3, size: 44 },
];

function PhotoStack({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return (
      <div
        className={`flex aspect-video w-[82%] max-w-[600px] flex-col items-center justify-center gap-2 border-4 border-cream/80 ${PAPER} text-plum/30 shadow-pixel`}
      >
        <ImageIcon className="size-10" />
        <p className="font-mono text-[10px] uppercase tracking-wide">photo coming soon</p>
      </div>
    );
  }

  const layouts =
    photos.length === 1 ? [{ x: 0, y: 0, rotate: -3, size: 82 }] : PHOTO_LAYOUTS;

  return (
    <div className="relative h-full w-full">
      {photos.map((src, i) => {
        const layout = layouts[i % layouts.length];
        return (
          <div
            key={src}
            className={`absolute left-1/2 top-1/2 aspect-video border-4 border-cream/80 ${PAPER} shadow-pixel-lg`}
            style={{
              width: `${layout.size}%`,
              maxWidth: 560,
              zIndex: i + 1,
              transform: `translate(-50%, -50%) translate(${layout.x}%, ${layout.y}%) rotate(${layout.rotate}deg)`,
            }}
          >
            <Image src={src} alt="" fill className="object-contain" />
          </div>
        );
      })}
    </div>
  );
}

function PageContent({ page, pageNumber }: { page: Page; pageNumber: number }) {
  if (page.kind === "title") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center sm:p-8">
        <p className="font-handwritten text-[clamp(1.75rem,7cqw,3.25rem)] font-bold leading-snug text-plum">
          some of my projects from the summer
        </p>
        <p className="absolute inset-x-0 bottom-3 text-center font-pixel text-[8px] text-plum/40">
          {pageNumber}
        </p>
      </div>
    );
  }

  if (page.kind === "closing") {
    return (
      <div className="relative flex h-full items-center justify-center gap-4 p-6 text-center sm:p-8">
        <p className="font-handwritten text-[clamp(1.75rem,6cqw,3rem)] font-bold leading-tight text-plum">
          ...and much more!
        </p>
        <p className="text-5xl">🌱</p>
        <p className="absolute inset-x-0 bottom-3 text-center font-pixel text-[8px] text-plum/40">
          {pageNumber}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col items-center gap-4 p-6 pt-8 text-center sm:p-8">
      <p className="font-handwritten text-[clamp(1.5rem,5cqw,2.5rem)] font-bold leading-tight text-plum">
        {page.project.name}
      </p>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <PhotoStack photos={photosFor(page)} />
      </div>

      <p className="absolute inset-x-0 bottom-3 text-center font-pixel text-[8px] text-plum/40">
        {pageNumber}
      </p>
    </div>
  );
}

export function NotebookWindow({
  isOpen,
  onClose,
  onFinished,
  zIndex,
  onFocus,
}: {
  isOpen: boolean;
  onClose: () => void;
  /** Fires when advancing past the last page, so the presenter can hand off hands-free. */
  onFinished: () => void;
  zIndex: number;
  onFocus: () => void;
}) {
  const projects = useMemo(() => getWorkProjects(), []);
  const pages = useMemo(() => buildPages(projects), [projects]);
  const [index, setIndex] = useState(0);
  // Index of the page currently mid-flip (its content still shows on the
  // flipping overlay, tumbling away toward the top-left) — null when idle.
  const [flippingFrom, setFlippingFrom] = useState<number | null>(null);
  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const { x, y } = useCenteredMotionValues(900);
  const { size, startResize, clampToViewport } = useResizableWindow({ x, y, windowRef });

  const pageCount = pages.length;
  const canGoPrev = index > 0;
  const canGoNext = index < pageCount - 1;
  const goTo = (newIndex: number) => {
    if (flippingFrom !== null) return;
    setFlippingFrom(index);
    setIndex(newIndex);
  };
  const goPrev = () => canGoPrev && goTo(index - 1);
  const goNext = () => {
    if (canGoNext) {
      goTo(index + 1);
    } else if (projects.length > 0 && index === pageCount - 1) {
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
  }, [isOpen, index, flippingFrom]);

  const page = pages[index];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={windowRef}
          aria-label="Notebook"
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
          className={`fixed left-0 top-0 flex flex-col border-2 border-cream bg-plum shadow-pixel-lg ${
            size ? "" : "w-[min(900px,calc(100vw-2rem))]"
          } ${size ? "" : "h-[min(620px,calc(100vh-140px))]"}`}
        >
          <header
            onPointerDown={startDrag}
            className="flex shrink-0 cursor-grab items-center gap-3 border-b-2 border-cream/70 bg-plum px-3 py-2 active:cursor-grabbing"
          >
            <button
              type="button"
              aria-label="Close window"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onClose}
              className="size-3 rounded-full border border-plum/60 bg-[#ff5f57] transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
            />
            <h2 className="truncate font-pixel text-[8px] text-cream/80">
              ~/Notebook/worklog.txt
            </h2>
          </header>

          <div className="relative flex min-h-0 flex-1 items-start p-3 pt-6">
            <SpiralBinding />

            <div
              className={`@container relative min-h-0 min-w-0 flex-1 self-stretch overflow-hidden rounded-lg ${PAPER}`}
            >
              {projects.length === 0 ? (
                <p className="flex h-full items-center justify-center p-6 text-center font-mono text-[11px] text-plum/50">
                  no work projects found in the knowledge base
                </p>
              ) : (
                <>
                  <div className="absolute inset-0">
                    <PageContent page={page} pageNumber={index + 1} />
                  </div>

                  {flippingFrom !== null && pages[flippingFrom] && (
                    <motion.div
                      key={flippingFrom}
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      animate={{ x: "-35%", y: "-45%", rotate: -18, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeIn" }}
                      onAnimationComplete={() => setFlippingFrom(null)}
                      style={{ transformOrigin: "bottom right" }}
                      className="pointer-events-none absolute inset-0 z-30"
                    >
                      <div className={`absolute inset-0 rounded-lg ${PAPER} shadow-pixel-lg`}>
                        <PageContent page={pages[flippingFrom]} pageNumber={flippingFrom + 1} />
                      </div>
                    </motion.div>
                  )}
                </>
              )}

              <button
                type="button"
                aria-label="Previous page"
                disabled={!canGoPrev}
                onClick={goPrev}
                className="absolute inset-y-0 left-0 z-20 w-1/2 cursor-pointer disabled:cursor-default"
              />
              <button
                type="button"
                aria-label="Next page"
                disabled={!canGoNext}
                onClick={goNext}
                className="absolute inset-y-0 right-0 z-20 w-1/2 cursor-pointer disabled:cursor-default"
              />
            </div>
          </div>

          {RESIZE_HANDLES.map(({ direction: resizeDirection, className }) => (
            <div
              key={resizeDirection}
              onPointerDown={(event) => startResize(resizeDirection, event)}
              className={`absolute z-10 ${className}`}
            />
          ))}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
