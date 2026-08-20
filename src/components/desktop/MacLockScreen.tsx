"use client";

import { PROFILE_PHOTO_SRC } from "@/data/profile-photo";
import { useClock } from "@/hooks/useClock";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";

const NAME = "Pritika Aggarwal";
const PASSWORD = "tandem";
const WRONG_PASSWORD_RESET_MS = 500;

/** Same hard offset used by `shadow-pixel`, repurposed as a text-shadow for the pixel-sticker look. */
const HARD_TEXT_SHADOW = { textShadow: "3px 3px 0 rgba(26,22,37,0.9)" };

const DEFAULT_FALLBACK_BACKGROUND = "bg-cream";

/**
 * A lock screen built from the same retro pixel-art chrome as the rest of
 * the desktop (borders, hard shadows, pixel/handwritten fonts, scanlines) —
 * wallpaper photo/gradient behind, live clock up top, profile
 * photo/name/password anchored to the bottom. Used both as the intro slide
 * (functional — typing "tandem" unlocks into the desktop) and as the
 * closing screen (decorative — same look, but there's nothing left to
 * unlock into).
 */
export function MacLockScreen({
  wallpaperSrc,
  fallbackBackground = DEFAULT_FALLBACK_BACKGROUND,
  showClock = true,
  message,
  onUnlock,
}: {
  wallpaperSrc: string;
  /** Shown behind everything until wallpaperSrc is set — a Tailwind bg-[...] class. */
  fallbackBackground?: string;
  showClock?: boolean;
  message?: string;
  onUnlock?: () => void;
}) {
  const now = useClock(1_000);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!onUnlock) return;
    if (password.trim().toLowerCase() === PASSWORD) {
      onUnlock();
      return;
    }
    setWrong(true);
    setPassword("");
    window.setTimeout(() => setWrong(false), WRONG_PASSWORD_RESET_MS);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed inset-0 z-50 overflow-hidden ${fallbackBackground}`}
      aria-label="Lock screen"
    >
      {wallpaperSrc && (
        <div className="absolute inset-x-0 top-10 bottom-10 overflow-hidden sm:top-16 sm:bottom-16">
          <Image src={wallpaperSrc} alt="" fill priority className="object-contain" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,22,37,0.55),rgba(26,22,37,0.25)_45%,rgba(26,22,37,0.75))]" />
        </div>
      )}
      <div className="scanlines absolute inset-0 opacity-20" />

      <div className="relative flex h-full flex-col items-center px-6 text-center text-cream">
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
          {showClock && now && (
            <>
              <p className="font-pixel text-[9px] uppercase tracking-[0.2em] text-cream/80">
                {now.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p
                style={HARD_TEXT_SHADOW}
                className="font-wrapped text-7xl font-extrabold leading-none text-cream sm:text-8xl"
              >
                {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </p>
            </>
          )}

          {message && (
            <p className="mt-6 max-w-md font-handwritten text-3xl leading-snug text-cream sm:text-4xl">
              {message}
            </p>
          )}
        </div>

        {onUnlock && (
          <div className="flex flex-col items-center gap-2.5 pb-14 sm:pb-20">
            <div className="relative size-20 overflow-hidden rounded-full border-2 border-cream bg-plum shadow-pixel">
              {PROFILE_PHOTO_SRC ? (
                <Image
                  src={PROFILE_PHOTO_SRC}
                  alt={NAME}
                  fill
                  className="scale-125 object-cover"
                />
              ) : (
                <div className="size-full bg-plum" />
              )}
            </div>
            <p className="font-pixel text-[9px] uppercase tracking-wide text-cream">{NAME}</p>

            <motion.form
              onSubmit={handleSubmit}
              animate={wrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-1 flex items-stretch gap-1.5"
            >
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={wrong ? "Try again" : "Enter Password"}
                autoFocus
                className="w-36 border-2 border-cream bg-plum/70 px-3 py-1.5 font-mono text-sm text-cream caret-pink outline-none placeholder:text-cream/50"
              />
              <button
                type="submit"
                aria-label="Unlock"
                className="grid size-9 shrink-0 place-items-center border-2 border-cream bg-plum/70 text-cream shadow-pixel transition-transform hover:scale-105"
              >
                <ArrowRight className="size-4" />
              </button>
            </motion.form>
          </div>
        )}
      </div>
    </motion.div>
  );
}
