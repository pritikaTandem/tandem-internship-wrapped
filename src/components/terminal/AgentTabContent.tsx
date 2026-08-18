"use client";

import {
  LEARNINGS_DIFF,
  TOUCH_GRASS_WARNINGS,
  WORK_AGENT_REPLIES,
  WORK_TRACKS,
  type AgentTab,
  type DiffLine,
} from "@/constants/terminal";
import { useState, type FormEvent } from "react";

function Command({ children }: { children: string }) {
  return (
    <p className="mb-3 text-cream/60">
      <span className="text-mint">$</span> {children}
    </p>
  );
}

function WorkAgent() {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<
    ReadonlyArray<{ question: string; reply: string }>
  >([]);

  const askQuestion = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setExchanges((current) => [
      ...current,
      { question: trimmed, reply: WORK_AGENT_REPLIES[current.length % WORK_AGENT_REPLIES.length] },
    ]);
    setQuestion("");
  };

  return (
    <div className="space-y-4">
      <Command>spotify-wrapped --scope=work --summer=2026</Command>

      <p className="text-pink">your top tracks this summer</p>

      <ol className="space-y-2">
        {WORK_TRACKS.map((track, index) => (
          <li key={track.title} className="flex flex-wrap items-baseline gap-x-2">
            <span aria-hidden="true">🎧</span>
            <span className="text-cream/60">Track {index + 1}:</span>
            <span className="text-cream">{track.title}</span>
            <span className={track.trend === "up" ? "text-mint" : "text-purple"}>
              ({track.metric})
            </span>
          </li>
        ))}
      </ol>

      {exchanges.length > 0 && (
        <ul className="space-y-2 border-l-2 border-plum/60 pl-3">
          {exchanges.map((exchange, index) => (
            <li key={`${exchange.question}-${index}`}>
              <p className="text-cream/70">» {exchange.question}</p>
              <p className="text-mint">{exchange.reply}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={askQuestion} className="flex items-center gap-2 pt-1">
        <label htmlFor="ask-work-agent" className="shrink-0 text-pink">
          ask_work_agent {">"}
        </label>
        <input
          id="ask-work-agent"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question..."
          className="min-w-0 flex-1 border-b-2 border-dashed border-plum/60 bg-transparent pb-0.5 text-cream caret-mint outline-none placeholder:text-cream/35 focus:border-mint"
        />
      </form>
    </div>
  );
}

const DIFF_STYLES: Record<DiffLine["kind"], string> = {
  meta: "text-cream/45",
  hunk: "text-purple",
  removed: "text-pink",
  added: "text-mint",
  context: "text-cream/60",
};

function LearningsAgent() {
  return (
    <div className="space-y-4">
      <Command>git diff expectation..reality</Command>

      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-6">
        {LEARNINGS_DIFF.map((line) => (
          <span key={line.text} className={`block ${DIFF_STYLES[line.kind]}`}>
            {line.text}
          </span>
        ))}
      </pre>
    </div>
  );
}

function TouchGrassAgent({ onTouchGrass }: { onTouchGrass: () => void }) {
  return (
    <div className="space-y-4">
      <Command>touch-grass --status</Command>

      {TOUCH_GRASS_WARNINGS.map((warning) => (
        <p key={warning} className="text-pink">
          {warning}
        </p>
      ))}

      <p className="text-cream/70">
        recommendation: close the laptop. the sun is still up.
      </p>

      <button
        type="button"
        onClick={onTouchGrass}
        className="border-2 border-plum bg-mint px-4 py-2.5 font-pixel text-[9px] uppercase tracking-wide text-plum shadow-[3px_3px_0_#1a1625] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
      >
        Close WezTerm &amp; Touch Grass 🌱
      </button>
    </div>
  );
}

export function AgentTabContent({
  activeTab,
  onTouchGrass,
}: {
  activeTab: AgentTab;
  onTouchGrass: () => void;
}) {
  if (activeTab === "work_agent") return <WorkAgent />;
  if (activeTab === "learnings_agent") return <LearningsAgent />;
  return <TouchGrassAgent onTouchGrass={onTouchGrass} />;
}
