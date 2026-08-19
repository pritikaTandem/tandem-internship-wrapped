"use client";

import { useRevealLines } from "@/hooks/useRevealLines";
import { useEffect, useRef, useState, type FormEvent } from "react";

const QUERY_TRACE = [
  "🧠 Agent Thinking...",
  "↳ [Tool Call] diff expectation..reality...",
] as const;

type Exchange = {
  question: string;
  reply: string;
};

function TraceLine({ text }: { text: string }) {
  return (
    <p className={text.startsWith("↳") ? "text-purple" : "text-pink"}>{text}</p>
  );
}

function diffLineClass(line: string): string {
  if (line.startsWith("+")) return "text-mint";
  if (line.startsWith("-")) return "text-pink";
  return "text-cream/60";
}

function DiffReply({ reply }: { reply: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-6">
      {reply.split("\n").map((line, index) => (
        <span key={index} className={`block ${diffLineClass(line)}`}>
          {line}
        </span>
      ))}
    </pre>
  );
}

function ExchangeBlock({ exchange }: { exchange: Exchange }) {
  const revealed = useRevealLines(QUERY_TRACE, 400);
  const ready = revealed >= QUERY_TRACE.length;

  return (
    <li className="space-y-1">
      <p className="text-cream/70">» {exchange.question}</p>
      {QUERY_TRACE.slice(0, revealed).map((line) => (
        <TraceLine key={line} text={line} />
      ))}
      {ready && (exchange.reply ? <DiffReply reply={exchange.reply} /> : <p className="text-cream/60">...</p>)}
    </li>
  );
}

export function RealityCheckAgent() {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollIntoView({ block: "end" });
  }, [exchanges]);

  const askQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    const index = exchanges.length;
    setQuestion("");
    setBusy(true);
    setExchanges((current) => [...current, { question: trimmed, reply: "" }]);

    try {
      const response = await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const reply = response.ok
        ? await response.text()
        : `- ${(await response.json().catch(() => null))?.error ?? "request failed"}`;

      setExchanges((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, reply } : item,
        ),
      );
    } catch {
      setExchanges((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, reply: "- reality_check_agent dropped the connection." }
            : item,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {exchanges.length > 0 && (
          <ul className="space-y-4">
            {exchanges.map((exchange, index) => (
              <ExchangeBlock
                key={`${exchange.question}-${index}`}
                exchange={exchange}
              />
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
          id="ask-reality-check-agent"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question..."
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
