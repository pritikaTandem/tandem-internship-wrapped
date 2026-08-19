"use client";

import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { LockScreen } from "@/components/desktop/LockScreen";
import { PowerOffOverlay } from "@/components/desktop/PowerOffOverlay";
import { TopMenuBar } from "@/components/desktop/TopMenuBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WidgetRail } from "@/components/desktop/WidgetRail";
import { useState } from "react";

type FinaleStage = "idle" | "shutdown" | "lockscreen";

export default function Home() {
  const [finaleStage, setFinaleStage] = useState<FinaleStage>("idle");

  return (
    <main className="relative min-h-svh overflow-hidden bg-plum">
      <Wallpaper />
      <TopMenuBar />
      <WidgetRail />
      <DesktopIcons />
      <DesktopShell onFinale={() => setFinaleStage("shutdown")} />

      {finaleStage === "shutdown" && (
        <PowerOffOverlay onComplete={() => setFinaleStage("lockscreen")} />
      )}
      {finaleStage === "lockscreen" && <LockScreen />}
    </main>
  );
}
