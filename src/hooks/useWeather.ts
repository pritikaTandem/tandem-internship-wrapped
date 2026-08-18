"use client";

import { DEFAULT_WEATHER_LOCATION } from "@/constants/desktop";
import { useEffect, useState } from "react";

export type Weather = {
  label: string;
  temperature: number;
  high: number;
  low: number;
  condition: string;
  code: number;
};

type ForecastResponse = {
  timezone: string;
  current: { temperature_2m: number; weather_code: number };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
};

/** WMO weather interpretation codes, grouped to the bands we display. */
const CONDITIONS: ReadonlyArray<{ codes: readonly number[]; label: string }> = [
  { codes: [0], label: "Clear" },
  { codes: [1, 2], label: "Partly Cloudy" },
  { codes: [3], label: "Overcast" },
  { codes: [45, 48], label: "Foggy" },
  { codes: [51, 53, 55, 56, 57], label: "Drizzle" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rainy" },
  { codes: [71, 73, 75, 77, 85, 86], label: "Snowy" },
  { codes: [95, 96, 99], label: "Thunderstorm" },
];

function describe(code: number): string {
  return CONDITIONS.find((entry) => entry.codes.includes(code))?.label ?? "Cloudy";
}

/** "America/Los_Angeles" -> "Los Angeles" */
function cityFromTimezone(timezone: string): string | null {
  const city = timezone.split("/").at(-1);
  return city ? city.replaceAll("_", " ") : null;
}

async function resolveCoords(): Promise<{
  latitude: number;
  longitude: number;
  fromDevice: boolean;
}> {
  const fallback = {
    latitude: DEFAULT_WEATHER_LOCATION.latitude,
    longitude: DEFAULT_WEATHER_LOCATION.longitude,
    fromDevice: false,
  };

  if (!navigator.geolocation || !navigator.permissions) return fallback;

  // Only read location if it was already granted, so the desktop never prompts on load.
  const permission = await navigator.permissions
    .query({ name: "geolocation" })
    .catch(() => null);
  if (permission?.state !== "granted") return fallback;

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          fromDevice: true,
        }),
      () => resolve(fallback),
      { timeout: 5_000 },
    );
  });
}

const REFRESH_INTERVAL_MS = 15 * 60 * 1_000;

export function useWeather(): Weather | null {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const { latitude, longitude, fromDevice } = await resolveCoords();
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.search = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          current: "temperature_2m,weather_code",
          daily: "temperature_2m_max,temperature_2m_min",
          temperature_unit: "fahrenheit",
          timezone: "auto",
          forecast_days: "1",
        }).toString();

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) return;

        const data: ForecastResponse = await response.json();
        setWeather({
          label:
            (fromDevice ? cityFromTimezone(data.timezone) : null) ??
            DEFAULT_WEATHER_LOCATION.label,
          temperature: Math.round(data.current.temperature_2m),
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          condition: describe(data.current.weather_code),
          code: data.current.weather_code,
        });
      } catch {
        // Offline or blocked: the widget keeps showing its loading state.
      }
    };

    load();
    const interval = window.setInterval(load, REFRESH_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  return weather;
}
