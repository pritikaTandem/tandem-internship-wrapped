"use client";

import { PHOTOS, PHOTOS_HASHTAG } from "@/data/photos";
import { RESIZE_HANDLES, useResizableWindow } from "@/hooks/useResizableWindow";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const SWIPE_THRESHOLD = 80;

/** Deterministic per-photo tilt so the stack reads as tossed, not aligned. */
function tiltFor(index: number): number {
  return ((index * 37) % 11) - 5;
}

export function PhotosWindow({
  isOpen,
  onClose,
  zIndex,
  onFocus,
}: {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}) {
  const [index, setIndex] = useState(0);
  const windowRef = useRef<HTMLElement | null>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const { size, startResize } = useResizableWindow({ x, y, windowRef });

  const canGoPrev = index > 0;
  const canGoNext = index < PHOTOS.length - 1;
  const goPrev = () => canGoPrev && setIndex((current) => current - 1);
  const goNext = () => canGoNext && setIndex((current) => current + 1);

  const startDrag = (event: PointerEvent<HTMLElement>) => dragControls.start(event);

  const onSwipeEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

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

  const photo = PHOTOS[index];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          ref={windowRef}
          aria-label="Photos"
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          onPointerDownCapture={onFocus}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ x, y, width: size?.width, height: size?.height, zIndex }}
          className={`fixed left-0 top-0 flex flex-col border-2 border-mint bg-plum/95 shadow-pixel-lg backdrop-blur-md ${
            size ? "" : "w-[min(360px,calc(100vw-2rem))]"
          }`}
        >
          <header
            onPointerDown={startDrag}
            className="flex shrink-0 cursor-grab items-center gap-3 border-b-2 border-mint/70 bg-plum px-3 py-2 active:cursor-grabbing"
          >
            <button
              type="button"
              aria-label="Close window"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onClose}
              className="size-3 rounded-full border border-plum/60 bg-[#ff5f57] transition-transform hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
            />
            <h2 className="truncate font-pixel text-[8px] text-cream/80">
              ~/Pictures/summer
            </h2>
          </header>

          <div className="@container flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-6">
            {!photo ? (
              <p className="py-10 text-center font-mono text-xs text-cream/50">
                no photos yet — drop some into /public/photos and list them in
                photos.ts
              </p>
            ) : (
              <>
                <div className="relative flex w-full items-center justify-center overflow-hidden py-4">
                  {canGoPrev && (
                    <div
                      aria-hidden="true"
                      onClick={goPrev}
                      className="absolute left-1/2 top-1/2 z-0 aspect-[4/5] w-[clamp(140px,42cqw,340px)] translate-x-[calc(-50%-14px)] translate-y-[calc(-50%+6px)] rotate-[-6deg] scale-[0.94] cursor-pointer border-2 border-cream/80 bg-cream/90 shadow-pixel"
                    />
                  )}
                  {canGoNext && (
                    <div
                      aria-hidden="true"
                      onClick={goNext}
                      className="absolute left-1/2 top-1/2 z-0 aspect-[4/5] w-[clamp(140px,42cqw,340px)] translate-x-[calc(-50%+14px)] translate-y-[calc(-50%+6px)] rotate-[6deg] scale-[0.94] cursor-pointer border-2 border-cream/80 bg-cream/90 shadow-pixel"
                    />
                  )}

                  <motion.div
                    key={index}
                    drag="x"
                    dragSnapToOrigin
                    dragElastic={0.2}
                    onDragEnd={onSwipeEnd}
                    initial={{ opacity: 0, filter: "brightness(3) contrast(0.4)" }}
                    animate={{
                      opacity: 1,
                      filter: "brightness(1) contrast(1)",
                      rotate: tiltFor(index),
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 flex w-[clamp(140px,42cqw,340px)] cursor-grab flex-col items-center border-2 border-cream bg-cream p-[3cqw] pb-[5cqw] shadow-pixel-lg active:cursor-grabbing"
                  >
                    <div className="relative aspect-square w-full select-none border border-plum/20">
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        fill
                        draggable={false}
                        sizes="340px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 truncate font-handwritten text-[clamp(1rem,5cqw,1.75rem)] text-plum">
                      {photo.caption}
                    </p>
                  </motion.div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous photo"
                    disabled={!canGoPrev}
                    onClick={goPrev}
                    className="text-cream/60 transition-colors hover:text-mint disabled:opacity-20"
                  >
                    <ChevronLeft className="size-[clamp(1rem,3cqw,1.5rem)]" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {PHOTOS.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        type="button"
                        aria-label={`Go to photo ${dotIndex + 1}`}
                        onClick={() => setIndex(dotIndex)}
                        className={`size-1.5 rounded-full transition-colors ${
                          dotIndex === index ? "bg-mint" : "bg-cream/30"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-label="Next photo"
                    disabled={!canGoNext}
                    onClick={goNext}
                    className="text-cream/60 transition-colors hover:text-mint disabled:opacity-20"
                  >
                    <ChevronRight className="size-[clamp(1rem,3cqw,1.5rem)]" />
                  </button>
                </div>

                <p className="font-mono text-[clamp(10px,2.5cqw,14px)] text-pink/80">{PHOTOS_HASHTAG}</p>
              </>
            )}
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
