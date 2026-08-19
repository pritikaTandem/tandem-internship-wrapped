"use client";

import { TOUCH_GRASS_WARNINGS } from "@/constants/terminal";
import confetti from "canvas-confetti";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

const REVEAL_DELAY_MS = 700;
const EXAMPLE_QUESTION = "what did i do in berkeley/sf this summer?";

type Exchange = { question: string; response: string };

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

export function TouchGrassAgent({
  active,
  onOpenPhotos,
}: {
  active: boolean;
  onOpenPhotos: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollIntoView({ block: "end" });
  }, [exchanges]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const askQuestion = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    setQuestion("");
    setBusy(true);
    setExchanges((current) => [
      ...current,
      { question: trimmed, response: "access granted. unlocking photos..." },
    ]);
    if (inputRef.current) fireConfettiFrom(inputRef.current);
    window.setTimeout(() => {
      onOpenPhotos();
      setBusy(false);
    }, REVEAL_DELAY_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" && !question) {
      event.preventDefault();
      setQuestion(EXAMPLE_QUESTION);
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {TOUCH_GRASS_WARNINGS.map((warning) => (
          <p key={warning} className="text-pink">
            {warning}
          </p>
        ))}
        <p className="mb-4 text-cream/70">
          recommendation: close the laptop. the sun is still up.
        </p>

        {exchanges.length > 0 && (
          <ul className="space-y-4">
            {exchanges.map((exchange, index) => (
              <li key={index} className="space-y-1">
                <p className="text-cream/70">» {exchange.question}</p>
                <p className="text-mint">{exchange.response}</p>
              </li>
            ))}
          </ul>
        )}
        <div ref={logRef} />
      </div>

      <form
        onSubmit={askQuestion}
        autoComplete="off"
        className="flex items-center gap-2 py-1"
      >
        <label htmlFor="ask-touch-grass-agent" className="shrink-0 text-pink">
          ask_touch_grass_agent {">"}
        </label>
        <input
          ref={inputRef}
          id="ask-touch-grass-agent"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            exchanges.length === 0
              ? `ask a question like "${EXAMPLE_QUESTION}"`
              : "ask another question..."
          }
          disabled={busy}
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
