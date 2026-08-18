"use client";

import { WALLPAPERS } from "@/constants/desktop";
import { useEffect, useState } from "react";

const ROTATION_INTERVAL_MS = 30_000;

export function Wallpaper() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % WALLPAPERS.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className="absolute inset-0 overflow-hidden bg-plum"
      aria-label="Desktop wallpaper"
    >
      {WALLPAPERS.map((wallpaper, index) => (
        <div
          key={wallpaper.src}
          role="img"
          aria-label={wallpaper.alt}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1800ms] ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url("${wallpaper.src}")` }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,22,37,0.55),rgba(26,22,37,0.25)_45%,rgba(26,22,37,0.75))]" />
      <div className="scanlines absolute inset-0 opacity-20" />

      <div className="absolute bottom-28 right-5 hidden border-2 border-plum bg-plum/75 px-3 py-2 text-right font-pixel text-[7px] uppercase tracking-[0.18em] text-cream shadow-pixel backdrop-blur-sm sm:block">
        <p className="text-mint">Now dreaming in</p>
        <p>{WALLPAPERS[activeIndex].location}</p>
      </div>
    </section>
  );
}
