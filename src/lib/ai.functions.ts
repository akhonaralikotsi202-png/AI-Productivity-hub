import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

async function callModel(prompt: string, system: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);
  try {
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt,
    });
    return text;
  } catch (err: unknown) {
    const e = err as { statusCode?: number; status?: number; message?: string };
    const status = e?.statusCode ?? e?.status;
    if (status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (status === 402)
      throw new Error("AI credits exhausted. Please add credits in your Lovable workspace.");
    throw new Error(e?.message ?? "AI request failed.");
  }
}

const EmailInput = z.object({
  purpose: z.string().min(1).max(500),
  recipient: z.string().min(1).max(200),
  tone: z.enum(["Professional", "Friendly", "Formal", "Persuasive"]),
  keyPoints: z.string().max(2000).default(""),
  length: z.enum(["Short", "Medium", "Long"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Generate a professional email based on:
Purpose: ${data.purpose}
Recipient: ${data.recipient}
Tone: ${data.tone}
Key Points: ${data.keyPoints || "(none provided — infer reasonable points)"}
Length: ${data.length}

Requirements:
- Clear subject line
- Professional formatting
- Action-oriented language
- Appropriate tone

Return strictly in this format:
Subject: <subject line>

<email body>`;
    const text = await callModel(prompt, "You write clear, polished business emails.");
    const match = text.match(/^\s*Subject:\s*(.+?)\n([\s\S]*)$/i);
    if (match) return { subject: match[1].trim(), body: match[2].trim() };
    return { subject: "", body: text.trim() };
  });

const NotesInput = z.object({
  title: z.string().max(200).default(""),
  notes: z.string().min(10).max(20000),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Analyze the following meeting notes${data.title ? ` for "${data.title}"` : ""} and provide a structured summary using markdown with these exact H2 sections:

## Executive Summary
## Key Discussion Points
## Decisions Made
## Action Items
## Risks or Follow-Ups

Use concise bullet points. For Action Items, format each as "- [ ] Owner — Task — Due".

Meeting Notes:
${data.notes}`;
    const text = await callModel(prompt, "You are an expert meeting analyst.");
    return { summary: text.trim() };
  });

const TaskInput = z.object({
  goal: z.string().min(1).max(2000),
  deadline: z.string().max(100).default(""),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  teamSize: z.number().int().min(1).max(500),
});

export const createTaskPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TaskInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Create a task plan for:

Goal: ${data.goal}
Deadline: ${data.deadline || "Not specified"}
Priority: ${data.priority}
Team Size: ${data.teamSize}

Generate a markdown plan with these H2 sections:
## Task Breakdown
(numbered list, each task with priority [High/Medium/Low], estimated effort in hours/days, and suggested owner role)
## Suggested Timeline
(week-by-week or phase-by-phase)
## Recommended Next Actions
(3-5 immediate next steps)`;
    const text = await callModel(prompt, "You are a senior project planner.");
    return { plan: text.trim() };
  });
