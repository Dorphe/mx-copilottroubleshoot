"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Header } from "./header";
import { StartScreen } from "./start-screen";
import { CopilotMessage } from "./copilot-message";
import { UserMessage } from "./user-message";
import { TroubleshootingCard } from "./troubleshooting-card";
import { EscalationCard } from "./escalation-card";
import { SessionSummary } from "./session-summary";
import { TypingIndicator } from "./typing-indicator";
import { InputBar } from "./input-bar";
import { SCENARIO } from "@/lib/scenario";

export function Chat() {
  const [phase, setPhase] = useState<"start" | "chat">("start");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleReset = () => {
    setPhase("start");
    setMessages([]);
    setInput("");
  };

  const handleStartAction = (action: string) => {
    if (action === "troubleshoot") {
      setPhase("chat");
      sendMessage({
        text: `I need help troubleshooting this work order. Here's the situation:\n\nWork Order #${SCENARIO.wo.number}: ${SCENARIO.wo.title}\n\n${SCENARIO.wo.description}\n\n${SCENARIO.wo.history}\n\nPlease help me diagnose and resolve this.`,
      });
    } else if (action === "manual") {
      setPhase("chat");
      sendMessage({
        text: `I'd like to look something up in the operator's manual for the ${SCENARIO.asset.name}. What can you help me find?`,
      });
    } else if (action === "history") {
      setPhase("chat");
      sendMessage({
        text: `Can you give me a summary of the work history for the ${SCENARIO.asset.name} (${SCENARIO.asset.id})?`,
      });
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    if (phase === "start") {
      setPhase("chat");
    }
    sendMessage({ text: input });
    setInput("");
  };

  const renderMessage = (message: (typeof messages)[number]) => {
    if (message.role === "user") {
      const text = message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
      return <UserMessage key={message.id} text={text} />;
    }

    if (message.role === "assistant") {
      const elements: React.ReactNode[] = [];

      for (let i = 0; i < message.parts.length; i++) {
        const part = message.parts[i];

        if (part.type === "text" && part.text.trim()) {
          elements.push(
            <CopilotMessage key={`${message.id}-text-${i}`}>
              <span className="whitespace-pre-wrap">{part.text}</span>
            </CopilotMessage>
          );
        } else if (part.type === "dynamic-tool") {
          const { toolName } = part;
          const args = ("input" in part ? part.input : {}) as Record<
            string,
            unknown
          >;

          if (toolName === "show_troubleshooting_card" && args) {
            elements.push(
              <TroubleshootingCard
                key={`${message.id}-tool-${i}`}
                recommendation={args.recommendation as string}
                sources={(args.sources as string[]) || []}
              />
            );
          } else if (toolName === "show_escalation_card" && args) {
            elements.push(
              <EscalationCard
                key={`${message.id}-tool-${i}`}
                expertName={args.expert_name as string}
                expertTitle={args.expert_title as string}
                availability={args.availability as string}
                reason={args.reason as string}
              />
            );
          } else if (toolName === "show_session_summary" && args) {
            elements.push(
              <SessionSummary
                key={`${message.id}-tool-${i}`}
                stepsAttempted={args.steps_attempted as string[]}
                outcome={args.outcome as string}
              />
            );
          }
        }
      }

      if (elements.length === 0) {
        return null;
      }

      return <>{elements}</>;
    }

    return null;
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
            {status === "submitted" && <TypingIndicator />}
          </div>
        )}
      </div>

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        placeholder="Ask CoPilot"
        isLoading={isLoading}
      />
    </div>
  );
}
