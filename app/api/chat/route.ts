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
          execute: async ({ recommendation }) => {
            return `Displayed troubleshooting card: ${recommendation.slice(0, 50)}...`;
          },
        }),
        show_triage_card: tool({
          description:
            "Display a triage checklist card with checkbox items for things the technician may have already tried. Always include an option like 'I haven't tried any of these yet.' Use this after initial diagnostic questions to check what has already been done.",
          inputSchema: z.object({
            question: z
              .string()
              .describe(
                "The triage question, e.g. 'Before I start giving recommendations, have you looked into any of these?'"
              ),
            items: z
              .array(z.string())
              .describe(
                'Array of checklist items, e.g. ["Checked coolant level", "Checked oil level", "Cleaned radiator screen"]'
              ),
            none_option: z
              .string()
              .describe(
                "Text for the 'none' option, e.g. \"I haven't tried any of these yet.\""
              ),
          }),
          execute: async ({ items }) => {
            return `Displayed triage card with ${items.length} checklist items. Waiting for technician response.`;
          },
        }),
        show_response_options: tool({
          description:
            "Display selectable response chip options for the technician to quickly indicate an outcome after a troubleshooting step. Use this after showing a troubleshooting card.",
          inputSchema: z.object({
            options: z
              .array(z.string())
              .describe(
                'Array of response options, e.g. ["Oil was low. Topped off and running.", "Oil is fine and still tripping."]'
              ),
          }),
          execute: async ({ options }) => {
            return `Displayed ${options.length} response options. Waiting for technician selection.`;
          },
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
          execute: async ({ expert_name }) => {
            return `Displayed escalation card recommending ${expert_name}.`;
          },
        }),
        show_session_summary: tool({
          description:
            "Display a resolution/session summary card that will be auto-attached to the work order. Use this when the issue has been resolved or escalated. The card shows labeled sections: Recommendation, Resolution, Steps attempted, and Issue.",
          inputSchema: z.object({
            recommendation: z
              .string()
              .optional()
              .describe(
                "Follow-up recommendation, e.g. 'Investigate potential oil leak. Check fittings and gaskets during next PM.'"
              ),
            outcome: z
              .string()
              .describe(
                "The resolution, e.g. 'Added compressor oil to proper level.'"
              ),
            steps_attempted: z
              .array(z.string())
              .describe("List of diagnostic steps that were attempted"),
            issue: z
              .string()
              .optional()
              .describe(
                "Root cause summary, e.g. 'Thermal overload caused by low compressor oil.'"
              ),
          }),
          execute: async ({ outcome }) => {
            return `Displayed session summary. Resolution: ${outcome}`;
          },
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
