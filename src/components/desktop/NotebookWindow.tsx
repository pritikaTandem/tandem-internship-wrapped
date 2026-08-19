"use client";

import { RESIZE_HANDLES, useCenteredMotionValues, useResizableWindow } from "@/hooks/useResizableWindow";
import { getRealityPairs, type RealityPair } from "@/lib/reality-pairs";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

/** A messy, hand-drawn-looking strikethrough — a few overlapping angled marks, not a clean CSS line. */
function ScratchedText({ text }: { text: string }) {
  return (
    <span className="relative inline-block">
      {text}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-4%] top-[54%] h-[3px] w-[108%] -rotate-2 rounded-full bg-plum/70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-2%] top-[46%] h-[2px] w-[104%] rotate-1 rounded-full bg-plum/50"
      />
    </span>
  );
}

/** A marker-style highlight swiped behind the text, like it was dragged across with a pink highlighter. */
function HighlightedText({ text }: { text: string }) {
  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-4%] top-[16%] bottom-[8%] -rotate-1 rounded-sm bg-pink/45"
      />
      <span className="relative">{text}</span>
    </span>
  );
}

function PageContent({ pair, pageNumber }: { pair: RealityPair; pageNumber: number }) {
  return (
    <div className="relative flex h-full flex-col justify-center gap-6 p-6 sm:p-8">
      <div>
        <p className="font-pixel text-[8px] uppercase tracking-[0.2em] text-plum/40">
          expectation
        </p>
        <p className="mt-2 font-handwritten text-[clamp(1.1rem,4.2cqw,1.9rem)] leading-snug text-plum/60">
          <ScratchedText text={pair.expectation} />
        </p>
      </div>

      <div>
        <p className="font-pixel text-[8px] uppercase tracking-[0.2em] text-pink">reality</p>
        <p className="mt-2 font-handwritten text-[clamp(1.6rem,6cqw,2.75rem)] font-bold leading-snug text-plum">
          <HighlightedText text={pair.reality} />
        </p>
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
  const pairs = useMemo(() => getRealityPairs(), []);
  const [index, setIndex] = useState(0);
  // Index of the page currently mid-flip (its content still shows on the
  // flipping overlay, on its way to resting over the left page) — null when idle.
  const [flippingFrom, setFlippingFrom] = useState<number | null>(null);
  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const { x, y } = useCenteredMotionValues(640);
  const { size, startResize, clampToViewport } = useResizableWindow({ x, y, windowRef });

  const pageCount = pairs.length;
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
    } else if (pageCount > 0 && index === pageCount - 1) {
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

  const pair = pairs[index];

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
            size ? "" : "w-[min(640px,calc(100vw-2rem))]"
          } ${size ? "" : "h-[min(420px,calc(100vh-140px))]"}`}
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
              ~/Notebook/reality.txt
            </h2>
          </header>

          <div className="flex min-h-0 flex-1 gap-1 p-3" style={{ perspective: "1400px" }}>
            {/* Left page — decorative, always the same, sells the "open book" spread. Also where a
                flipped page visually comes to rest. */}
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-l-lg bg-cream" />

            <div className="w-1 shrink-0 bg-plum" />

            {/* Right page — current content sits underneath, revealed as the flipping page peels away. */}
            <div className="@container relative min-w-0 flex-1 overflow-visible rounded-r-lg bg-cream">
              {!pair ? (
                <p className="flex h-full items-center justify-center p-6 text-center font-mono text-[11px] text-plum/50">
                  no expectation/reality pairs found in the knowledge base
                </p>
              ) : (
                <>
                  <div className="absolute inset-0">
                    <PageContent pair={pair} pageNumber={index + 1} />
                  </div>

                  {flippingFrom !== null && pairs[flippingFrom] && (
                    <motion.div
                      key={flippingFrom}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: -180 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      onAnimationComplete={() => setFlippingFrom(null)}
                      style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
                      className="pointer-events-none absolute inset-0 z-30"
                    >
                      <div
                        className="absolute inset-0 rounded-r-lg bg-cream shadow-[inset_10px_0_14px_-10px_rgba(26,22,37,0.35)]"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <PageContent pair={pairs[flippingFrom]} pageNumber={flippingFrom + 1} />
                      </div>
                      <div
                        className="absolute inset-0 rounded-l-lg bg-cream"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      />
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
