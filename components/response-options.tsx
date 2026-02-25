"use client";

import { useState } from "react";
import { Icon } from "./icons";

interface ResponseOptionsProps {
  options: string[];
  onRespond: (response: string) => void;
}

export function ResponseOptions({ options, onRespond }: ResponseOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    onRespond(option);
  };

  return (
    <div className="px-4 animate-[fade-in-up_0.3s_ease]">
      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          const isSelected = selected === option;
          const iconName = i === 0 ? "check" : "close";
          const iconColor =
            i === 0
              ? "var(--color-text-positive)"
              : "var(--color-text-secondary)";

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-[16px] leading-[24px] transition-colors cursor-pointer disabled:cursor-default ${
                isSelected
                  ? "border-stroke-accent bg-bg-expressive-blue text-text-primary"
                  : selected
                  ? "border-stroke-default bg-bg-primary text-text-secondary opacity-50"
                  : "border-stroke-default bg-bg-primary text-text-primary hover:bg-bg-secondary"
              }`}
            >
              <Icon name={iconName} size={18} color={iconColor} />
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
