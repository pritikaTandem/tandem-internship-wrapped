"use client";

import { MacLockScreen } from "@/components/desktop/MacLockScreen";
import { TEAM_PHOTO_SRC } from "@/data/team-photo";

/**
 * The presentation's real closing beat — deliberately not another desktop
 * window. Stays up for good; there's nothing to click back from (no
 * onUnlock, so the password field here is just for show).
 */
export function LockScreen() {
  return (
    <MacLockScreen
      wallpaperSrc={TEAM_PHOTO_SRC}
      showClock={false}
      message="thank you tandem for this awesome summer! ❤️"
    />
  );
}
