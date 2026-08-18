"use client";

import { useClock } from "@/hooks/useClock";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const MINUTE_MS = 60_000;

function buildMonthGrid(today: Date): Array<number | null> {
  const year = today.getFullYear();
  const month = today.getMonth();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

export function CalendarWidget() {
  const now = useClock(MINUTE_MS);

  if (!now) {
    return (
      <div
        aria-hidden="true"
        className="h-[8.75rem] w-[10.5rem] border-2 border-plum bg-plum/70 shadow-pixel backdrop-blur-md"
      />
    );
  }

  const today = now.getDate();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long" });

  return (
    <section
      aria-label={`Calendar for ${monthLabel}`}
      className="w-[10.5rem] border-2 border-plum bg-plum/70 p-2.5 shadow-pixel backdrop-blur-md"
    >
      <h2 className="mb-2 font-pixel text-[7px] uppercase tracking-[0.2em] text-pink">
        {monthLabel}
      </h2>

      <div className="grid grid-cols-7 gap-y-1 text-center font-mono text-[9px] text-cream/60">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}

        {buildMonthGrid(now).map((day, index) =>
          day === null ? (
            <span key={`blank-${index}`} />
          ) : (
            <span
              key={day}
              aria-current={day === today ? "date" : undefined}
              className={
                day === today
                  ? "mx-auto grid size-4 place-items-center bg-pink font-bold text-plum"
                  : "text-cream/85"
              }
            >
              {day}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
