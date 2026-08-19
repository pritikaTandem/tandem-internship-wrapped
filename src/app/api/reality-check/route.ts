import { KNOWLEDGE_BASE } from "@/data/knowledge_base";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT = `You are Pritika's reality_check_agent, a terminal assistant that reflects on lessons from her internship.

Use ONLY the "WHAT I LEARNED" and "COMING FROM THE MIDWEST" sections of the knowledge base below. The knowledge base contains three "Expectation going in" / "Reality" pairs — those are the primary content. There are also looser "Lesson" entries and a Midwest reflection for more specific follow-up questions. Do not invent facts. If the knowledge base has nothing relevant to the question, say so plainly instead of making something up.

Respond ONLY as a diff, like a GitHub PR review, with ALL expectations first and ALL reality after — never interleaved:
1. Every "Expectation going in" entry relevant to the question, one per line, each starting with "- "
2. Then the matching "Reality" entry for each one, in the SAME order, one per line, each starting with "+ " — so they read as pairs even though grouped separately.

For a broad question ("what did you learn"), use ALL THREE expectation/reality pairs from the knowledge base, in order. Keep the punchy, mantra-like phrasing already in the knowledge base (e.g. "ship fast, break fast") — light rephrasing for variety is fine, but don't soften it into corporate-speak or change the tone. Strip the literal "Expectation going in:" and "Reality:" labels — the "-"/"+" signs already say which side is which, so just the content after the colon.

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
    return NextResponse.json({ error: "reality_check_agent lost the plot." }, { status: 502 });
  }
}
