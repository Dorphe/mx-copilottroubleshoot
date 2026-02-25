"use client";

import { useState } from "react";
import { Icon } from "./icons";

interface TriageCardProps {
  question: string;
  items: string[];
  noneOption: string;
  onRespond: (response: string) => void;
}

export function TriageCard({
  question,
  items,
  noneOption,
  onRespond,
}: TriageCardProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (index: number) => {
    if (submitted) return;
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNone = () => {
    if (submitted) return;
    setSubmitted(true);
    onRespond(noneOption);
  };

  const handleSubmit = () => {
    if (submitted) return;
    const selected = items.filter((_, i) => checked[i]);
    if (selected.length === 0) return;
    setSubmitted(true);
    onRespond(
      `I've already done: ${selected.join(", ")}`
    );
  };

  const hasChecked = Object.values(checked).some(Boolean);

  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleToggle(i)}
            disabled={submitted}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-[16px] leading-[24px] transition-colors cursor-pointer disabled:cursor-default ${
              checked[i]
                ? "border-stroke-accent bg-bg-expressive-blue text-text-primary"
                : "border-stroke-default bg-bg-primary text-text-primary hover:bg-bg-secondary"
            }`}
          >
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked[i]
                  ? "border-text-informative bg-text-informative"
                  : "border-stroke-default bg-bg-primary"
              }`}
            >
              {checked[i] && (
                <Icon name="check" size={14} color="white" />
              )}
            </span>
            {item}
          </button>
        ))}

        <button
          onClick={handleNone}
          disabled={submitted}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-stroke-default bg-bg-secondary text-left text-[16px] leading-[24px] text-text-primary hover:bg-bg-secondary-hover transition-colors cursor-pointer disabled:cursor-default disabled:opacity-60"
        >
          <span className="w-5 h-5 rounded-full border-2 border-text-informative flex items-center justify-center shrink-0">
            <span className="text-text-informative text-xs font-bold">?</span>
          </span>
          {noneOption}
        </button>

        {hasChecked && !submitted && (
          <button
            onClick={handleSubmit}
            className="mt-1 px-4 py-2 rounded-lg bg-text-informative text-white text-[14px] font-semibold cursor-pointer hover:opacity-90 transition-opacity self-start"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
