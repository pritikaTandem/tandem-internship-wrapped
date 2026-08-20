"use client";

import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { IntroLockScreen } from "@/components/desktop/IntroLockScreen";
import { LockScreen } from "@/components/desktop/LockScreen";
import { PowerOffOverlay } from "@/components/desktop/PowerOffOverlay";
import { TopMenuBar } from "@/components/desktop/TopMenuBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WidgetRail } from "@/components/desktop/WidgetRail";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

type FinaleStage = "idle" | "shutdown" | "lockscreen";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [finaleStage, setFinaleStage] = useState<FinaleStage>("idle");

  return (
    <main className="relative min-h-svh overflow-hidden bg-plum">
      <AnimatePresence>
        {!isUnlocked && (
          <IntroLockScreen key="intro" onUnlock={() => setIsUnlocked(true)} />
        )}
      </AnimatePresence>

      {isUnlocked && (
        <>
          <Wallpaper />
          <TopMenuBar />
          <WidgetRail />
          <DesktopIcons />
          <DesktopShell onFinale={() => setFinaleStage("shutdown")} />
        </>
      )}

      {finaleStage === "shutdown" && (
        <PowerOffOverlay onComplete={() => setFinaleStage("lockscreen")} />
      )}
      {finaleStage === "lockscreen" && <LockScreen />}
    </main>
  );
}
