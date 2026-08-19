"use client";

import { TOUCH_GRASS_WARNINGS } from "@/constants/terminal";
import confetti from "canvas-confetti";
import { useEffect, useRef, useState, type FormEvent } from "react";

const SUDO_PATTERN = /^sudo\s+\S/i;
const REVEAL_DELAY_MS = 700;

type Entry = { command: string; response: string; isError: boolean };

function fireConfettiFrom(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 45,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: rect.top / window.innerHeight,
    },
  });
}

export function TouchGrassAgent({ onOpenPhotos }: { onOpenPhotos: () => void }) {
  const [command, setCommand] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    promptRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const runCommand = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = command.trim();
    if (!trimmed || busy) return;

    setCommand("");

    if (SUDO_PATTERN.test(trimmed)) {
      setBusy(true);
      setEntries((current) => [
        ...current,
        { command: trimmed, response: "access granted. unlocking photos...", isError: false },
      ]);
      if (inputRef.current) fireConfettiFrom(inputRef.current);
      window.setTimeout(() => {
        onOpenPhotos();
        setBusy(false);
      }, REVEAL_DELAY_MS);
      return;
    }

    setEntries((current) => [
      ...current,
      { command: trimmed, response: `command not found: ${trimmed.split(" ")[0]}`, isError: true },
    ]);
  };

  return (
    <div className="min-h-full space-y-3 overflow-y-auto">
      {TOUCH_GRASS_WARNINGS.map((warning) => (
        <p key={warning} className="text-pink">
          {warning}
        </p>
      ))}
      <p className="text-cream/70">
        recommendation: close the laptop. the sun is still up.
      </p>

      {entries.map((entry, index) => (
        <div key={index} className="space-y-1">
          <p className="text-cream/70">
            <span className="text-mint">$</span> {entry.command}
          </p>
          <p className={entry.isError ? "text-pink" : "text-mint"}>{entry.response}</p>
        </div>
      ))}

      <form
        ref={promptRef}
        onSubmit={runCommand}
        autoComplete="off"
        className="flex items-center gap-2 py-1"
      >
        <label htmlFor="touch-grass-command" className="shrink-0 text-mint">
          $
        </label>
        <input
          ref={inputRef}
          id="touch-grass-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="run a command..."
          disabled={busy}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 border-none bg-transparent text-cream caret-pink outline-none placeholder:text-pink/45 disabled:opacity-50"
        />
      </form>
    </div>
  );
}
