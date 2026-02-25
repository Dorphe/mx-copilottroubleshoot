import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY is not configured on the server.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const anthropic = createAnthropic({ apiKey });

  try {
    const { messages } = await req.json();

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(messages),
      tools: {
        show_troubleshooting_card: tool({
          description:
            "Display a structured troubleshooting action card to the technician with a recommendation and manual references. Use this when recommending a specific diagnostic step.",
          inputSchema: z.object({
            recommendation: z
              .string()
              .describe(
                "The detailed step-by-step recommendation for the technician"
              ),
            sources: z
              .array(z.string())
              .describe(
                'Array of manual page references, e.g. "Operator\'s Manual, p. 60 — Checking coolant level"'
              ),
          }),
        }),
        show_escalation_card: tool({
          description:
            "Display an escalation card recommending a specialist. Use this when all manual-listed troubleshooting steps have been exhausted without resolution.",
          inputSchema: z.object({
            expert_name: z.string().describe("Name of the specialist"),
            expert_title: z
              .string()
              .describe("Title/role of the specialist"),
            availability: z
              .string()
              .describe("When the specialist is available"),
            reason: z
              .string()
              .describe(
                "Brief explanation of why escalation is recommended"
              ),
          }),
        }),
        show_session_summary: tool({
          description:
            "Display a session summary card that will be auto-attached to the work order. Use this when the issue has been resolved or escalated.",
          inputSchema: z.object({
            steps_attempted: z
              .array(z.string())
              .describe("List of diagnostic steps that were attempted"),
            outcome: z
              .string()
              .describe("The resolution or current status"),
          }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
