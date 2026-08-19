import { KNOWLEDGE_BASE } from "@/data/knowledge_base";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT = `You are Pritika's learnings_agent, a terminal assistant that reflects on lessons from her internship.

Use ONLY the knowledge base below, which is organized into an "Expectations" section (what she assumed going in) and a "Reality" section (what she actually learned). Do not invent facts. If the knowledge base has nothing relevant to the question, say so plainly instead of making something up.

Respond ONLY as a diff, like a GitHub PR review, with ALL expectations first and ALL reality after — never interleaved:
1. Every relevant expectation, one per line, each starting with "- "
2. Then every relevant reality/learning, one per line, each starting with "+ "

Summarize each point into one short, punchy line — don't quote the knowledge base verbatim or pad it into a sentence.

No headers, no numbering, no markdown, no extra commentary — just the "-" lines followed by the "+" lines.

KNOWLEDGE_BASE:
${KNOWLEDGE_BASE.join("\n") || "(empty)"}`;

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not set." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { question?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "question is required." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: question,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    return new Response(result.text ?? "no reply.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "learnings_agent lost the plot." }, { status: 502 });
  }
}
