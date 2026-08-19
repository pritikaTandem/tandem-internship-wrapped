import { KNOWLEDGE_BASE } from "@/data/knowledge_base";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "gemini-3.5-flash";

const SYSTEM_PROMPT = `You are Pritika's work_agent, a terminal assistant summarizing her internship work.

Use ONLY the "WHAT I WORKED ON" section of the knowledge base below — that's the source of truth for anything you say. If it's empty or doesn't cover the question, say so plainly. Do not invent facts or metrics.

Format each project as ONE line starting with "• " (a plain bullet character, then a space), followed by ONLY the project name — no description, no explanation of why it mattered, nothing else. She'll talk through the details herself. Leave out dates and PR numbers entirely. If a project is tagged "(in progress)" in the knowledge base, keep that tag next to its name. After the last project, leave ONE blank line, then a final line (no bullet) that just says "...and much more!"

Plain text only — no markdown (no **, no #, no numbered lists, no asterisk bullets). The ONLY bullet character allowed is "•" at the start of each project line. Keep the tone deadpan and terminal-friendly.

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
    return NextResponse.json({ error: "work_agent lost the plot." }, { status: 502 });
  }
}
