import { DesktopIcons } from "@/components/desktop/DesktopIcons";
import { Dock } from "@/components/desktop/Dock";
import { TopMenuBar } from "@/components/desktop/TopMenuBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { WidgetRail } from "@/components/desktop/WidgetRail";

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-plum">
      <Wallpaper />
      <TopMenuBar />
      <WidgetRail />
      <DesktopIcons />
      <Dock />
    </main>
  );
}
