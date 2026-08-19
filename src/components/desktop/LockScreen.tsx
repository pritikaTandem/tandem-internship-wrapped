"use client";

import { TEAM_PHOTO_SRC } from "@/data/team-photo";
import { useClock } from "@/hooks/useClock";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * The presentation's real closing beat — deliberately not another desktop
 * window. Stays up for good; there's nothing to click back from.
 */
export function LockScreen() {
  const now = useClock(1_000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-50 overflow-hidden bg-plum"
      aria-label="Lock screen"
    >
      {TEAM_PHOTO_SRC && (
        <Image
          src={TEAM_PHOTO_SRC}
          alt="The Tandem team"
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,22,37,0.4),rgba(26,22,37,0.15)_40%,rgba(26,22,37,0.6))]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-cream">
        {now && (
          <>
            <p className="font-wrapped text-lg font-bold drop-shadow-md sm:text-xl">
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="font-wrapped text-7xl font-extrabold leading-none drop-shadow-md sm:text-8xl">
              {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </p>
          </>
        )}
        <p className="mt-6 max-w-md font-handwritten text-3xl leading-snug drop-shadow-md sm:text-4xl">
          thank you tandem for this awesome summer! ❤️
        </p>
      </div>
    </motion.div>
  );
}
