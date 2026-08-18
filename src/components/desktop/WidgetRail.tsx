import { Stickies } from "@/components/desktop/Stickies";
import { CalendarWidget } from "@/components/desktop/widgets/CalendarWidget";
import { WeatherWidget } from "@/components/desktop/widgets/WeatherWidget";

export function WidgetRail() {
  return (
    <div className="absolute left-4 top-14 z-20 flex flex-col gap-4 sm:left-6">
      <div className="flex items-stretch gap-3">
        <CalendarWidget />
        <WeatherWidget />
      </div>
      <Stickies />
    </div>
  );
}
