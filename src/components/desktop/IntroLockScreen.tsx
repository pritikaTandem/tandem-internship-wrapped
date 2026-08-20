"use client";

import { MacLockScreen } from "@/components/desktop/MacLockScreen";
import { INTRO_WALLPAPER_SRC } from "@/data/intro-wallpaper";

const SUNSET_WATER_GRADIENT =
  "bg-[linear-gradient(180deg,#ffb37a_0%,#ff7e6b_22%,#ff5f8f_38%,#7d5ba6_55%,#3a4a7a_72%,#152a4a_100%)]";

/** The presentation's opening beat — type "tandem" to unlock into the desktop. */
export function IntroLockScreen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <MacLockScreen
      wallpaperSrc={INTRO_WALLPAPER_SRC}
      fallbackBackground={SUNSET_WATER_GRADIENT}
      onUnlock={onUnlock}
    />
  );
}
