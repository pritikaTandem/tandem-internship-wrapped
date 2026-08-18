"use client";

import { useWeather } from "@/hooks/useWeather";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  Zap,
} from "lucide-react";

const GLYPH_CLASS = "size-3.5 text-mint";

function WeatherGlyph({ code }: { code: number }) {
  if (code === 0) return <Sun aria-hidden="true" className={GLYPH_CLASS} />;
  if (code <= 2) return <CloudSun aria-hidden="true" className={GLYPH_CLASS} />;
  if (code === 3) return <Cloud aria-hidden="true" className={GLYPH_CLASS} />;
  if (code <= 48) return <CloudFog aria-hidden="true" className={GLYPH_CLASS} />;
  if (code <= 57) return <CloudDrizzle aria-hidden="true" className={GLYPH_CLASS} />;
  if (code <= 67 || (code >= 80 && code <= 82))
    return <CloudRain aria-hidden="true" className={GLYPH_CLASS} />;
  if (code <= 86) return <Snowflake aria-hidden="true" className={GLYPH_CLASS} />;
  return <Zap aria-hidden="true" className={GLYPH_CLASS} />;
}

export function WeatherWidget() {
  const weather = useWeather();

  if (!weather) {
    return (
      <section
        aria-label="Weather"
        className="grid h-[8.75rem] w-[9.5rem] place-items-center border-2 border-plum bg-plum/70 p-3 font-pixel text-[7px] uppercase tracking-[0.2em] text-cream/50 shadow-pixel backdrop-blur-md"
      >
        Loading…
      </section>
    );
  }

  return (
    <section
      aria-label={`Weather in ${weather.label}`}
      className="flex w-[9.5rem] flex-col justify-between border-2 border-plum bg-plum/70 p-2.5 shadow-pixel backdrop-blur-md"
    >
      <h2 className="font-pixel text-[7px] uppercase tracking-[0.16em] text-purple">
        {weather.label}
      </h2>

      <p className="font-pixel text-[26px] leading-none text-cream">
        {weather.temperature}°
      </p>

      <div className="space-y-1 font-mono text-[10px] text-cream/80">
        <p className="flex items-center gap-1.5">
          <WeatherGlyph code={weather.code} />
          {weather.condition}
        </p>
        <p className="text-cream/60">
          H:{weather.high}° L:{weather.low}°
        </p>
      </div>
    </section>
  );
}
