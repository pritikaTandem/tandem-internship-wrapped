"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

const EXAMPLE_QUESTION = "what did i learn this summer?";
const PIXEL_BLOCK_COUNT = 8;
const PIXEL_BLOCK_MS = 150;

type Exchange = { question: string; compiling: boolean };

function PixelLoadingBar({ litBlocks }: { litBlocks: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-cream/70">compiling wrapped...</span>
      <div className="flex gap-0.5">
        {Array.from({ length: PIXEL_BLOCK_COUNT }, (_, i) => (
          <div
            key={i}
            className={`h-3 w-2.5 border border-plum/40 ${
              i < litBlocks ? "bg-mint" : "bg-plum/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function RealityCheckAgent({
  active,
  onOpenWrapped,
}: {
  active: boolean;
  onOpenWrapped: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [litBlocks, setLitBlocks] = useState(0);
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
    setLitBlocks(0);
    setExchanges((current) => [...current, { question: trimmed, compiling: true }]);

    let block = 0;
    const interval = window.setInterval(() => {
      block += 1;
      setLitBlocks(block);
      if (block >= PIXEL_BLOCK_COUNT) {
        window.clearInterval(interval);
        onOpenWrapped();
        setBusy(false);
      }
    }, PIXEL_BLOCK_MS);
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
        {exchanges.length > 0 && (
          <ul className="space-y-2">
            {exchanges.map((exchange, index) => (
              <li key={index} className="space-y-1">
                <p className="text-cream/70">» {exchange.question}</p>
                {index === exchanges.length - 1 && busy && (
                  <PixelLoadingBar litBlocks={litBlocks} />
                )}
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
        <label htmlFor="ask-reality-check-agent" className="shrink-0 text-pink">
          ask_reality_check_agent {">"}
        </label>
        <input
          ref={inputRef}
          id="ask-reality-check-agent"
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
