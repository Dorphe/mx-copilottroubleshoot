"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Header } from "./header";
import { StartScreen } from "./start-screen";
import { CopilotMessage } from "./copilot-message";
import { UserMessage } from "./user-message";
import { TroubleshootingCard } from "./troubleshooting-card";
import { EscalationCard } from "./escalation-card";
import { SessionSummary } from "./session-summary";
import { TypingIndicator } from "./typing-indicator";
import { InputBar } from "./input-bar";
import {
  TROUBLESHOOT_FLOW,
  ALTERNATE_FLOW_COOLANT_OK,
  ESCALATION_STEP,
  detectBranch,
  type ScriptedStep,
  type ToolCard,
} from "@/lib/scripted-flow";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  tools: ToolCard[];
}

/* ------------------------------------------------------------------ */
/*  Chat component                                                     */
/* ------------------------------------------------------------------ */

export function Chat() {
  const [phase, setPhase] = useState<"start" | "chat">("start");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [pendingTools, setPendingTools] = useState<ToolCard[]>([]);
  const [showTools, setShowTools] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [usedAlternate, setUsedAlternate] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const idCounter = useRef(0);

  const nextId = () => `msg-${++idCounter.current}`;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isStreaming, showTools]);

  /* ---------------------------------------------------------------- */
  /*  Simulated streaming                                              */
  /* ---------------------------------------------------------------- */

  const streamStep = useCallback(
    async (step: ScriptedStep) => {
      abortRef.current = false;
      setIsStreaming(true);
      setStreamingText("");
      setPendingTools(step.tools);
      setShowTools(false);
      setSuggestions([]);

      // Thinking delay
      await delay(800);
      if (abortRef.current) return;

      // Stream each text segment character by character
      const fullText = step.text.join("");
      let accumulated = "";

      for (let i = 0; i < fullText.length; i++) {
        if (abortRef.current) return;
        accumulated += fullText[i];
        setStreamingText(accumulated);
        // Variable speed: faster for spaces/newlines, slower for punctuation
        const char = fullText[i];
        if (char === "." || char === "?" || char === "!") {
          await delay(60);
        } else if (char === "," || char === ":") {
          await delay(30);
        } else if (char === "\n") {
          await delay(20);
        } else {
          await delay(12);
        }
      }

      if (abortRef.current) return;

      // Commit the streamed text as a message
      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: "assistant",
        text: fullText,
        tools: step.tools,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText("");
      setIsStreaming(false);

      // Show tools with a brief delay
      if (step.tools.length > 0) {
        await delay(300);
        setShowTools(true);
      }

      // Show suggestion chips
      if (step.suggestions && step.suggestions.length > 0) {
        await delay(400);
        setSuggestions(step.suggestions);
      }
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  User interaction handlers                                        */
  /* ---------------------------------------------------------------- */

  const handleReset = () => {
    abortRef.current = true;
    setPhase("start");
    setMessages([]);
    setInput("");
    setIsStreaming(false);
    setStreamingText("");
    setPendingTools([]);
    setShowTools(false);
    setSuggestions([]);
    setStepIndex(0);
    setUsedAlternate(false);
  };

  const processUserMessage = useCallback(
    (text: string, currentStep: number) => {
      // Determine which scripted step to show next
      const branch = detectBranch(text);
      let nextStep: ScriptedStep;
      let nextIndex = currentStep;

      if (branch === "escalate") {
        nextStep = ESCALATION_STEP;
        nextIndex = TROUBLESHOOT_FLOW.length; // end
      } else if (currentStep === 2 && branch === "ok" && !usedAlternate) {
        // Coolant is fine at step 2 — use alternate branch
        nextStep = ALTERNATE_FLOW_COOLANT_OK;
        setUsedAlternate(true);
        nextIndex = currentStep + 1;
      } else if (currentStep < TROUBLESHOOT_FLOW.length) {
        nextStep = TROUBLESHOOT_FLOW[currentStep];
        nextIndex = currentStep + 1;
      } else {
        // Past the end — escalation fallback
        nextStep = ESCALATION_STEP;
        nextIndex = currentStep;
      }

      setStepIndex(nextIndex);
      streamStep(nextStep);
    },
    [streamStep, usedAlternate]
  );

  const handleStartAction = (action: string) => {
    setPhase("chat");

    if (action === "troubleshoot") {
      // Add the user's initial message
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        text: "I need help troubleshooting this engine overheating issue.",
        tools: [],
      };
      setMessages([userMsg]);
      setStepIndex(1);
      streamStep(TROUBLESHOOT_FLOW[0]);
    } else if (action === "manual") {
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        text: "I'd like to look something up in the operator's manual.",
        tools: [],
      };
      setMessages([userMsg]);
      // For demo purposes, direct to troubleshooting flow
      setStepIndex(1);
      streamStep({
        text: [
          "I have access to the Kubota RTV-XG850 Operator's Manual (Code No. K7814-7121-2). I can help you find information on maintenance procedures, troubleshooting, specifications, and more.",
          "\n\nWhat would you like to look up? Some common topics:",
          "\n\n• Engine overheating causes & fixes (pp. 85–86)\n• Daily pre-operation inspection checklist (p. 57)\n• Coolant & lubricant specifications (p. 53)\n• Fuse box locations & ratings (pp. 80–81)",
        ],
        tools: [],
        suggestions: [
          "What are the causes of engine overheating?",
          "Show me the daily inspection checklist",
          "What coolant should I use?",
        ],
      });
    } else if (action === "history") {
      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        text: "Can you give me a work history summary for this asset?",
        tools: [],
      };
      setMessages([userMsg]);
      streamStep({
        text: [
          "Here's the recent work history for the **Kubota Sidekick RTV-XG850** (RTV-XG850-0147):",
          "\n\n**WO #49312** — 5 weeks ago (J. Torres)\n100-hour service: oil change & air cleaner cleaning. All fluids within spec. Next oil change due at 580 hours.",
          "\n\n**WO #47801** — 3 months ago (M. Rivera)\nRadiator screen cleaning. Unit was running warm. Found the screen heavily clogged with grass and dirt. Resolved after cleaning. Recommendation: daily screen cleaning during mowing season.",
          "\n\nNotable pattern: this unit accumulates debris quickly due to its grounds maintenance role. The previous warm-running issue was also cooling-related.",
        ],
        tools: [],
        suggestions: [
          "Let's troubleshoot the current overheating issue",
          "When is the next scheduled PM?",
        ],
      });
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    sendUserMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (text: string) => {
    if (isStreaming) return;
    sendUserMessage(text);
  };

  const sendUserMessage = (text: string) => {
    if (phase === "start") setPhase("chat");
    setSuggestions([]);
    setShowTools(false);

    const userMsg: ChatMessage = {
      id: nextId(),
      role: "user",
      text,
      tools: [],
    };
    setMessages((prev) => [...prev, userMsg]);
    processUserMessage(text, stepIndex);
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const renderMessage = (message: ChatMessage) => {
    if (message.role === "user") {
      return <UserMessage key={message.id} text={message.text} />;
    }

    const elements: React.ReactNode[] = [];

    if (message.text.trim()) {
      elements.push(
        <CopilotMessage key={`${message.id}-text`}>
          <span
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownInline(message.text),
            }}
          />
        </CopilotMessage>
      );
    }

    for (let i = 0; i < message.tools.length; i++) {
      const tool = message.tools[i];
      if (tool.type === "troubleshooting") {
        elements.push(
          <TroubleshootingCard
            key={`${message.id}-tool-${i}`}
            recommendation={tool.recommendation}
            sources={tool.sources}
          />
        );
      } else if (tool.type === "escalation") {
        elements.push(
          <EscalationCard
            key={`${message.id}-tool-${i}`}
            expertName={tool.expertName}
            expertTitle={tool.expertTitle}
            availability={tool.availability}
            reason={tool.reason}
          />
        );
      } else if (tool.type === "summary") {
        elements.push(
          <SessionSummary
            key={`${message.id}-tool-${i}`}
            stepsAttempted={tool.stepsAttempted}
            outcome={tool.outcome}
          />
        );
      }
    }

    return <>{elements}</>;
  };

  return (
    <div className="w-full h-screen bg-bg-primary flex flex-col relative overflow-hidden mx-auto">
      <Header onReset={handleReset} />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
      >
        {phase === "start" ? (
          <StartScreen onAction={handleStartAction} />
        ) : (
          <div className="flex-1 flex flex-col justify-end gap-8 py-4">
            {messages.map(renderMessage)}

            {/* Streaming text in progress */}
            {isStreaming && streamingText && (
              <CopilotMessage>
                <span
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownInline(streamingText),
                  }}
                />
                <span className="inline-block w-0.5 h-4 bg-text-primary ml-0.5 animate-pulse align-text-bottom" />
              </CopilotMessage>
            )}

            {/* Thinking indicator */}
            {isStreaming && !streamingText && <TypingIndicator />}

            {/* Tool cards shown after streaming completes */}
            {showTools &&
              !isStreaming &&
              messages.length > 0 &&
              messages[messages.length - 1].tools.length === 0 &&
              pendingTools.map((tool, i) => {
                if (tool.type === "troubleshooting") {
                  return (
                    <TroubleshootingCard
                      key={`pending-tool-${i}`}
                      recommendation={tool.recommendation}
                      sources={tool.sources}
                    />
                  );
                } else if (tool.type === "escalation") {
                  return (
                    <EscalationCard
                      key={`pending-tool-${i}`}
                      expertName={tool.expertName}
                      expertTitle={tool.expertTitle}
                      availability={tool.availability}
                      reason={tool.reason}
                    />
                  );
                } else if (tool.type === "summary") {
                  return (
                    <SessionSummary
                      key={`pending-tool-${i}`}
                      stepsAttempted={tool.stepsAttempted}
                      outcome={tool.outcome}
                    />
                  );
                }
                return null;
              })}

            {/* Suggestion chips */}
            {suggestions.length > 0 && !isStreaming && (
              <div className="flex flex-wrap gap-2 px-4 animate-[fade-in-up_0.3s_ease]">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-2 text-sm text-text-informative bg-bg-primary-accent border border-stroke-default rounded-lg cursor-pointer hover:bg-bg-expressive-blue transition-colors text-left leading-5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        placeholder="Ask CoPilot"
        isLoading={isStreaming}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Minimal inline markdown: bold (**text**) and bullet points */
function formatMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^• /gm, "&#8226; ");
}
